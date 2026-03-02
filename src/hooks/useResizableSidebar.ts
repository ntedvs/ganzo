"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export function useResizableSidebar(initial = 320, min = 200, max = 600) {
  const [width, setWidth] = useState(initial)
  const containerRef = useRef<HTMLDivElement>(null)
  const listenersRef = useRef<{
    move: (e: MouseEvent) => void
    up: () => void
  } | null>(null)

  const cleanup = useCallback(() => {
    if (!listenersRef.current) return
    document.removeEventListener("mousemove", listenersRef.current.move)
    document.removeEventListener("mouseup", listenersRef.current.up)
    listenersRef.current = null
    document.body.style.cursor = ""
    document.body.style.userSelect = ""
  }, [])

  useEffect(() => cleanup, [cleanup])

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"

      const onMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const newWidth = rect.right - e.clientX
        setWidth(Math.max(min, Math.min(max, newWidth)))
      }

      const onMouseUp = () => cleanup()

      listenersRef.current = { move: onMouseMove, up: onMouseUp }
      document.addEventListener("mousemove", onMouseMove)
      document.addEventListener("mouseup", onMouseUp)
    },
    [min, max, cleanup],
  )

  return { width, containerRef, onMouseDown }
}
