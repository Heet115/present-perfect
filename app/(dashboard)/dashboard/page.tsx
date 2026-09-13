"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Sparkles,
  Users,
  Calendar,
  ClipboardList,
  Bookmark,
  ArrowRight,
  Gift,
  Plus,
  Loader2,
  Clock,
  Layers,
  Coins,
  ExternalLink,
  ChevronRight,
  Heart,
  Search,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/auth-context"
import { recipientService } from "@/lib/services/recipient-service"
import { occasionService } from "@/lib/services/occasion-service"
import { savedGiftService } from "@/lib/services/saved-gift-service"
import { bundleService } from "@/lib/services/bundle-service"
import { Recipient } from "@/lib/types/recipient"
import { Occasion, GiftPlan } from "@/lib/types/occasion"
import { SavedGift } from "@/lib/types/saved-gift"
import { GiftBundle } from "@/lib/types/bundle"

function getDaysRemaining(dateString: string) {
  const target = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)

  const diffTime = target.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return { days: 0, label: "Today", isToday: true, isPast: false }
  if (diffDays < 0) return { days: diffDays, label: `${Math.abs(diffDays)}d ago`, isToday: false, isPast: true }
  if (diffDays === 1) return { days: 1, label: "Tomorrow", isToday: false, isPast: false }
  return { days: diffDays, label: `In ${diffDays}d`, isToday: false, isPast: false }
}

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [recipients, setRecipients] = React.useState<Recipient[]>([])
  const [occasions, setOccasions] = React.useState<Occasion[]>([])
  const [plans, setPlans] = React.useState<GiftPlan[]>([])
  const [savedGifts, setSavedGifts] = React.useState<SavedGift[]>([])
  const [bundles, setBundles] = React.useState<GiftBundle[]>([])
  const [loading, setLoading] = React.useState(true)

  // Quick Find states
  const [quickRecipientId, setQuickRecipientId] = React.useState<string>("")
  const [quickOccasion, setQuickOccasion] = React.useState<string>("Birthday")

  React.useEffect(() => {
    async function loadData() {
      if (!user) return
      try {
        const [rData, oData, pData, sData, bData] = await Promise.all([
          recipientService.getAll(user.uid),
          occasionService.getAllOccasions(user.uid),
          occasionService.getAllGiftPlans(user.uid),
          savedGiftService.getAll(user.uid),
          bundleService.getAll(user.uid),
        ])
        setRecipients(rData)
        setOccasions(oData)
        setPlans(pData)
        setSavedGifts(sData)
        setBundles(bData)
      } catch (err) {
        console.error("Dashboard load error:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [user])

  // Sort upcoming occasions (future first, closest first)
  const sortedOccasions = React.useMemo(() => {
    return [...occasions].sort((a, b) => {
      const aInfo = getDaysRemaining(a.date)
      const bInfo = getDaysRemaining(b.date)
      if (aInfo.isPast && !bInfo.isPast) return 1
      if (!aInfo.isPast && bInfo.isPast) return -1
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })
  }, [occasions])

  const upcomingCount = sortedOccasions.filter((o) => !getDaysRemaining(o.date).isPast).length

  const handleQuickFind = (e: React.FormEvent) => {
    e.preventDefault()
    const selectedRec = recipients.find((r) => r.id === quickRecipientId)
    const recName = selectedRec ? selectedRec.name : ""
    const query = new URLSearchParams()
    if (recName) query.set("recipient", recName)
    if (quickRecipientId) query.set("recipientId", quickRecipientId)
    if (quickOccasion) query.set("occasion", quickOccasion)
    router.push(`/find-gift?${query.toString()}`)
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Dashboard"
        description="Welcome to your personal gifting sanctuary. Track upcoming milestones, active plans, and curated treasures."
        badgeText="Concierge Hub"
      >
        <Button render={<Link href="/find-gift" />} className="shadow-xs">
          <Sparkles data-icon="inline-start" />
          Find a Gift
        </Button>
      </PageHeader>

      {/* Metrics / Overview Bento */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Link href="/recipients" className="group">
          <Card className="border-border/70 bg-card/75 shadow-xs group-hover:border-primary/50 group-hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-1.5 p-4">
              <CardTitle className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Recipients
              </CardTitle>
              <Users className="size-3.5 text-primary group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {loading ? (
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              ) : (
                <div className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
                  {recipients.length}
                </div>
              )}
              <p className="text-[11px] text-muted-foreground mt-0.5">Dossiers tracked</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/occasions" className="group">
          <Card className="border-border/70 bg-card/75 shadow-xs group-hover:border-primary/50 group-hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-1.5 p-4">
              <CardTitle className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Milestones
              </CardTitle>
              <Calendar className="size-3.5 text-primary group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {loading ? (
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              ) : (
                <div className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
                  {occasions.length}
                </div>
              )}
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {upcomingCount} upcoming
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/gift-plans" className="group">
          <Card className="border-border/70 bg-card/75 shadow-xs group-hover:border-primary/50 group-hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-1.5 p-4">
              <CardTitle className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Gift Plans
              </CardTitle>
              <ClipboardList className="size-3.5 text-primary group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {loading ? (
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              ) : (
                <div className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
                  {plans.length}
                </div>
              )}
              <p className="text-[11px] text-muted-foreground mt-0.5">Active pipelines</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/saved-gifts" className="group">
          <Card className="border-border/70 bg-card/75 shadow-xs group-hover:border-primary/50 group-hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-1.5 p-4">
              <CardTitle className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Saved Vault
              </CardTitle>
              <Bookmark className="size-3.5 text-primary group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {loading ? (
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              ) : (
                <div className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
                  {savedGifts.length}
                </div>
              )}
              <p className="text-[11px] text-muted-foreground mt-0.5">Bookmarked gifts</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/gift-bundles" className="group col-span-2 sm:col-span-1">
          <Card className="border-border/70 bg-card/75 shadow-xs group-hover:border-primary/50 group-hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-1.5 p-4">
              <CardTitle className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Bundles
              </CardTitle>
              <Layers className="size-3.5 text-primary group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {loading ? (
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              ) : (
                <div className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
                  {bundles.length}
                </div>
              )}
              <p className="text-[11px] text-muted-foreground mt-0.5">Presentation sets</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Quick Find a Gift Concierge Action Bar */}
      <Card className="border-border/80 bg-gradient-to-br from-card via-secondary/15 to-card p-6 shadow-sm rounded-3xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-1.5 max-w-lg">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="size-3.5" />
              </span>
              <span className="text-xs uppercase font-semibold tracking-wider text-primary">
                Instant AI Concierge
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
              Ready to discover the perfect gift?
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Select a recipient or launch directly into bespoke recommendations tailored to personality, quirks, and milestone budgets.
            </p>
          </div>

          <form
            onSubmit={handleQuickFind}
            className="flex flex-wrap items-center gap-2.5 bg-card/90 p-2 rounded-2xl border border-border/80 shadow-xs"
          >
            {recipients.length > 0 && (
              <select
                value={quickRecipientId}
                onChange={(e) => setQuickRecipientId(e.target.value)}
                className="rounded-xl border border-border/70 bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Choose Recipient...</option>
                {recipients.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.relationship})
                  </option>
                ))}
              </select>
            )}

            <select
              value={quickOccasion}
              onChange={(e) => setQuickOccasion(e.target.value)}
              className="rounded-xl border border-border/70 bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Birthday">Birthday</option>
              <option value="Anniversary">Anniversary</option>
              <option value="Celebration">Celebration</option>
              <option value="Thank You">Thank You</option>
              <option value="Just Because">Just Because</option>
            </select>

            <Button type="submit" size="sm" className="text-xs gap-1.5 shadow-xs cursor-pointer">
              <Sparkles className="size-3.5" />
              <span>Launch Finder</span>
            </Button>
          </form>
        </div>

        {/* Prompt Inspiration Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-border/40 text-xs">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Quick Inquiries:
          </span>
          <Link
            href="/find-gift?occasion=Anniversary&budget=5000"
            className="rounded-full bg-secondary/40 hover:bg-secondary/70 border border-border/50 px-3 py-1 text-[11px] text-foreground/80 transition-colors"
          >
            ☕ Anniversary under ₹5,000
          </Link>
          <Link
            href="/find-gift?occasion=Birthday&budget=2500"
            className="rounded-full bg-secondary/40 hover:bg-secondary/70 border border-border/50 px-3 py-1 text-[11px] text-foreground/80 transition-colors"
          >
            🪴 Artisanal Birthday Keepsake
          </Link>
          <Link
            href="/find-gift?mode=surprise_me"
            className="rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/20 px-3 py-1 text-[11px] text-primary font-medium transition-colors"
          >
            ✨ Surprise Me Serendipity Mode
          </Link>
        </div>
      </Card>

      {/* Main Two-Column Layout: Upcoming Occasions & Active Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section: Upcoming Occasions */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-primary" />
              <h2 className="font-serif text-lg font-bold text-foreground">
                Upcoming Milestones
              </h2>
            </div>
            <Link
              href="/occasions"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>View all ({occasions.length})</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          {loading ? (
            <div className="flex min-h-[160px] items-center justify-center rounded-2xl border border-dashed border-border/80">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : sortedOccasions.length === 0 ? (
            <Card className="p-6 text-center border-dashed border-border/80 bg-card/60 rounded-2xl flex flex-col items-center justify-center gap-2">
              <Calendar className="size-8 text-muted-foreground/60" />
              <p className="font-serif font-bold text-sm text-foreground">No occasions scheduled</p>
              <p className="text-xs text-muted-foreground max-w-xs">
                Add birthdays, anniversaries, and milestones to get timely gift recommendations.
              </p>
              <Button size="sm" variant="outline" render={<Link href="/occasions" />} className="mt-2 text-xs">
                <Plus data-icon="inline-start" />
                Schedule Milestone
              </Button>
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {sortedOccasions.slice(0, 3).map((occ) => {
                const { label, isToday, isPast } = getDaysRemaining(occ.date)
                return (
                  <Card
                    key={occ.id}
                    className="p-4 border-border/70 bg-card/85 shadow-xs hover:shadow-md transition-all rounded-2xl flex items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-secondary/60 text-primary font-serif font-bold text-xs shrink-0">
                        <Clock className="size-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-sm text-foreground truncate">
                            {occ.title}
                          </span>
                          <Badge
                            variant={isToday ? "default" : isPast ? "outline" : "secondary"}
                            className="text-[9px] px-1.5 py-0 uppercase font-mono"
                          >
                            {label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          {occ.recipientName && <span>For {occ.recipientName}</span>}
                          <span>·</span>
                          <span className="font-mono">{occ.date}</span>
                          {occ.budget && (
                            <>
                              <span>·</span>
                              <span className="font-medium text-foreground">₹{occ.budget}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        render={
                          <Link
                            href={`/find-gift?recipient=${encodeURIComponent(occ.recipientName || "")}&recipientId=${occ.recipientId || ""}&occasion=${encodeURIComponent(occ.title)}&budget=${occ.budget || ""}`}
                          />
                        }
                        className="text-xs gap-1 rounded-xl cursor-pointer"
                      >
                        <Sparkles className="size-3 text-primary" />
                        <span className="hidden sm:inline">Find Gift</span>
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Section: Recent Gift Plans */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList className="size-4 text-primary" />
              <h2 className="font-serif text-lg font-bold text-foreground">
                Active Gift Plans
              </h2>
            </div>
            <Link
              href="/gift-plans"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>View all ({plans.length})</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          {loading ? (
            <div className="flex min-h-[160px] items-center justify-center rounded-2xl border border-dashed border-border/80">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : plans.length === 0 ? (
            <Card className="p-6 text-center border-dashed border-border/80 bg-card/60 rounded-2xl flex flex-col items-center justify-center gap-2">
              <ClipboardList className="size-8 text-muted-foreground/60" />
              <p className="font-serif font-bold text-sm text-foreground">No active gift plans</p>
              <p className="text-xs text-muted-foreground max-w-xs">
                Save shortlisted gift ideas to plans to budget and track them from idea to delivery.
              </p>
              <Button size="sm" variant="outline" render={<Link href="/gift-plans" />} className="mt-2 text-xs">
                <Plus data-icon="inline-start" />
                Create Gift Plan
              </Button>
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {plans.slice(0, 3).map((plan) => (
                <Card
                  key={plan.id}
                  className="p-4 border-border/70 bg-card/85 shadow-xs hover:shadow-md transition-all rounded-2xl flex items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-secondary/60 text-primary font-serif font-bold text-xs shrink-0">
                      <Gift className="size-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm text-foreground truncate">
                          For {plan.recipientName}
                        </span>
                        <Badge
                          variant={
                            plan.status === "gifted"
                              ? "default"
                              : plan.status === "purchased"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-[9px] px-1.5 py-0 uppercase"
                        >
                          {plan.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        {plan.occasionTitle && <span>{plan.occasionTitle}</span>}
                        <span>·</span>
                        <span className="font-mono">
                          {plan.currency}{plan.targetBudget}
                        </span>
                        {plan.giftIdeas && plan.giftIdeas.length > 0 && (
                          <>
                            <span>·</span>
                            <span>{plan.giftIdeas.length} idea{plan.giftIdeas.length > 1 ? "s" : ""}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/gift-plans"
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 shrink-0"
                  >
                    <span>Manage</span>
                    <ChevronRight className="size-3" />
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Second Row: Saved Vault Picks & Recent Recipients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section: Saved Gifts Vault */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="size-4 text-primary" />
              <h2 className="font-serif text-lg font-bold text-foreground">
                Saved in Vault
              </h2>
            </div>
            <Link
              href="/saved-gifts"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>View vault ({savedGifts.length})</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          {loading ? (
            <div className="flex min-h-[160px] items-center justify-center rounded-2xl border border-dashed border-border/80">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : savedGifts.length === 0 ? (
            <Card className="p-6 text-center border-dashed border-border/80 bg-card/60 rounded-2xl flex flex-col items-center justify-center gap-2">
              <Bookmark className="size-8 text-muted-foreground/60" />
              <p className="font-serif font-bold text-sm text-foreground">Your vault is empty</p>
              <p className="text-xs text-muted-foreground max-w-xs">
                Bookmark memorable gifts from AI recommendations to curate your personal gift repository.
              </p>
              <Button size="sm" variant="outline" render={<Link href="/find-gift" />} className="mt-2 text-xs">
                <Sparkles data-icon="inline-start" />
                Find Curated Gifts
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {savedGifts.slice(0, 4).map((g) => (
                <Card
                  key={g.id}
                  className="p-4 border-border/70 bg-card/85 shadow-xs hover:shadow-md transition-all rounded-2xl flex flex-col justify-between gap-3"
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-serif font-bold text-sm text-foreground truncate">
                        {g.recommendation.name}
                      </span>
                      <span className="font-serif font-bold text-xs text-primary shrink-0">
                        {g.recommendation.currency}
                        {g.recommendation.estimatedPrice.toLocaleString()}
                      </span>
                    </div>
                    {g.recipientName && (
                      <span className="text-[11px] text-muted-foreground">
                        For {g.recipientName}
                      </span>
                    )}
                    {g.recommendation.category && (
                      <Badge variant="outline" className="w-fit text-[9px] uppercase px-1.5 py-0 mt-1">
                        {g.recommendation.category}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                    <Link
                      href="/saved-gifts"
                      className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      <span>In Vault</span>
                      <ArrowRight className="size-2.5" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Section: Recent Recipient Profiles */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-primary" />
              <h2 className="font-serif text-lg font-bold text-foreground">
                Recent Recipient Profiles
              </h2>
            </div>
            <Link
              href="/recipients"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>Manage dossiers ({recipients.length})</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          {loading ? (
            <div className="flex min-h-[160px] items-center justify-center rounded-2xl border border-dashed border-border/80">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : recipients.length === 0 ? (
            <Card className="p-6 text-center border-dashed border-border/80 bg-card/60 rounded-2xl flex flex-col items-center justify-center gap-2">
              <Users className="size-8 text-muted-foreground/60" />
              <p className="font-serif font-bold text-sm text-foreground">No recipients added</p>
              <p className="text-xs text-muted-foreground max-w-xs">
                Create dossiers for your family and friends with their quirks and tastes.
              </p>
              <Button size="sm" variant="outline" render={<Link href="/recipients" />} className="mt-2 text-xs">
                <Plus data-icon="inline-start" />
                Add Recipient
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recipients.slice(0, 4).map((r) => {
                const initials = r.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)

                return (
                  <Card
                    key={r.id}
                    className="p-4 border-border/70 bg-card/85 shadow-xs hover:shadow-md transition-all rounded-2xl flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-secondary/80 text-primary font-serif font-bold text-xs ring-1 ring-border/50">
                        {initials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-serif font-bold text-sm text-foreground truncate">
                          {r.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground truncate">
                          {r.relationship}
                        </span>
                      </div>
                    </div>

                    {r.interests && r.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {r.interests.slice(0, 2).map((i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-secondary/40 px-1.5 py-0.5 rounded-md text-muted-foreground"
                          >
                            {i}
                          </span>
                        ))}
                        {r.interests.length > 2 && (
                          <span className="text-[10px] text-muted-foreground">
                            +{r.interests.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                      <Link
                        href={`/find-gift?recipient=${encodeURIComponent(r.name)}&recipientId=${r.id}`}
                        className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                      >
                        <Sparkles className="size-3" />
                        <span>Find Gift</span>
                      </Link>
                      <Link
                        href="/recipients"
                        className="text-[11px] text-muted-foreground hover:text-foreground"
                      >
                        Dossier →
                      </Link>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
