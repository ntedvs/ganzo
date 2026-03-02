"use client"

import {
  createClient,
  LiveTranscriptionEvents,
  type ListenLiveClient,
  type LiveTranscriptionEvent,
} from "@deepgram/sdk"
import { useAction, useMutation } from "convex/react"
import { useCallback, useRef, useState } from "react"
import { api } from "../../convex/_generated/api"
import { Id } from "../../convex/_generated/dataModel"

interface InterimResult {
  text: string
  speaker: number
}

export function useDeepgram(debateId: Id<"debates"> | null) {
  const [isRecording, setIsRecording] = useState(false)
  const [interim, setInterim] = useState<InterimResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const connectionRef = useRef<ListenLiveClient | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const keepAliveRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const mintToken = useAction(api.deepgramToken.mint)
  const insertChunk = useMutation(api.transcriptChunks.insert)
  const triggerExtraction = useMutation(api.transcriptChunks.triggerExtraction)

  const start = useCallback(
    async (overrideDebateId?: Id<"debates">) => {
      const activeDebateId = overrideDebateId ?? debateId
      if (!activeDebateId) return
      setError(null)

      try {
        const { token } = await mintToken()

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
          },
        })
        mediaStreamRef.current = stream

        const client = createClient({ accessToken: token })
        const connection = client.listen.live({
          model: "nova-3",
          language: "en",
          smart_format: true,
          punctuate: true,
          diarize: true,
          interim_results: true,
          utterance_end_ms: 1500,
        })
        connectionRef.current = connection

        connection.on(LiveTranscriptionEvents.Open, () => {
          const recorder = new MediaRecorder(stream, {
            mimeType: "audio/webm;codecs=opus",
          })
          recorderRef.current = recorder

          recorder.ondataavailable = (event) => {
            if (event.data.size > 0 && connection.getReadyState() === 1) {
              connection.send(event.data)
            }
          }
          recorder.start(250)

          keepAliveRef.current = setInterval(() => {
            connection.keepAlive()
          }, 8000)

          setIsRecording(true)
        })

        connection.on(
          LiveTranscriptionEvents.Transcript,
          async (data: LiveTranscriptionEvent) => {
            const alt = data.channel.alternatives[0]
            if (!alt?.transcript?.trim()) return

            const { transcript } = alt
            const speaker = alt.words[0]?.speaker ?? 0
            const startTime = data.start
            const duration = data.duration

            if (!data.is_final) {
              setInterim({ text: transcript, speaker })
              return
            }

            await insertChunk({
              debateId: activeDebateId,
              speaker: speaker === 0 ? 0 : 1,
              text: transcript,
              startTime,
              endTime: startTime + duration,
            })

            setInterim(null)
          },
        )

        connection.on(LiveTranscriptionEvents.UtteranceEnd, () => {
          triggerExtraction({ debateId: activeDebateId })
        })

        connection.on(LiveTranscriptionEvents.Error, () => {
          setError("Transcription connection error")
        })

        connection.on(LiveTranscriptionEvents.Close, () => {
          setIsRecording(false)
        })
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to start recording",
        )
      }
    },
    [debateId, mintToken, insertChunk, triggerExtraction],
  )

  const stop = useCallback(() => {
    if (keepAliveRef.current) {
      clearInterval(keepAliveRef.current)
      keepAliveRef.current = null
    }

    recorderRef.current?.stop()
    recorderRef.current = null

    connectionRef.current?.requestClose()
    connectionRef.current = null

    mediaStreamRef.current?.getTracks().forEach((t) => t.stop())
    mediaStreamRef.current = null

    setIsRecording(false)
    setInterim(null)
  }, [])

  return { isRecording, interim, error, start, stop }
}
