import { getAuthUserId } from "@convex-dev/auth/server"
import { v } from "convex/values"
import { action } from "./_generated/server"

export const mint = action({
  args: {},
  returns: v.object({ token: v.string() }),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Not authenticated")

    const apiKey = process.env.DEEPGRAM_API_KEY
    if (!apiKey) throw new Error("DEEPGRAM_API_KEY not set")

    const res = await fetch("https://api.deepgram.com/v1/auth/grant", {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ttl_seconds: 300 }),
    })

    if (!res.ok) {
      throw new Error(`Deepgram token grant failed: ${res.status}`)
    }

    const { access_token } = (await res.json()) as { access_token: string }
    return { token: access_token }
  },
})
