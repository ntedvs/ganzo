"use client"

import { ArrowLeft } from "@phosphor-icons/react"
import { useMutation, useQuery } from "convex/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { ClaimsSidebar } from "~/components/ClaimsSidebar"
import { DebateControls } from "~/components/DebateControls"
import { ResizablePanelLayout } from "~/components/ResizablePanelLayout"
import { Transcript } from "~/components/Transcript"
import { useDeepgram } from "~/hooks/useDeepgram"
import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"

export default function NewDebatePage() {
  const router = useRouter()
  const [debateId, setDebateId] = useState<Id<"debates"> | null>(null)

  const debateArgs = debateId ? { debateId } : ("skip" as const)
  const debate = useQuery(api.debates.get, debateArgs)
  const chunks = useQuery(api.transcriptChunks.listByDebate, debateArgs)
  const claims = useQuery(api.claims.listByDebate, debateArgs)

  const isActive = debate?.status === "active"
  const { interim, error, start, stop } = useDeepgram(debateId)
  const endDebate = useMutation(api.debates.end)

  // Track latest values in refs for cleanup
  const debateIdRef = useRef(debateId)
  const isActiveRef = useRef(isActive)
  debateIdRef.current = debateId
  isActiveRef.current = isActive

  // Auto-end debate on unmount or tab close
  useEffect(() => {
    const cleanup = () => {
      if (debateIdRef.current && isActiveRef.current) {
        stop()
        void endDebate({ debateId: debateIdRef.current })
      }
    }
    const onBeforeUnload = () => cleanup()
    window.addEventListener("beforeunload", onBeforeUnload)
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload)
      cleanup()
    }
  }, [endDebate, stop])

  const handleDebateCreated = useCallback(
    async (id: Id<"debates">) => {
      setDebateId(id)
      await start(id)
    },
    [start],
  )

  const handleDebateEnded = useCallback(() => {
    stop()
    if (debateId) {
      router.push(`/debates/${debateId}`)
    }
  }, [stop, debateId, router])

  const controlsProps = {
    debateId: debateId ?? undefined,
    isActive,
    onDebateCreated: handleDebateCreated,
    onDebateEnded: handleDebateEnded,
  }

  return (
    <div className="grid grid-rows-[auto_1fr] overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#E5E5E5] px-8 py-3">
        <Link
          href="/debates"
          className="inline-flex w-fit items-center gap-1.5 text-[11px] font-semibold tracking-[0.08em] text-[#888] uppercase transition-colors duration-200 hover:text-black"
        >
          <ArrowLeft size={13} weight="bold" />
          Back
        </Link>

        {isActive && <DebateControls {...controlsProps} compact />}
      </div>

      {error && (
        <div className="border-b border-[#F0F0F0] px-8 py-2.5 text-[11px] font-semibold tracking-[0.08em] text-[#888] uppercase">
          {error}
        </div>
      )}

      {!isActive ? (
        <div className="flex items-center justify-center">
          <DebateControls {...controlsProps} />
        </div>
      ) : (
        <ResizablePanelLayout
          main={
            <Transcript
              chunks={chunks ?? []}
              speakerAName={debate?.speakerAName ?? "Speaker A"}
              speakerBName={debate?.speakerBName ?? "Speaker B"}
              interimText={interim?.text}
              interimSpeaker={interim?.speaker}
            />
          }
          sidebar={<ClaimsSidebar claims={claims ?? []} />}
        />
      )}
    </div>
  )
}
