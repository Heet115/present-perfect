import type { Metadata } from "next"
import Link from "next/link"
import { Bookmark, Sparkles } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Saved Gifts — Present Perfect",
  description: "View and manage all bookmarked gift recommendations across your recipients.",
}

export default function SavedGiftsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Saved Gifts"
        description="Your private vault of bookmarked AI gift recommendations, memorable treasures, and future inspiration."
        badgeText="Vault"
      />

      <EmptyState
        icon={Bookmark}
        badgeText="Empty Vault"
        title="No saved gifts yet"
        description="When you find an inspired recommendation from the AI Gift Finder, click save to keep it in your permanent collection for future occasions."
        action={
          <Button render={<Link href="/find-gift" />}>
            <Sparkles data-icon="inline-start" />
            Explore Gift Recommendations
          </Button>
        }
        hintText="Saved gifts collection and persistence will be implemented in Phase 8."
      />
    </div>
  )
}
