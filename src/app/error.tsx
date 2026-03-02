"use client"

import { useEffect } from "react"
import { Footer } from "~/components/Footer"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="grid grid-rows-[1fr_auto] overflow-hidden">
      <div className="flex items-center justify-center">
        <div className="flex max-w-[400px] flex-col gap-3">
          <span className="text-[11px] font-semibold tracking-[0.08em] text-[#ccc] uppercase">
            Error
          </span>
          <p className="text-[18px] leading-normal text-[#111]">
            Something went wrong.
          </p>
          {error.message && (
            <p className="text-[13px] leading-normal text-[#888]">
              {error.message}
            </p>
          )}
          <button
            onClick={reset}
            className="w-fit text-[11px] font-semibold tracking-[0.08em] text-[#888] uppercase transition-colors duration-200 hover:text-black"
          >
            Try again
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}
