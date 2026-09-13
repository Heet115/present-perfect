import type { Metadata } from "next"
import { History, Sparkles } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"

export const metadata: Metadata = {
  title: "Gift History — Present Perfect",
  description: "Your past gifting archive. Never give duplicate gifts again.",
}

export default function GiftHistoryPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Gift History"
        description="A nostalgic record of every gift you have ever given. Prevents repeat gifts and tracks what brought genuine smiles."
        badgeText="Archive"
      />

      <EmptyState
        icon={History}
        badgeText="Zero Archive Records"
        title="No completed gifts recorded yet"
        description="Once you complete a gift plan or manually log historical presents, you will see a chronological, recipient-wise log with prices, occasions, and personal reaction notes."
        hintText="Gift history tracking and recipient connections will be implemented in Phase 8."
      />
    </div>
  )
}
