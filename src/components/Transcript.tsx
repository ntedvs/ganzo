"use client"

import { useEffect, useRef } from "react"
import { Doc } from "../../convex/_generated/dataModel"

interface TranscriptProps {
  chunks: Doc<"transcriptChunks">[]
  speakerAName: string
  speakerBName: string
  interimText?: string
  interimSpeaker?: number
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function Transcript({
  chunks,
  speakerAName,
  speakerBName,
  interimText,
  interimSpeaker,
}: TranscriptProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const speakerNames = [speakerAName, speakerBName]

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chunks.length, interimText])

  return (
    <div>
      <div className="sticky top-0 z-10 flex items-center border-b border-[#E5E5E5] bg-white/95 px-8 py-3 backdrop-blur-sm">
        <span className="text-[11px] font-semibold tracking-[0.08em] text-[#888] uppercase">
          Transcript
        </span>
      </div>

      {chunks.length === 0 && !interimText ? (
        <p className="px-8 py-12 text-[13px] text-[#888]">
          Waiting for speech...
        </p>
      ) : (
        <div className="px-8 pb-8">
          {chunks.map((chunk) => (
            <TranscriptRow
              key={chunk._id}
              speaker={speakerNames[chunk.speaker]}
              timestamp={formatTime(chunk.startTime)}
              text={chunk.text}
            />
          ))}

          {interimText && (
            <TranscriptRow
              speaker={speakerNames[interimSpeaker ?? 0]}
              text={interimText}
              interim
            />
          )}

          <div ref={bottomRef} />
        </div>
      )}
    </div>
  )
}

function TranscriptRow({
  speaker,
  timestamp,
  text,
  interim,
}: {
  speaker: string
  timestamp?: string
  text: string
  interim?: boolean
}) {
  return (
    <div className="grid grid-cols-[80px_1fr] gap-10 border-b border-[#F0F0F0] py-8">
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold tracking-[0.08em] text-[#666] uppercase">
          {speaker}
        </span>
        {interim ? (
          <span
            className="text-[12px] text-transparent tabular-nums"
            aria-hidden
          >
            0:00
          </span>
        ) : (
          <span className="text-[12px] text-[#999] tabular-nums">
            {timestamp}
          </span>
        )}
      </div>
      <span
        className={`text-[18px] leading-normal ${interim ? "text-[#bbb]" : "text-[#111]"}`}
      >
        {text}
      </span>
    </div>
  )
}
