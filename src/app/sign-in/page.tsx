"use client"

import { useAuthActions } from "@convex-dev/auth/react"
import { useConvexAuth } from "convex/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SignInPage() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const { signIn } = useAuthActions()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    if (isAuthenticated) {
      router.replace("/debates")
      return
    }
    void signIn("github")
  }, [isAuthenticated, isLoading, signIn, router])

  return (
    <div className="flex items-center justify-center">
      <span className="text-[11px] font-semibold tracking-[0.08em] text-[#ccc] uppercase">
        Redirecting...
      </span>
    </div>
  )
}
