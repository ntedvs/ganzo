# Stanzo

Real-time debate fact-checking. Every claim, verified live.

## What It Does

Stanzo captures live debate audio, transcribes it with speaker diarization, extracts factual claims as speakers talk, and verifies each claim against primary sources -- all in real-time. Claims stream into the UI as "pending" and update live to true, false, mixed, or unverifiable with citations.

## Pipeline

1. **Live Transcription** -- Audio streams to Deepgram's nova-3 model, which transcribes and diarizes speakers in real-time
2. **Claim Extraction** -- On each utterance boundary (1.5s silence), unprocessed transcript chunks are sent to Gemini 2.0 Flash with multi-turn conversation history for context-aware claim identification
3. **Fact-Checking** -- Each extracted claim triggers an async Perplexity Sonar call that returns a verdict, correction if needed, and source citations
4. **Live Updates** -- Convex reactive subscriptions push every state change to the UI instantly -- no polling

## Architecture

```
Browser Mic → Deepgram WebSocket → Convex DB (transcriptChunks)
                                        ↓
                                   Gemini 2.0 Flash (claim extraction w/ session history)
                                        ↓
                                   Convex DB (claims: pending)
                                        ↓
                                   Perplexity Sonar (fact-check)
                                        ↓
                                   Convex DB (claims: verdict + sources)
                                        ↓
                                   React UI (real-time subscriptions)
```

## Tech Stack

| Layer            | Technology                                            |
| ---------------- | ----------------------------------------------------- |
| Frontend         | Next.js 16, React 19, Tailwind CSS 4, TypeScript      |
| Backend          | Convex (serverless DB, mutations, scheduled actions)  |
| Transcription    | Deepgram nova-3 (live streaming, speaker diarization) |
| Claim Extraction | Google Gemini 2.0 Flash (multi-turn JSONL output)     |
| Fact-Checking    | Perplexity Sonar (verdict + citations)                |
| Auth             | GitHub OAuth via Convex Auth                          |
| Error Handling   | Effect library (retries, timeouts, structured errors) |

## Key Technical Decisions

- **Multi-turn extraction sessions** -- Gemini maintains conversation history per debate so it doesn't re-extract previously identified claims and can use prior context for ambiguous references
- **Streaming JSONL** -- Claims are parsed line-by-line from Gemini's response and inserted individually, so they appear in the UI as fast as possible
- **Scheduled fact-checking** -- Each claim insertion triggers an async Convex action, decoupling extraction throughput from fact-check latency
- **Functional error handling** -- Perplexity calls use the Effect library for exponential backoff retries (max 3) and structured timeouts rather than try/catch chains

## Data Model

| Table                | Key Fields                                                                                    |
| -------------------- | --------------------------------------------------------------------------------------------- |
| `debates`            | speakers, status (active/ended), timestamps                                                   |
| `transcriptChunks`   | debateId, speaker index, text, time range, processedForClaims flag                            |
| `claims`             | claimText, transcript excerpt, status (pending → checking → verdict), correction, source URLs |
| `extractionSessions` | debateId, full message history for multi-turn Gemini context                                  |

## Design

Monochromatic typographic UI using Host Grotesk. Two-panel layout: live transcript on the left, claims feed on the right with resizable divider. No accent colors except a pulsing red live indicator. See [`DESIGN.md`](./DESIGN.md) for the full design system spec.
