import { v } from "convex/values"
import { internal } from "./_generated/api"
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server"

const chunkValidator = v.object({
  _id: v.id("transcriptChunks"),
  _creationTime: v.number(),
  debateId: v.id("debates"),
  speaker: v.union(v.literal(0), v.literal(1)),
  text: v.string(),
  startTime: v.number(),
  endTime: v.number(),
  processedForClaims: v.boolean(),
})

export const insert = mutation({
  args: {
    debateId: v.id("debates"),
    speaker: v.union(v.literal(0), v.literal(1)),
    text: v.string(),
    startTime: v.number(),
    endTime: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.insert("transcriptChunks", {
      ...args,
      processedForClaims: false,
    })
    return null
  },
})

export const triggerExtraction = mutation({
  args: { debateId: v.id("debates") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.scheduler.runAfter(0, internal.claimExtraction.extract, {
      debateId: args.debateId,
    })
    return null
  },
})

export const listByDebate = query({
  args: { debateId: v.id("debates") },
  returns: v.array(chunkValidator),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("transcriptChunks")
      .withIndex("by_debate_and_time", (q) => q.eq("debateId", args.debateId))
      .collect()
  },
})

export const getUnprocessed = internalQuery({
  args: { debateId: v.id("debates") },
  returns: v.array(chunkValidator),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("transcriptChunks")
      .withIndex("by_debate_unprocessed", (q) =>
        q.eq("debateId", args.debateId).eq("processedForClaims", false),
      )
      .collect()
  },
})

export const markProcessed = internalMutation({
  args: { chunkIds: v.array(v.id("transcriptChunks")) },
  returns: v.null(),
  handler: async (ctx, args) => {
    for (const id of args.chunkIds) {
      await ctx.db.patch(id, { processedForClaims: true })
    }
    return null
  },
})
