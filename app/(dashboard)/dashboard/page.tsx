import type { Metadata } from "next"
import Link from "next/link"
import {
  Sparkles,
  Users,
  Calendar,
  ClipboardList,
  Bookmark,
  ArrowRight,
  Gift,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Dashboard — Present Perfect",
  description: "Overview of your upcoming milestones, recipient taste profiles, and active gift plans.",
}

export default function DashboardPage() {
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
        <Card className="border-border/60 bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Recipients
            </CardTitle>
            <Users className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif text-foreground">0</div>
            <p className="text-xs text-muted-foreground mt-1">Dossiers tracked</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Occasions
            </CardTitle>
            <Calendar className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif text-foreground">0</div>
            <p className="text-xs text-muted-foreground mt-1">Upcoming 30 days</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Gift Plans
            </CardTitle>
            <ClipboardList className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif text-foreground">0</div>
            <p className="text-xs text-muted-foreground mt-1">In progress</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Saved Gifts
            </CardTitle>
            <Bookmark className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif text-foreground">0</div>
            <p className="text-xs text-muted-foreground mt-1">Curated picks</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Empty / Getting Started State */}
      <EmptyState
        icon={Gift}
        badgeText="Getting Started"
        title="Your gifting journey starts here"
        description="You haven't added any recipients or scheduled occasions yet. Add your favorite people to get personalized reminders and AI-tailored gift suggestions."
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
        hintText="All recipient profiles and occasions will synchronize in Phase 3 & 4."
      />
    </div>
  )
}
