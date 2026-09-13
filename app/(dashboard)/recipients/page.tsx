import type { Metadata } from "next"
import { Users, UserPlus } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Recipients — Present Perfect",
  description: "Manage dossiers for family, friends, and partners. Store quirks, hobbies, and preferences.",
}

export default function RecipientsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Recipients Dossier"
        description="Store intimate details about the people who matter most: personality traits, favorite things, dislikes, and key milestones."
        badgeText="Profiles"
      >
        <Button>
          <UserPlus data-icon="inline-start" />
          Add Recipient
        </Button>
      </PageHeader>

      <EmptyState
        icon={Users}
        badgeText="No Profiles Yet"
        title="No recipients in your circle"
        description="Build comprehensive taste profiles so Present Perfect can suggest hyper-personalized gifts. Add partners, siblings, parents, colleagues, or friends."
        action={
          <Button>
            <UserPlus data-icon="inline-start" />
            Add Your First Recipient
          </Button>
        }
        hintText="Firestore recipient isolation & profile management will be implemented in Phase 3."
      />
    </div>
  )
}
