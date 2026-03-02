import { v } from "convex/values"
import { internal } from "./_generated/api"
import { query, internalMutation, internalQuery } from "./_generated/server"

const claimValidator = v.object({
  _id: v.id("claims"),
  _creationTime: v.number(),
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

export const listByDebate = query({
  args: { debateId: v.id("debates") },
  returns: v.array(claimValidator),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("claims")
      .withIndex("by_debate", (q) => q.eq("debateId", args.debateId))
      .collect()
  },
})

export const saveClaims = internalMutation({
  args: {
    claims: v.array(
      v.object({
        debateId: v.id("debates"),
        speaker: v.union(v.literal(0), v.literal(1)),
        claimText: v.string(),
        originalTranscriptExcerpt: v.string(),
      }),
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    for (const claim of args.claims) {
      const claimId = await ctx.db.insert("claims", {
        ...claim,
        status: "pending",
        extractedAt: Date.now(),
      })
      await ctx.scheduler.runAfter(0, internal.factCheck.check, { claimId })
    }
    return null
  },
})

export const saveClaim = internalMutation({
  args: {
    debateId: v.id("debates"),
    speaker: v.union(v.literal(0), v.literal(1)),
    claimText: v.string(),
    originalTranscriptExcerpt: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const claimId = await ctx.db.insert("claims", {
      ...args,
      status: "pending",
      extractedAt: Date.now(),
    })
    await ctx.scheduler.runAfter(0, internal.factCheck.check, { claimId })
    return null
  },
})

export const getById = internalQuery({
  args: { claimId: v.id("claims") },
  returns: v.union(claimValidator, v.null()),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.claimId)
  },
})

export const updateStatus = internalMutation({
  args: {
    claimId: v.id("claims"),
    status: v.union(
      v.literal("checking"),
      v.literal("true"),
      v.literal("false"),
      v.literal("mixed"),
      v.literal("unverifiable"),
    ),
    verdict: v.optional(v.string()),
    correction: v.optional(v.string()),
    sources: v.optional(v.array(v.string())),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { claimId, ...fields } = args
    await ctx.db.patch(claimId, {
      ...fields,
      checkedAt: Date.now(),
    })
    return null
  },
})
