"use client"

import * as React from "react"
import Link from "next/link"
import {
  ClipboardList,
  Plus,
  Sparkles,
  Loader2,
  Trash2,
  Edit2,
  Users,
  Calendar,
  Tag,
  CheckCircle2,
  ArrowRight,
  Coins,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GiftPlanFormDialog } from "@/components/gift-plan-form-dialog"
import { useAuth } from "@/context/auth-context"
import { occasionService } from "@/lib/services/occasion-service"
import { GiftPlan, GiftPlanStatus } from "@/lib/types/occasion"

const statusFilters: { label: string; value: string }[] = [
  { label: "All Plans", value: "all" },
  { label: "Planning", value: "planning" },
  { label: "Shortlisted", value: "shortlisted" },
  { label: "Purchased", value: "purchased" },
  { label: "Gifted", value: "gifted" },
]

export default function GiftPlansPage() {
  const { user } = useAuth()
  const [plans, setPlans] = React.useState<GiftPlan[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [planToEdit, setPlanToEdit] = React.useState<GiftPlan | null>(null)
  const [activeStatus, setActiveStatus] = React.useState<string>("all")

  const loadPlans = React.useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await occasionService.getAllGiftPlans(user.uid)
      setPlans(data)
    } catch (err) {
      console.error("Failed to load gift plans:", err)
    } finally {
      setLoading(false)
    }
  }, [user])

  React.useEffect(() => {
    loadPlans()
  }, [loadPlans])

  const handleDelete = async (planId: string) => {
    if (!user) return
    try {
      await occasionService.deleteGiftPlan(user.uid, planId)
      setPlans((prev) => prev.filter((p) => p.id !== planId))
    } catch (err) {
      console.error("Failed to delete gift plan:", err)
    }
  }

  const handleStatusChange = async (planId: string, nextStatus: GiftPlanStatus) => {
    if (!user) return
    try {
      await occasionService.updatePlanStatus(user.uid, planId, nextStatus)
      setPlans((prev) =>
        prev.map((p) => (p.id === planId ? { ...p, status: nextStatus } : p))
      )
    } catch (err) {
      console.error("Failed to update status:", err)
    }
  }

  const filteredPlans = plans.filter((p) => {
    if (activeStatus === "all") return true
    return p.status === activeStatus
  })

  const getNextStatus = (current: GiftPlanStatus): GiftPlanStatus | null => {
    switch (current) {
      case "planning":
        return "shortlisted"
      case "shortlisted":
        return "purchased"
      case "purchased":
        return "gifted"
      case "gifted":
        return null
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Gift Plans"
        description="Track your gifting lifecycle from brainstorming and budgeting to shortlisting, purchasing, and presenting."
        badgeText={`${plans.length} Active Plans`}
      >
        <Button
          onClick={() => {
            setPlanToEdit(null)
            setIsFormOpen(true)
          }}
          className="gap-2 shadow-xs"
        >
          <Plus data-icon="inline-start" />
          Create Gift Plan
        </Button>
      </PageHeader>

      {/* Loading state */}
      {loading ? (
        <div className="flex min-h-[35vh] flex-col items-center justify-center gap-3 text-center">
          <Loader2 className="size-8 animate-spin text-primary" />
          <span className="text-xs text-muted-foreground font-serif italic">
            Retrieving gift planning pipelines...
          </span>
        </div>
      ) : plans.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          badgeText="No Plans Active"
          title="No gift plans in progress"
          description="Create a gift plan to associate a recipient with an occasion, specify spending budgets, track shortlisted ideas, and follow through to delivery."
          action={
            <Button
              onClick={() => {
                setPlanToEdit(null)
                setIsFormOpen(true)
              }}
              className="gap-2"
            >
              <Plus data-icon="inline-start" />
              Create Your First Plan
            </Button>
          }
          hintText="Integrated with your private Firestore database."
        />
      ) : (
        <div className="flex flex-col gap-6">
          {/* Status Pipeline Filter */}
          <div className="flex items-center gap-1.5 p-1 bg-secondary/40 rounded-full border border-border/60 w-fit backdrop-blur-xs overflow-x-auto">
            {statusFilters.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveStatus(tab.value)}
                className={`rounded-full px-3.5 py-1 text-xs font-medium transition-colors ${
                  activeStatus === tab.value
                    ? "bg-card text-foreground font-semibold shadow-xs ring-1 ring-border/80"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {filteredPlans.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/80 p-8 text-center text-xs text-muted-foreground">
              No gift plans in this stage.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredPlans.map((plan) => {
                const next = getNextStatus(plan.status)

                return (
                  <Card
                    key={plan.id}
                    className="border-border/70 bg-card/85 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <CardHeader className="p-5 pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <Badge
                          variant={
                            plan.status === "gifted"
                              ? "default"
                              : plan.status === "purchased"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-[10px] uppercase tracking-wider font-semibold"
                        >
                          {plan.status}
                        </Badge>

                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Coins className="size-3 text-primary" />
                          <span className="font-bold text-foreground">
                            {plan.currency}{plan.targetBudget}
                          </span>
                        </div>
                      </div>

                      <CardTitle className="font-serif text-xl font-bold text-foreground mt-3">
                        For {plan.recipientName}
                      </CardTitle>

                      {plan.occasionTitle && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                          <Calendar className="size-3 text-primary" />
                          <span>{plan.occasionTitle} {plan.occasionDate && `(${plan.occasionDate})`}</span>
                        </div>
                      )}
                    </CardHeader>

                    <CardContent className="p-5 pt-0 flex flex-col gap-3">
                      {/* Shortlisted ideas */}
                      {plan.giftIdeas && plan.giftIdeas.length > 0 && (
                        <div className="flex flex-col gap-1.5 bg-secondary/30 p-3 rounded-2xl border border-border/50 text-xs">
                          <span className="font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">
                            Ideas ({plan.giftIdeas.length}):
                          </span>
                          <div className="flex flex-col gap-1">
                            {plan.giftIdeas.map((idea) => (
                              <div key={idea.id} className="flex items-center justify-between text-[11px]">
                                <span className="font-medium text-foreground truncate">{idea.title}</span>
                                {idea.price && (
                                  <span className="text-muted-foreground font-mono">
                                    {plan.currency}{idea.price}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {plan.notes && (
                        <p className="text-[11px] text-muted-foreground italic line-clamp-2">
                          &ldquo;{plan.notes}&rdquo;
                        </p>
                      )}
                    </CardContent>

                    <CardFooter className="p-5 pt-2 border-t border-border/50 flex items-center justify-between gap-2">
                      {next ? (
                        <button
                          onClick={() => {
                            if (plan.id) handleStatusChange(plan.id, next)
                          }}
                          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                        >
                          <span>Advance to {next}</span>
                          <ArrowRight className="size-3" />
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <CheckCircle2 className="size-3 text-primary" />
                          <span>Gift Completed</span>
                        </span>
                      )}

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-foreground"
                          onClick={() => {
                            setPlanToEdit(plan)
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
                            if (plan.id) handleDelete(plan.id)
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

      {/* Gift Plan Modal */}
      <GiftPlanFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        planToEdit={planToEdit}
        onSuccess={loadPlans}
      />
    </div>
  )
}
