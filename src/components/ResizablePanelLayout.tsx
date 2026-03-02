"use client"

import { ReactNode } from "react"
import { useResizableSidebar } from "~/hooks/useResizableSidebar"

interface ResizablePanelLayoutProps {
  main: ReactNode
  sidebar: ReactNode
}

export function ResizablePanelLayout({
  main,
  sidebar,
}: ResizablePanelLayoutProps) {
  const {
    width: sidebarWidth,
    containerRef,
    onMouseDown,
  } = useResizableSidebar()

  return (
    <div ref={containerRef} className="flex min-h-0 overflow-hidden">
      <div className="min-w-0 flex-1 overflow-y-auto">{main}</div>

      <div
        role="separator"
        onMouseDown={onMouseDown}
        className="group relative z-20 w-px shrink-0 cursor-col-resize bg-[#E5E5E5]"
      >
        <div className="absolute inset-y-0 -right-1 -left-1 transition-colors duration-150 group-hover:bg-[#0066FF]/20 group-active:bg-[#0066FF]/30" />
      </div>

      <div className="shrink-0 overflow-y-auto" style={{ width: sidebarWidth }}>
        {sidebar}
      </div>
    </div>
  )
}
