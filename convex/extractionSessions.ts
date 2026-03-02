import { v } from "convex/values"
import { internalMutation, internalQuery } from "./_generated/server"

const messageValidator = v.object({
  role: v.union(v.literal("user"), v.literal("model")),
  content: v.string(),
})

export const getByDebate = internalQuery({
  args: { debateId: v.id("debates") },
  returns: v.union(
    v.object({
      _id: v.id("extractionSessions"),
      _creationTime: v.number(),
      debateId: v.id("debates"),
      messages: v.array(messageValidator),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("extractionSessions")
      .withIndex("by_debate", (q) => q.eq("debateId", args.debateId))
      .first()
  },
})

export const upsert = internalMutation({
  args: {
    debateId: v.id("debates"),
    messages: v.array(messageValidator),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("extractionSessions")
      .withIndex("by_debate", (q) => q.eq("debateId", args.debateId))
      .first()
    if (existing) {
      await ctx.db.patch(existing._id, { messages: args.messages })
    } else {
      await ctx.db.insert("extractionSessions", {
        debateId: args.debateId,
        messages: args.messages,
      })
    }
    return null
  },
})
