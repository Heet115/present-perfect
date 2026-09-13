"use client"

import * as React from "react"
import Link from "next/link"
import {
  Bookmark,
  Sparkles,
  Search,
  Trash2,
  ExternalLink,
  Wallet,
  Loader2,
  Gift,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/auth-context"
import { savedGiftService } from "@/lib/services/saved-gift-service"
import { occasionService } from "@/lib/services/occasion-service"
import { recipientService } from "@/lib/services/recipient-service"
import { SavedGift } from "@/lib/types/saved-gift"
import { Recipient } from "@/lib/types/recipient"

export default function SavedGiftsPage() {
  const { user } = useAuth()
  const [savedGifts, setSavedGifts] = React.useState<SavedGift[]>([])
  const [recipients, setRecipients] = React.useState<Recipient[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedRecipientFilter, setSelectedRecipientFilter] = React.useState("All")
  const [notification, setNotification] = React.useState<string | null>(null)

  const loadData = React.useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const [giftsData, recipientsData] = await Promise.all([
        savedGiftService.getAll(user.uid),
        recipientService.getAll(user.uid),
      ])
      setSavedGifts(giftsData)
      setRecipients(recipientsData)
    } catch (err) {
      console.error("Failed to load saved gifts:", err)
    } finally {
      setLoading(false)
    }
  }, [user])

  React.useEffect(() => {
    loadData()
  }, [loadData])

  const handleRemove = async (giftId: string, giftName: string) => {
    if (!user) return
    try {
      await savedGiftService.delete(user.uid, giftId)
      setSavedGifts((prev) => prev.filter((g) => g.id !== giftId))
      setNotification(`Removed "${giftName}" from your vault.`)
      setTimeout(() => setNotification(null), 3000)
    } catch (err) {
      console.error("Failed to delete saved gift:", err)
    }
  }

  const handleMoveToPlan = async (gift: SavedGift) => {
    if (!user) return
    try {
      await occasionService.createGiftPlan(user.uid, {
        recipientId: gift.recipientId || "custom",
        recipientName: gift.recipientName || "Recipient",
        status: "shortlisted",
        targetBudget: gift.recommendation.estimatedPrice,
        currency: gift.recommendation.currency || "₹",
        giftIdeas: [
          {
            id: Date.now().toString(),
            title: gift.recommendation.name,
            price: gift.recommendation.estimatedPrice,
            notes: gift.recommendation.whyRecommended || gift.recommendation.whyItFits,
            isSelected: true,
          },
        ],
        notes: `Promoted from Vault on ${new Date().toLocaleDateString()}`,
      })
      setNotification(`Created active Gift Plan for "${gift.recommendation.name}"!`)
      setTimeout(() => setNotification(null), 4000)
    } catch (err) {
      console.error("Move to plan error:", err)
    }
  }

  const filteredGifts = savedGifts.filter((g) => {
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      g.recommendation.name.toLowerCase().includes(q) ||
      (g.recipientName && g.recipientName.toLowerCase().includes(q)) ||
      (g.recommendation.category && g.recommendation.category.toLowerCase().includes(q))

    const matchesRecipient =
      selectedRecipientFilter === "All" || g.recipientName === selectedRecipientFilter

    return matchesSearch && matchesRecipient
  })

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Saved Gifts Vault"
        description="Your curated treasury of bookmarked AI gift recommendations, memorable treasures, and future inspiration."
        badgeText={`${savedGifts.length} Bookmarked`}
      >
        <Button render={<Link href="/find-gift" />} className="gap-2 shadow-xs">
          <Sparkles data-icon="inline-start" />
          Find More Gifts
        </Button>
      </PageHeader>

      {/* Notification Banner */}
      {notification && (
        <div className="flex items-center gap-2 rounded-2xl bg-secondary/80 border border-accent/80 p-4 text-xs font-semibold text-foreground shadow-sm animate-in fade-in duration-200">
          <Sparkles className="size-4 text-primary" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      {savedGifts.length > 0 && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-secondary/20 p-3 rounded-2xl border border-border/60">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved gifts, categories..."
              className="pl-9 h-9 text-xs bg-background/80 rounded-xl"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">Recipient:</span>
            <select
              value={selectedRecipientFilter}
              onChange={(e) => setSelectedRecipientFilter(e.target.value)}
              className="h-9 rounded-xl border border-input bg-background/80 px-3 text-xs text-foreground outline-none cursor-pointer"
            >
              <option value="All">All Recipients</option>
              {Array.from(
                new Set(savedGifts.map((g) => g.recipientName).filter(Boolean))
              ).map((name) => (
                <option key={name} value={name!}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : filteredGifts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGifts.map((item) => {
            const rec = item.recommendation
            const buyUrl = `https://www.google.com/search?q=${encodeURIComponent(
              rec.searchQuery || rec.name
            )}`

            return (
              <Card
                key={item.id}
                className="group relative overflow-hidden rounded-3xl border border-border/80 bg-card/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="h-1.5 w-full bg-linear-to-r from-warm-mocha via-warm-sand to-warm-parchment" />

                <CardHeader className="p-6 pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge
                      variant="outline"
                      className="border-accent/80 bg-secondary/40 text-[10px] uppercase font-semibold text-primary"
                    >
                      {rec.category || "Treasured Gift"}
                    </Badge>

                    {item.recipientName && (
                      <Badge variant="secondary" className="text-[11px] font-medium">
                        For {item.recipientName}
                      </Badge>
                    )}
                  </div>

                  <div className="mt-3">
                    <CardTitle className="font-serif text-xl font-bold text-foreground leading-snug">
                      {rec.name}
                    </CardTitle>
                    {rec.tagline && (
                      <span className="text-[11px] text-muted-foreground block mt-0.5">
                        {rec.tagline}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm">
                    <div className="font-serif text-xl font-bold text-foreground">
                      {rec.currency}
                      {rec.estimatedPrice.toLocaleString()}
                    </div>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {rec.matchScore || rec.compatibilityScore || 95}% Affinity
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-6 pt-0 flex flex-col gap-3 text-xs">
                  {rec.description && (
                    <p className="text-muted-foreground leading-relaxed line-clamp-3">
                      {rec.description}
                    </p>
                  )}

                  {rec.budgetCompatibility && (
                    <div className="flex items-center gap-1.5 p-2 rounded-xl bg-secondary/20 border border-border/40 text-[11px] text-muted-foreground">
                      <Wallet className="size-3 text-primary shrink-0" />
                      <span className="truncate">{rec.budgetCompatibility}</span>
                    </div>
                  )}

                  {rec.handwrittenNote && (
                    <div className="p-2.5 rounded-xl bg-secondary/30 border border-border/50 font-serif italic text-foreground/80 leading-relaxed text-[11px]">
                      &ldquo;{rec.handwrittenNote}&rdquo;
                    </div>
                  )}
                </CardContent>

                <CardFooter className="p-6 pt-2 border-t border-border/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <a
                      href={buyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-medium"
                    >
                      <span>Sources</span>
                      <ExternalLink className="size-3" />
                    </a>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMoveToPlan(item)}
                      className="text-xs gap-1 rounded-xl cursor-pointer"
                    >
                      <Gift className="size-3 text-primary" />
                      <span>Create Plan</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleRemove(item.id, rec.name)}
                      className="rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                      title="Remove from vault"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      ) : (
        <EmptyState
          icon={Bookmark}
          badgeText="Empty Vault"
          title={savedGifts.length === 0 ? "No saved gifts in your vault" : "No matching gifts found"}
          description={
            savedGifts.length === 0
              ? "When you discover inspired recommendations in the AI Gift Finder, click 'Save' to preserve them in your permanent vault for future occasions."
              : "Try adjusting your search terms or recipient filter."
          }
          action={
            <Button render={<Link href="/find-gift" />}>
              <Sparkles data-icon="inline-start" />
              Explore Gift Recommendations
            </Button>
          }
        />
      )}
    </div>
  )
}
