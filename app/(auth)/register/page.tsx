"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Gift, Sparkles, AlertCircle, Loader2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/auth-context"

export default function RegisterPage() {
  const router = useRouter()
  const { user, signUpWithEmail, signInWithGoogle, formatAuthError } = useAuth()
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Redirect if already authenticated
  React.useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify.")
      return
    }

    setIsLoading(true)

    try {
      await signUpWithEmail(email, password, name)
      router.push("/dashboard")
    } catch (err) {
      setError(formatAuthError(err))
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setError(null)
    setIsGoogleLoading(true)

    try {
      await signInWithGoogle()
      router.push("/dashboard")
    } catch (err) {
      setError(formatAuthError(err))
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <Card className="border-border/70 bg-card/85 shadow-lg backdrop-blur-md transition-all">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-2xl bg-secondary/80 text-primary ring-1 ring-border/50 shadow-xs">
          <Gift className="size-6" />
        </div>
        <CardTitle className="font-serif text-2xl font-bold tracking-tight text-foreground">
          Begin your journey
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Create your personal gifting concierge account
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* Error Banner */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Sign Up */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignup}
          disabled={isGoogleLoading || isLoading}
          className="w-full justify-center gap-2.5 h-10 border-border/80 shadow-xs hover:bg-secondary/40"
        >
          {isGoogleLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Connecting to Google...
            </>
          ) : (
            <>
              <svg className="size-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                />
              </svg>
              Sign up with Google
            </>
          )}
        </Button>

        <div className="relative flex items-center justify-center my-1">
          <Separator />
          <span className="absolute bg-card px-2 text-[10px] uppercase tracking-wider text-muted-foreground">
            Or with email
          </span>
        </div>

        {/* Email & Password Registration Form */}
        <form onSubmit={handleRegister} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="register-name"
              className="text-xs font-medium text-foreground/90"
            >
              Full name
            </label>
            <Input
              id="register-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sarah Jenkins"
              required
              disabled={isLoading || isGoogleLoading}
              className="h-10 bg-background/60"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="register-email"
              className="text-xs font-medium text-foreground/90"
            >
              Email address
            </label>
            <Input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              required
              disabled={isLoading || isGoogleLoading}
              className="h-10 bg-background/60"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="register-password"
                className="text-xs font-medium text-foreground/90"
              >
                Password
              </label>
              <Input
                id="register-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8+ characters"
                required
                disabled={isLoading || isGoogleLoading}
                className="h-10 bg-background/60"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="register-confirm-password"
                className="text-xs font-medium text-foreground/90"
              >
                Confirm password
              </label>
              <Input
                id="register-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm"
                required
                disabled={isLoading || isGoogleLoading}
                className="h-10 bg-background/60"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full mt-2 h-10 shadow-xs font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 data-icon="inline-start" className="size-4 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <Sparkles data-icon="inline-start" />
                Create Account
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-border/50 pt-4 text-xs text-muted-foreground">
        <span>Already have an account?</span>
        <Link
          href="/login"
          className="ml-1.5 font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </CardFooter>
    </Card>
  )
}
