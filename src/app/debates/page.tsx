import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { preloadQuery } from "convex/nextjs"
import { Metadata } from "next"
import { DebatesList } from "~/components/DebatesList"
import { api } from "../../../convex/_generated/api"

export const metadata: Metadata = {
  title: "Debates",
  description: "View and manage your fact-checked debates.",
  robots: { index: false },
}

export default async function DebatesPage() {
  const preloadedDebates = await preloadQuery(
    api.debates.list,
    {},
    { token: await convexAuthNextjsToken() },
  )

  return <DebatesList preloadedDebates={preloadedDebates} />
}
