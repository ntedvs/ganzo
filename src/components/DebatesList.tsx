"use client"

import { ArrowRight, Plus } from "@phosphor-icons/react"
import { Preloaded, usePreloadedQuery } from "convex/react"
import Link from "next/link"
import { Footer } from "~/components/Footer"
import { LiveBadge } from "~/components/LiveBadge"
import { formatDate } from "~/lib/format"
import { api } from "../../convex/_generated/api"

export function DebatesList({
  preloadedDebates,
}: {
  preloadedDebates: Preloaded<typeof api.debates.list>
}) {
  const debates = usePreloadedQuery(preloadedDebates)

  return (
    <div className="grid grid-rows-[1fr_auto] overflow-hidden">
      <div className="overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E5E5E5] bg-white/95 px-8 py-3 backdrop-blur-sm">
          <div className="flex items-center">
            <span className="text-[11px] font-semibold tracking-[0.08em] text-[#888] uppercase">
              Debates
            </span>
            {debates.length > 0 && (
              <span className="ml-2 text-[11px] font-semibold text-[#ccc] tabular-nums">
                {debates.length}
              </span>
            )}
          </div>
          <Link
            href="/debates/new"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] text-[#888] uppercase transition-colors duration-200 hover:text-black"
          >
            <Plus size={11} weight="bold" />
            New Debate
          </Link>
        </div>

        {debates.length === 0 ? (
          <div className="flex flex-col items-start gap-4 px-8 py-12">
            <p className="text-[13px] text-[#888]">No debates yet.</p>
            <Link
              href="/debates/new"
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] text-[#888] uppercase transition-colors duration-200 hover:text-black"
            >
              <Plus size={11} weight="bold" />
              Start your first debate
            </Link>
          </div>
        ) : (
          <div>
            {debates.map((debate) => (
              <Link
                key={debate._id}
                href={`/debates/${debate._id}`}
                className="group flex items-center justify-between border-b border-[#F0F0F0] px-8 py-5 transition-colors duration-150 hover:bg-[#FAFAFA]"
              >
                <span className="text-[13px] font-medium text-black">
                  {debate.speakerAName} vs {debate.speakerBName}
                </span>
                <div className="flex items-center gap-5">
                  {debate.status === "active" && <LiveBadge />}
                  <span className="text-[12px] text-[#999] tabular-nums">
                    {formatDate(debate.startedAt)}
                  </span>
                  <ArrowRight
                    size={12}
                    weight="bold"
                    className="text-[#ccc] transition-colors duration-150 group-hover:text-[#888]"
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
