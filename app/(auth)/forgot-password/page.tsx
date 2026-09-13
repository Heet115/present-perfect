"use client"

import * as React from "react"
import Link from "next/link"
import { KeyRound, Sparkles, ArrowLeft, MailCheck, AlertCircle, Loader2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/auth-context"

export default function ForgotPasswordPage() {
  const { sendPasswordReset, formatAuthError } = useAuth()
  const [email, setEmail] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [isSuccess, setIsSuccess] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError("Please enter your email address.")
      return
    }

    setIsSubmitting(true)

    try {
      await sendPasswordReset(email)
      setIsSuccess(true)
    } catch (err) {
      setError(formatAuthError(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-border/70 bg-card/85 shadow-lg backdrop-blur-md transition-all">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-2xl bg-secondary/80 text-primary ring-1 ring-border/50 shadow-xs">
          {isSuccess ? <MailCheck className="size-6" /> : <KeyRound className="size-6" />}
        </div>
        <CardTitle className="font-serif text-2xl font-bold tracking-tight text-foreground">
          {isSuccess ? "Check your inbox" : "Reset your password"}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground max-w-xs mx-auto">
          {isSuccess
            ? `We sent password reset instructions to ${email}`
            : "Enter your account email and we'll dispatch a secure recovery link"}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="flex flex-col gap-4 text-center py-2">
            <p className="text-xs text-muted-foreground leading-relaxed">
              If an account is associated with this email, the reset link will arrive shortly.
              Please check your spam or promotions tab if it doesn&apos;t appear.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsSuccess(false)
                setEmail("")
              }}
              className="text-xs self-center"
            >
              Send to a different email
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="reset-email"
                className="text-xs font-medium text-foreground/90"
              >
                Account Email
              </Label>
              <Input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                required
                disabled={isSubmitting}
                className="h-10 bg-background/60"
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full mt-2 h-10 shadow-xs">
              {isSubmitting ? (
                <>
                  <Loader2 data-icon="inline-start" className="size-4 animate-spin" />
                  Sending recovery link...
                </>
              ) : (
                <>
                  <Sparkles data-icon="inline-start" />
                  Dispatch Recovery Email
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>

      <CardFooter className="flex justify-center border-t border-border/50 pt-4 text-xs text-muted-foreground">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
        >
          <ArrowLeft className="size-3.5" />
          Back to sign in
        </Link>
      </CardFooter>
    </Card>
  )
}
