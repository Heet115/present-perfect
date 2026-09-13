"use client"

import * as React from "react"
import Link from "next/link"
import {
  Calendar,
  CalendarPlus,
  Clock,
  Sparkles,
  Loader2,
  Trash2,
  Edit2,
  Users,
  Coins,
  ArrowRight,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { OccasionFormDialog } from "@/components/occasion-form-dialog"
import { useAuth } from "@/context/auth-context"
import { occasionService, getDaysRemaining } from "@/lib/services/occasion-service"
import { Occasion } from "@/lib/types/occasion"

export default function OccasionsPage() {
  const { user } = useAuth()
  const [occasions, setOccasions] = React.useState<Occasion[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [occasionToEdit, setOccasionToEdit] = React.useState<Occasion | null>(null)
  const [filter, setFilter] = React.useState<"all" | "upcoming" | "past">("all")

  const loadOccasions = React.useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await occasionService.getAllOccasions(user.uid)
      setOccasions(data)
    } catch (err) {
      console.error("Failed to load occasions:", err)
    } finally {
      setLoading(false)
    }
  }, [user])

  React.useEffect(() => {
    loadOccasions()
  }, [loadOccasions])

  const handleDelete = async (occasionId: string) => {
    if (!user) return
    try {
      await occasionService.deleteOccasion(user.uid, occasionId)
      setOccasions((prev) => prev.filter((o) => o.id !== occasionId))
    } catch (err) {
      console.error("Failed to delete occasion:", err)
    }
  }

  const filteredOccasions = occasions.filter((o) => {
    const { isPast } = getDaysRemaining(o.date)
    if (filter === "upcoming") return !isPast
    if (filter === "past") return isPast
    return true
  })

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Occasions & Milestones"
        description="Never miss an important date. Monitor birthdays, anniversaries, weddings, promotions, and custom celebratory moments."
        badgeText={`${occasions.length} Milestones`}
      >
        <Button
          onClick={() => {
            setOccasionToEdit(null)
            setIsFormOpen(true)
          }}
          className="gap-2 shadow-xs"
        >
          <CalendarPlus data-icon="inline-start" />
          Schedule Milestone
        </Button>
      </PageHeader>

      {/* Loading state */}
      {loading ? (
        <div className="flex min-h-[35vh] flex-col items-center justify-center gap-3 text-center">
          <Loader2 className="size-8 animate-spin text-primary" />
          <span className="text-xs text-muted-foreground font-serif italic">
            Scanning your personal occasion radar...
          </span>
        </div>
      ) : occasions.length === 0 ? (
        <EmptyState
          icon={Calendar}
          badgeText="Radar Clear"
          title="No upcoming milestones tracked"
          description="Schedule upcoming birthdays, anniversaries, and milestones. Present Perfect tracks countdowns and ensures gifts are planned with plenty of time."
          action={
            <Button
              onClick={() => {
                setOccasionToEdit(null)
                setIsFormOpen(true)
              }}
              className="gap-2"
            >
              <CalendarPlus data-icon="inline-start" />
              Schedule Your First Milestone
            </Button>
          }
          hintText="Synchronized with your private Firestore calendar."
        />
      ) : (
        <div className="flex flex-col gap-6">
          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-secondary/40 rounded-full border border-border/60 w-fit backdrop-blur-xs">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-full px-3.5 py-1 text-xs font-medium transition-colors ${
                filter === "all"
                  ? "bg-card text-foreground font-semibold shadow-xs ring-1 ring-border/80"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All ({occasions.length})
            </button>
            <button
              onClick={() => setFilter("upcoming")}
              className={`rounded-full px-3.5 py-1 text-xs font-medium transition-colors ${
                filter === "upcoming"
                  ? "bg-card text-foreground font-semibold shadow-xs ring-1 ring-border/80"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter("past")}
              className={`rounded-full px-3.5 py-1 text-xs font-medium transition-colors ${
                filter === "past"
                  ? "bg-card text-foreground font-semibold shadow-xs ring-1 ring-border/80"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Past
            </button>
          </div>

          {filteredOccasions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/80 p-8 text-center text-xs text-muted-foreground">
              No occasions match this filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredOccasions.map((occasion) => {
                const { label, isPast, isToday } = getDaysRemaining(occasion.date)

                return (
                  <Card
                    key={occasion.id}
                    className="border-border/70 bg-card/85 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <CardHeader className="p-5 pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <Badge
                          variant={isToday ? "default" : isPast ? "outline" : "secondary"}
                          className={`text-[11px] font-mono font-semibold ${
                            isToday ? "animate-pulse" : ""
                          }`}
                        >
                          <Clock className="size-3 mr-1 inline" />
                          {label}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                          {occasion.type}
                        </Badge>
                      </div>

                      <CardTitle className="font-serif text-xl font-bold text-foreground mt-3">
                        {occasion.title}
                      </CardTitle>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Calendar className="size-3 text-primary" />
                        <span className="font-mono">{occasion.date}</span>
                      </div>
                    </CardHeader>

                    <CardContent className="p-5 pt-0 flex flex-col gap-2.5">
                      {occasion.recipientName && (
                        <div className="flex items-center gap-1.5 text-xs text-foreground/80 bg-secondary/30 px-2.5 py-1.5 rounded-xl border border-border/40">
                          <Users className="size-3.5 text-primary" />
                          <span>For: <strong>{occasion.recipientName}</strong></span>
                        </div>
                      )}

                      {occasion.budget && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Coins className="size-3 text-primary" />
                          <span>Target Budget: <strong>₹{occasion.budget}</strong></span>
                        </div>
                      )}

                      {occasion.notes && (
                        <p className="text-[11px] text-muted-foreground italic line-clamp-2">
                          &ldquo;{occasion.notes}&rdquo;
                        </p>
                      )}
                    </CardContent>

                    <CardFooter className="p-5 pt-2 border-t border-border/50 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/find-gift?recipient=${encodeURIComponent(occasion.recipientName || "")}&recipientId=${occasion.recipientId || ""}&occasion=${encodeURIComponent(occasion.title)}&budget=${occasion.budget || ""}`}
                          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                        >
                          <Sparkles className="size-3" />
                          <span>Find Gift</span>
                        </Link>
                        <Link
                          href={`/gift-plans?occasion=${encodeURIComponent(occasion.title)}`}
                          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                        >
                          <span>Plan</span>
                          <ArrowRight className="size-3" />
                        </Link>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-foreground"
                          onClick={() => {
                            setOccasionToEdit(occasion)
                            setIsFormOpen(true)
                          }}
                          title="Edit"
                        >
                          <Edit2 className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-destructive"
                          onClick={() => {
                            if (occasion.id) handleDelete(occasion.id)
                          }}
                          title="Delete"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Occasion Form Modal */}
      <OccasionFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        occasionToEdit={occasionToEdit}
        onSuccess={loadOccasions}
      />
    </div>
  )
}
