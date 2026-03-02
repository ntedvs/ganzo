"use client"

import { ArrowLeft } from "@phosphor-icons/react"
import { Preloaded, usePreloadedQuery } from "convex/react"
import Link from "next/link"
import { ClaimsSidebar } from "~/components/ClaimsSidebar"
import { LiveBadge } from "~/components/LiveBadge"
import { ResizablePanelLayout } from "~/components/ResizablePanelLayout"
import { Transcript } from "~/components/Transcript"
import { formatDate, formatDuration } from "~/lib/format"
import { api } from "../../convex/_generated/api"

export function DebateReview({
  preloadedDebate,
  preloadedChunks,
  preloadedClaims,
}: {
  preloadedDebate: Preloaded<typeof api.debates.get>
  preloadedChunks: Preloaded<typeof api.transcriptChunks.listByDebate>
  preloadedClaims: Preloaded<typeof api.claims.listByDebate>
}) {
  const debate = usePreloadedQuery(preloadedDebate)
  const chunks = usePreloadedQuery(preloadedChunks)
  const claims = usePreloadedQuery(preloadedClaims)

  if (!debate) {
    return (
      <div className="flex h-screen items-center justify-center text-[13px] text-[#888]">
        Debate not found
      </div>
    )
  }

  return (
    <div className="grid grid-rows-[auto_1fr] overflow-hidden">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center border-b border-[#E5E5E5] px-8 py-3">
        <Link
          href="/debates"
          className="inline-flex w-fit items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] text-[#888] uppercase transition-colors duration-200 hover:text-black"
        >
          <ArrowLeft size={13} weight="bold" />
          Back
        </Link>

        <div className="relative flex items-center justify-center">
          <span className="absolute right-full mr-3 text-[12px] text-[#999] tabular-nums">
            {formatDuration((debate.endedAt ?? Date.now()) - debate.startedAt)}
          </span>
          <span className="text-[11px] font-semibold tracking-[0.08em] text-black uppercase">
            {debate.speakerAName} vs {debate.speakerBName}
          </span>
          <span className="absolute left-full ml-3 text-[12px] whitespace-nowrap text-[#999] tabular-nums">
            {formatDate(debate.startedAt)}
          </span>
        </div>

        <div className="flex items-center justify-end">
          {debate.status === "active" && <LiveBadge />}
          {debate.status === "ended" && (
            <span className="text-[11px] font-semibold tracking-[0.08em] text-[#888] uppercase">
              Ended
            </span>
          )}
        </div>
      </div>

      <ResizablePanelLayout
        main={
          <Transcript
            chunks={chunks}
            speakerAName={debate.speakerAName}
            speakerBName={debate.speakerBName}
          />
        }
        sidebar={<ClaimsSidebar claims={claims} />}
      />
    </div>
  )
}
