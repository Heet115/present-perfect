"use client"

import * as React from "react"
import Link from "next/link"
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
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/auth-context"
import { recipientService } from "@/lib/services/recipient-service"
import { occasionService } from "@/lib/services/occasion-service"
import { Recipient } from "@/lib/types/recipient"
import { Occasion, GiftPlan } from "@/lib/types/occasion"

export default function DashboardPage() {
  const { user } = useAuth()
  const [recipients, setRecipients] = React.useState<Recipient[]>([])
  const [occasions, setOccasions] = React.useState<Occasion[]>([])
  const [plans, setPlans] = React.useState<GiftPlan[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadData() {
      if (!user) return
      try {
        const [rData, oData, pData] = await Promise.all([
          recipientService.getAll(user.uid),
          occasionService.getAllOccasions(user.uid),
          occasionService.getAllGiftPlans(user.uid),
        ])
        setRecipients(rData)
        setOccasions(oData)
        setPlans(pData)
      } catch (err) {
        console.error("Dashboard load error:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [user])

  // Aggregate all upcoming milestones
  const allDates = recipients.flatMap((r) =>
    (r.importantDates || []).map((d) => ({
      ...d,
      recipientName: r.name,
      relationship: r.relationship,
    }))
  )

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Dashboard"
        description="Welcome to your personal gifting sanctuary. Track upcoming milestones and curated gifts."
        badgeText="Concierge Hub"
      >
        <Button render={<Link href="/find-gift" />}>
          <Sparkles data-icon="inline-start" />
          Find a Gift
        </Button>
      </PageHeader>

      {/* Metrics / Overview Bento */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="border-border/70 bg-card/75 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Recipients
            </CardTitle>
            <Users className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            ) : (
              <div className="text-3xl font-bold font-serif text-foreground">
                {recipients.length}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Dossiers tracked</p>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/75 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Milestones
            </CardTitle>
            <Calendar className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            ) : (
              <div className="text-3xl font-bold font-serif text-foreground">
                {occasions.length}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Scheduled dates</p>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/75 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Gift Plans
            </CardTitle>
            <ClipboardList className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            ) : (
              <div className="text-3xl font-bold font-serif text-foreground">
                {plans.length}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Active pipelines</p>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/75 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Saved Gifts
            </CardTitle>
            <Bookmark className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-serif text-foreground">0</div>
            <p className="text-xs text-muted-foreground mt-1">Curated picks</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      {recipients.length === 0 && !loading ? (
        <EmptyState
          icon={Gift}
          badgeText="Getting Started"
          title="Your gifting journey starts here"
          description="You haven't added any recipients yet. Add your favorite people to store their quirks, sizes, and milestone dates for AI gift recommendations."
          action={
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button render={<Link href="/recipients" />}>
                <Users data-icon="inline-start" />
                Add Your First Recipient
              </Button>
              <Button variant="outline" render={<Link href="/find-gift" />}>
                <Sparkles data-icon="inline-start" />
                Try AI Gift Finder
                <ArrowRight data-icon="inline-end" />
              </Button>
            </div>
          }
          hintText="All recipient profiles are encrypted and stored in your private Firestore database."
        />
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-foreground">
              Recent Recipient Profiles
            </h2>
            <Link
              href="/recipients"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>Manage all dossiers</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recipients.slice(0, 3).map((r) => (
              <Card key={r.id} className="border-border/70 bg-card/80 p-5 shadow-xs">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-secondary/80 text-primary font-serif font-bold text-sm">
                      {r.name[0]}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-foreground">{r.name}</h3>
                      <span className="text-xs text-muted-foreground">{r.relationship}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {r.interests?.length || 0} Interests
                  </Badge>
                </div>
                {r.interests && r.interests.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {r.interests.slice(0, 3).map((i) => (
                      <span key={i} className="text-[10px] bg-secondary/40 px-2 py-0.5 rounded-md text-muted-foreground">
                        {i}
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
