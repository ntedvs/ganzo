import Perplexity from "@perplexity-ai/perplexity_ai"
import { v } from "convex/values"
import { Data, Duration, Effect, Schedule, Schema } from "effect"
import { internal } from "./_generated/api"
import { internalAction } from "./_generated/server"

class PerplexityApiError extends Data.TaggedError("PerplexityApiError")<{
  message: string
}> {}

const FactCheckResultSchema = Schema.Struct({
  status: Schema.Union(
    Schema.Literal("true"),
    Schema.Literal("false"),
    Schema.Literal("mixed"),
    Schema.Literal("unverifiable"),
  ),
  verdict: Schema.String,
  correction: Schema.optional(Schema.NullOr(Schema.String)),
})

const fallbackResult = {
  status: "unverifiable" as const,
  verdict: "Could not parse result",
  correction: undefined,
}

const stripCitations = (s: string): string => s.replace(/\[\d+\]/g, "").trim()

function parseJsonLoose(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    const match = text.match(/\{[\s\S]*\}/)
    return match ? JSON.parse(match[0]) : {}
  }
}

const callPerplexity = (apiKey: string, claimText: string) =>
  Effect.gen(function* () {
    const client = new Perplexity({ apiKey })

    const response = yield* Effect.tryPromise({
      try: () =>
        client.chat.completions.create({
          model: "sonar",
          messages: [
            {
              role: "system",
              content:
                "You are a fact-checker. Evaluate the following claim and respond with ONLY a JSON object containing: status (one of: true, false, mixed, unverifiable), verdict (brief explanation), correction (if false or mixed, the correct information; otherwise null). Keep verdict and correction to ~30 words each.",
            },
            {
              role: "user",
              content: `Fact-check this claim: "${claimText}"`,
            },
          ],
        }),
      catch: (e) => new PerplexityApiError({ message: String(e) }),
    })

    const content = response.choices?.[0]?.message?.content
    const text = typeof content === "string" ? content : "{}"
    const citations = (response.citations ?? []).map(String)

    const parsed = yield* Effect.try({
      try: () => parseJsonLoose(text),
      catch: () => ({}) as unknown,
    })

    const result = yield* Schema.decodeUnknown(FactCheckResultSchema)(
      parsed,
    ).pipe(Effect.catchAll(() => Effect.succeed(fallbackResult)))

    return {
      ...result,
      verdict: stripCitations(result.verdict),
      correction: result.correction
        ? stripCitations(result.correction)
        : undefined,
      citations,
    }
  }).pipe(
    Effect.retry({
      schedule: Schedule.exponential(Duration.seconds(1)).pipe(
        Schedule.intersect(Schedule.recurs(3)),
      ),
      while: (e) => e instanceof PerplexityApiError,
    }),
    Effect.timeout(Duration.seconds(30)),
  )

export const check = internalAction({
  args: { claimId: v.id("claims") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.runMutation(internal.claims.updateStatus, {
      claimId: args.claimId,
      status: "checking",
    })

    const claim = await ctx.runQuery(internal.claims.getById, {
      claimId: args.claimId,
    })
    if (!claim) return null

    const apiKey = process.env.PERPLEXITY_API_KEY
    if (!apiKey) throw new Error("PERPLEXITY_API_KEY not set")

    const factCheck = await Effect.runPromise(
      callPerplexity(apiKey, claim.claimText).pipe(
        Effect.catchAll((e) => {
          console.error("Fact check failed:", e)
          return Effect.succeed({
            ...fallbackResult,
            citations: [] as string[],
          })
        }),
      ),
    )

    await ctx.runMutation(internal.claims.updateStatus, {
      claimId: args.claimId,
      status: factCheck.status,
      verdict: factCheck.verdict,
      correction: factCheck.correction ?? undefined,
      sources: factCheck.citations.length > 0 ? factCheck.citations : undefined,
    })
    return null
  },
})
