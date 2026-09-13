import type { Metadata } from "next"
import { Calendar, CalendarPlus } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Occasions & Milestones — Present Perfect",
  description: "Track birthdays, anniversaries, graduations, promotions, and custom milestones.",
}

export default function OccasionsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Occasions & Milestones"
        description="Never miss an important date. Monitor birthdays, anniversaries, weddings, promotions, and custom celebratory moments."
        badgeText="Calendar & Radar"
      >
        <Button>
          <CalendarPlus data-icon="inline-start" />
          Add Occasion
        </Button>
      </PageHeader>

      <EmptyState
        icon={Calendar}
        badgeText="Zero Milestones Scheduled"
        title="No upcoming occasions tracked"
        description="Set up annual or one-off occasions. Present Perfect will notify you in advance so you can thoughtfully plan gifts without rushing."
        action={
          <Button>
            <CalendarPlus data-icon="inline-start" />
            Schedule an Occasion
          </Button>
        }
        hintText="Occasions and countdown tracking will be implemented in Phase 4."
      />
    </div>
  )
}
