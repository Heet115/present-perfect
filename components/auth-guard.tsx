"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Gift, Loader2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (!loading && !user) {
      router.replace("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center p-8">
        <div className="relative flex size-14 items-center justify-center rounded-2xl bg-secondary/80 text-primary ring-1 ring-border/60 shadow-xs">
          <Gift className="size-6 animate-pulse" />
          <Loader2 className="absolute -inset-2 size-18 animate-spin text-accent/60 opacity-70" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-serif text-lg font-bold text-foreground">
            Opening your Atelier
          </span>
          <span className="text-xs text-muted-foreground font-sans">
            Verifying your concierge credentials...
          </span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
