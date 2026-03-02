"use client"

import { useMutation } from "convex/react"
import { useState } from "react"
import { api } from "../../convex/_generated/api"
import { Id } from "../../convex/_generated/dataModel"
import { LiveBadge } from "./LiveBadge"

interface DebateControlsProps {
  debateId?: Id<"debates">
  isActive: boolean
  compact?: boolean
  onDebateCreated: (id: Id<"debates">) => void
  onDebateEnded: () => void
}

export function DebateControls({
  debateId,
  isActive,
  compact,
  onDebateCreated,
  onDebateEnded,
}: DebateControlsProps) {
  const [speakerA, setSpeakerA] = useState("Speaker A")
  const [speakerB, setSpeakerB] = useState("Speaker B")
  const createDebate = useMutation(api.debates.create)
  const endDebate = useMutation(api.debates.end)

  const handleStart = async () => {
    const id = await createDebate({
      speakerAName: speakerA,
      speakerBName: speakerB,
    })
    onDebateCreated(id)
  }

  const handleEnd = async () => {
    if (!debateId) return
    await endDebate({ debateId })
    onDebateEnded()
  }

  if (isActive && compact) {
    return (
      <div className="flex items-center gap-5">
        <LiveBadge />
        <button
          onClick={handleEnd}
          className="text-[11px] font-semibold tracking-[0.08em] text-[#888] uppercase transition-colors duration-200 hover:text-black"
        >
          End
        </button>
      </div>
    )
  }

  // Non-compact active state renders nothing — the compact version shows in the header
  if (isActive) {
    return null
  }

  return (
    <div className="flex w-80 flex-col gap-8">
      <span className="text-[11px] font-semibold tracking-[0.08em] text-[#888] uppercase">
        New Debate
      </span>

      <div className="flex flex-col gap-6">
        <SpeakerInput
          label="Speaker A"
          value={speakerA}
          onChange={setSpeakerA}
        />
        <SpeakerInput
          label="Speaker B"
          value={speakerB}
          onChange={setSpeakerB}
        />
      </div>

      <button
        onClick={handleStart}
        className="w-fit border border-black px-5 py-2 text-[11px] font-semibold tracking-[0.08em] text-black uppercase transition-colors duration-200 hover:bg-black hover:text-white"
      >
        Start Debate
      </button>
    </div>
  )
}

function SpeakerInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-semibold tracking-[0.08em] text-[#888] uppercase">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-b border-[#E5E5E5] bg-transparent py-2 text-[13px] text-black transition-colors duration-150 outline-none placeholder:text-[#bbb] focus:border-black"
        placeholder="Name"
      />
    </div>
  )
}
