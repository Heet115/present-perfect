import Link from "next/link"
import { Gift, Heart, Sparkles } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-card/60 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="flex flex-col gap-3 md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Gift className="size-4" />
              </div>
              <span className="font-serif text-lg font-semibold tracking-tight text-foreground">
                Present Perfect
              </span>
            </Link>
            <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
              An intelligent concierge dedicated to the art of thoughtful gifting.
              Transforming relationships and milestones into unforgettable, tailor-made moments.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" />
              <span>Tailored with intelligence & genuine care</span>
            </div>
          </div>

          {/* Discovery */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
              Gifting
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/find-gift" className="hover:text-foreground transition-colors">
                  Find a Gift
                </Link>
              </li>
              <li>
                <Link href="/recipients" className="hover:text-foreground transition-colors">
                  Recipients Dossier
                </Link>
              </li>
              <li>
                <Link href="/occasions" className="hover:text-foreground transition-colors">
                  Occasions & Milestones
                </Link>
              </li>
              <li>
                <Link href="/gift-plans" className="hover:text-foreground transition-colors">
                  Gift Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Library */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
              Personal Space
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/saved-gifts" className="hover:text-foreground transition-colors">
                  Saved Gifts
                </Link>
              </li>
              <li>
                <Link href="/gift-history" className="hover:text-foreground transition-colors">
                  Gift History
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-foreground transition-colors">
                  Preferences
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
              Account
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-foreground transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Present Perfect. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted for thoughtful humans everywhere</span>
            <Heart className="size-3 text-primary inline fill-primary/30" />
          </div>
        </div>
      </div>
    </footer>
  )
}
