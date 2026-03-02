import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery, preloadQuery } from "convex/nextjs"
import { Metadata } from "next"
import { DebateReview } from "~/components/DebateReview"
import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ debateId: string }>
}): Promise<Metadata> {
  const { debateId } = await params
  const token = await convexAuthNextjsToken()
  try {
    const debate = await fetchQuery(
      api.debates.get,
      { debateId: debateId as Id<"debates"> },
      { token },
    )
    const title = debate
      ? `${debate.speakerAName} vs ${debate.speakerBName}`
      : "Debate"
    return {
      title,
      description: `Fact-checked debate: ${title}. View the full transcript with verified claims.`,
      alternates: { canonical: `/debates/${debateId}` },
      robots: { index: false },
    }
  } catch {
    return { title: "Debate", robots: { index: false } }
  }
}

export default async function DebateReviewPage({
  params,
}: {
  params: Promise<{ debateId: string }>
}) {
  const id = (await params).debateId as Id<"debates">
  const token = await convexAuthNextjsToken()

  const [preloadedDebate, preloadedChunks, preloadedClaims] = await Promise.all(
    [
      preloadQuery(api.debates.get, { debateId: id }, { token }),
      preloadQuery(
        api.transcriptChunks.listByDebate,
        { debateId: id },
        { token },
      ),
      preloadQuery(api.claims.listByDebate, { debateId: id }, { token }),
    ],
  )

  return (
    <DebateReview
      preloadedDebate={preloadedDebate}
      preloadedChunks={preloadedChunks}
      preloadedClaims={preloadedClaims}
    />
  )
}
