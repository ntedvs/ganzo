import { authTables } from "@convex-dev/auth/server"
import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  ...authTables,

  debates: defineTable({
    userId: v.id("users"),
    speakerAName: v.string(),
    speakerBName: v.string(),
    status: v.union(v.literal("active"), v.literal("ended")),
    startedAt: v.number(),
    endedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_status", ["userId", "status"]),

  transcriptChunks: defineTable({
    debateId: v.id("debates"),
    speaker: v.union(v.literal(0), v.literal(1)),
    text: v.string(),
    startTime: v.number(),
    endTime: v.number(),
    processedForClaims: v.boolean(),
  })
    .index("by_debate", ["debateId"])
    .index("by_debate_and_time", ["debateId", "startTime"])
    .index("by_debate_unprocessed", ["debateId", "processedForClaims"]),

  claims: defineTable({
    debateId: v.id("debates"),
    speaker: v.union(v.literal(0), v.literal(1)),
    claimText: v.string(),
    originalTranscriptExcerpt: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("checking"),
      v.literal("true"),
      v.literal("false"),
      v.literal("mixed"),
      v.literal("unverifiable"),
    ),
    verdict: v.optional(v.string()),
    correction: v.optional(v.string()),
    sources: v.optional(v.array(v.string())),
    extractedAt: v.number(),
    checkedAt: v.optional(v.number()),
  })
    .index("by_debate", ["debateId"])
    .index("by_debate_and_status", ["debateId", "status"])
    .index("by_status", ["status"]),

  extractionSessions: defineTable({
    debateId: v.id("debates"),
    messages: v.array(
      v.object({
        role: v.union(v.literal("user"), v.literal("model")),
        content: v.string(),
      }),
    ),
  }).index("by_debate", ["debateId"]),
})
