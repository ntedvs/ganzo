"use client"

import { useConvexAuth } from "convex/react"
import Link from "next/link"
import { AuthButton } from "~/components/AuthButton"

export function Navbar() {
  const { isAuthenticated } = useConvexAuth()

  return (
    <header className="grid grid-cols-[1fr_auto_1fr] items-center border-b border-[#E5E5E5] px-8 py-5">
      <Link href="/" className="w-fit text-[24px] font-medium text-black">
        Stanzo
      </Link>

      <nav className="flex items-center gap-6">
        {isAuthenticated && (
          <Link
            href="/debates"
            className="text-[11px] font-semibold tracking-[0.08em] text-[#888] uppercase transition-colors duration-200 hover:text-black"
          >
            Debates
          </Link>
        )}
      </nav>

      <div className="flex items-center justify-end">
        <AuthButton />
      </div>
    </header>
  )
}
