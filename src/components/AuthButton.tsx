"use client"

import { useAuthActions } from "@convex-dev/auth/react"
import { useConvexAuth } from "convex/react"

export function AuthButton() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const { signIn, signOut } = useAuthActions()

  if (isLoading) {
    return (
      <button
        disabled
        className="text-[11px] font-semibold tracking-[0.08em] text-[#ccc] uppercase"
      >
        Loading
      </button>
    )
  }

  if (isAuthenticated) {
    return (
      <button
        onClick={() => void signOut()}
        className="text-[11px] font-semibold tracking-[0.08em] text-[#888] uppercase transition-colors duration-200 hover:text-black"
      >
        Sign out
      </button>
    )
  }

  return (
    <button
      onClick={() => void signIn("github", { redirectTo: "/debates" })}
      className="text-[11px] font-semibold tracking-[0.08em] text-[#888] uppercase transition-colors duration-200 hover:text-black"
    >
      Sign in
    </button>
  )
}
