import { getAuthUserId } from "@convex-dev/auth/server"
import { v } from "convex/values"
import { internal } from "./_generated/api"
import { mutation, query } from "./_generated/server"

const debateValidator = v.object({
  _id: v.id("debates"),
  _creationTime: v.number(),
  userId: v.id("users"),
  speakerAName: v.string(),
  speakerBName: v.string(),
  status: v.union(v.literal("active"), v.literal("ended")),
  startedAt: v.number(),
  endedAt: v.optional(v.number()),
})

export const create = mutation({
  args: {
    speakerAName: v.string(),
    speakerBName: v.string(),
  },
  returns: v.id("debates"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Not authenticated")

    return await ctx.db.insert("debates", {
      userId,
      speakerAName: args.speakerAName,
      speakerBName: args.speakerBName,
      status: "active",
      startedAt: Date.now(),
    })
  },
})

export const end = mutation({
  args: { debateId: v.id("debates") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Not authenticated")

    const debate = await ctx.db.get(args.debateId)
    if (!debate || debate.userId !== userId) throw new Error("Not found")

    await ctx.db.patch(args.debateId, {
      status: "ended",
      endedAt: Date.now(),
    })

    await ctx.scheduler.runAfter(0, internal.claimExtraction.extract, {
      debateId: args.debateId,
    })

    return null
  },
})

export const get = query({
  args: { debateId: v.id("debates") },
  returns: v.union(debateValidator, v.null()),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.debateId)
  },
})

export const list = query({
  args: {},
  returns: v.array(debateValidator),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return []

    return await ctx.db
      .query("debates")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect()
  },
})
