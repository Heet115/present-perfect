import type { Metadata } from "next"
import Link from "next/link"
import { Gift, Sparkles } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Sign In — Present Perfect",
  description: "Sign in to access your saved gift plans, recipient profiles, and personalized concierge.",
}

export default function LoginPage() {
  return (
    <Card className="border-border/70 bg-card/80 shadow-md backdrop-blur-xs">
      <CardHeader className="space-y-1 text-center">
        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-2xl bg-secondary/80 text-primary ring-1 ring-border/50">
          <Gift className="size-6" />
        </div>
        <CardTitle className="font-serif text-2xl font-bold tracking-tight text-foreground">
          Welcome back
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Sign in to your Present Perfect gifting concierge
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* Google Sign In Stub */}
        <Button variant="outline" className="w-full justify-center gap-2 h-10 border-border/80">
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
          Continue with Google
        </Button>

        <div className="relative flex items-center justify-center my-1">
          <Separator />
          <span className="absolute bg-card px-2 text-xs uppercase tracking-wider text-muted-foreground">
            Or with email
          </span>
        </div>

        {/* Email / Password Inputs */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-xs font-medium text-foreground/90"
            >
              Email address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@domain.com"
              className="h-10 bg-background/60"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-xs font-medium text-foreground/90"
              >
                Password
              </label>
              <button
                type="button"
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="h-10 bg-background/60"
            />
          </div>

          <Button className="w-full mt-2 h-10">
            <Sparkles data-icon="inline-start" />
            Sign in
          </Button>
        </div>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-border/50 pt-4 text-xs text-muted-foreground">
        <span>Don&apos;t have an account yet?</span>
        <Link
          href="/register"
          className="ml-1.5 font-medium text-primary hover:underline"
        >
          Create an account
        </Link>
      </CardFooter>
    </Card>
  )
}
