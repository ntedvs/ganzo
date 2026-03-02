import { GoogleGenAI } from "@google/genai"
import { v } from "convex/values"
import { Data, Duration, Effect, Schema } from "effect"
import { api, internal } from "./_generated/api"
import { internalAction } from "./_generated/server"

class GeminiApiError extends Data.TaggedError("GeminiApiError")<{
  message: string
}> {}

const ClaimSchema = Schema.Struct({
  speaker: Schema.Union(Schema.Literal(0), Schema.Literal(1)),
  claimText: Schema.String,
  originalTranscriptExcerpt: Schema.String,
})

type ClaimData = typeof ClaimSchema.Type

function parseClaim(line: string): ClaimData | null {
  if (line === "NO_CLAIMS") return null
  try {
    return Schema.decodeUnknownSync(ClaimSchema)(JSON.parse(line))
  } catch {
    return null
  }
}

type Message = { role: "user" | "model"; content: string }

const streamClaims = (
  apiKey: string,
  systemPrompt: string,
  messages: Message[],
  onClaim: (claim: ClaimData) => Promise<void>,
) =>
  Effect.tryPromise({
    try: async () => {
      const client = new GoogleGenAI({ apiKey })
      const stream = await client.models.generateContentStream({
        model: "gemini-2.5-flash",
        config: {
          maxOutputTokens: 4096,
          systemInstruction: systemPrompt,
        },
        contents: messages.map((m) => ({
          role: m.role,
          parts: [{ text: m.content }],
        })),
      })

      let buffer = ""
      let fullResponse = ""

      for await (const chunk of stream) {
        const text = chunk.text ?? ""
        buffer += text
        fullResponse += text

        let newlineIdx: number
        while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
          const line = buffer.slice(0, newlineIdx).trim()
          buffer = buffer.slice(newlineIdx + 1)
          const claim = line ? parseClaim(line) : null
          if (claim) await onClaim(claim)
        }
      }

      const remaining = buffer.trim()
      const claim = remaining ? parseClaim(remaining) : null
      if (claim) await onClaim(claim)

      return fullResponse
    },
    catch: (e) => new GeminiApiError({ message: String(e) }),
  }).pipe(Effect.timeout(Duration.seconds(60)))

function buildSystemPrompt(speakerA: string, speakerB: string): string {
  return `You are a factual claim extractor for a live debate between ${speakerA} (speaker 0) and ${speakerB} (speaker 1).

Each turn, I provide a new transcript segment. You have the full conversation history.

Rules:
- ONLY extract claims from the NEW segment in my latest message
- Do NOT re-extract claims from previous turns
- Extract specific, verifiable factual claims (statistics, dates, named facts, causal claims)
- Extract the factual core when mixed with opinion
- Ignore purely opinion/prediction/subjective statements
- Use context to resolve pronouns and references

Output: JSONL, one object per line:
- speaker: 0 for ${speakerA}, 1 for ${speakerB}
- claimText: concise factual claim
- originalTranscriptExcerpt: quote from the new segment

If no factual claims, output: NO_CLAIMS
No markdown, no explanation, no array brackets.`
}

export const extract = internalAction({
  args: { debateId: v.id("debates") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const chunks = await ctx.runQuery(
      internal.transcriptChunks.getUnprocessed,
      { debateId: args.debateId },
    )
    if (chunks.length === 0) return null

    // Mark processed before calling LLM to prevent duplicate extraction
    await ctx.runMutation(internal.transcriptChunks.markProcessed, {
      chunkIds: chunks.map((c) => c._id),
    })

    const debate = await ctx.runQuery(api.debates.get, {
      debateId: args.debateId,
    })
    if (!debate) return null

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) throw new Error("GEMINI_API_KEY not set")

    const speakerNames = [debate.speakerAName, debate.speakerBName]
    const systemPrompt = buildSystemPrompt(speakerNames[0], speakerNames[1])

    // Load existing conversation history
    const session = await ctx.runQuery(
      internal.extractionSessions.getByDebate,
      { debateId: args.debateId },
    )
    const existingMessages: Message[] = session?.messages ?? []

    // Build new user message from chunks
    const newUserMessage = chunks
      .map((c) => `[${speakerNames[c.speaker]}]: ${c.text}`)
      .join("\n")

    const messages: Message[] = [
      ...existingMessages,
      { role: "user", content: newUserMessage },
    ]

    const result = await Effect.runPromise(
      streamClaims(apiKey, systemPrompt, messages, async (claim) => {
        await ctx.runMutation(internal.claims.saveClaim, {
          debateId: args.debateId,
          speaker: claim.speaker,
          claimText: claim.claimText,
          originalTranscriptExcerpt: claim.originalTranscriptExcerpt,
        })
      }).pipe(
        Effect.catchAll((e) => {
          console.error("Claim extraction failed:", e)
          return Effect.succeed(undefined)
        }),
      ),
    )

    // Persist conversation history if LLM responded
    if (result) {
      await ctx.runMutation(internal.extractionSessions.upsert, {
        debateId: args.debateId,
        messages: [...messages, { role: "model", content: result }],
      })
    }

    return null
  },
})
