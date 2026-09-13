import type { Metadata } from "next"
import { ClipboardList, Plus } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Gift Plans — Present Perfect",
  description: "Organize budgets, shortlisted gifts, purchase tracking, and delivery timelines.",
}

const planStatuses = [
  "All Plans",
  "Planning",
  "Shortlisted",
  "Purchased",
  "Gifted",
  "Completed",
]

export default function GiftPlansPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Gift Plans"
        description="Organize your gift journey step by step: set budgets, shortlist AI suggestions, track delivery, and record heartfelt feedback."
        badgeText="Workflow"
      >
        <Button>
          <Plus data-icon="inline-start" />
          Create Gift Plan
        </Button>
      </PageHeader>

      {/* Status Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {planStatuses.map((status, index) => (
          <Badge
            key={status}
            variant={index === 0 ? "secondary" : "outline"}
            className="cursor-pointer px-3 py-1 text-xs transition-colors hover:bg-secondary"
          >
            {status}
          </Badge>
        ))}
      </div>

      <EmptyState
        icon={ClipboardList}
        badgeText="No Active Plans"
        title="No gift plans in progress"
        description="Create a gift plan to associate a recipient with an occasion, specify a spending budget, shortlist curated picks, and follow through to delivery."
        action={
          <Button>
            <Plus data-icon="inline-start" />
            Create Your First Plan
          </Button>
        }
        hintText="Full gift planning workflow will be implemented in Phase 4."
      />
    </div>
  )
}
