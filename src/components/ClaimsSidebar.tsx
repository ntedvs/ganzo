"use client"

import { useEffect, useRef } from "react"
import { Doc } from "../../convex/_generated/dataModel"
import { ClaimCard } from "./ClaimCard"

interface ClaimsSidebarProps {
  claims: Doc<"claims">[]
}

export function ClaimsSidebar({ claims }: ClaimsSidebarProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const lastClaim = claims[claims.length - 1]

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [claims.length, lastClaim?.status, lastClaim?.verdict])

  return (
    <div>
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-[#E5E5E5] bg-white/95 px-8 py-3 backdrop-blur-sm">
        <span className="text-[11px] font-semibold tracking-[0.08em] text-[#888] uppercase">
          Claims
        </span>
        {claims.length > 0 && (
          <span className="text-[11px] font-semibold text-[#ccc] tabular-nums">
            {claims.length}
          </span>
        )}
      </div>

      {claims.length === 0 ? (
        <p className="px-8 py-6 text-[13px] leading-normal text-[#888]">
          Claims will appear here as speakers make factual statements.
        </p>
      ) : (
        <div>
          {claims.map((claim) => (
            <ClaimCard key={claim._id} claim={claim} />
          ))}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  )
}
