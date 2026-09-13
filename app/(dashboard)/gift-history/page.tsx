"use client"

import * as React from "react"
import Link from "next/link"
import {
  History,
  Sparkles,
  Plus,
  Search,
  Trash2,
  Edit2,
  Calendar,
  Wallet,
  Gift,
  Loader2,
  TrendingUp,
  Award,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/auth-context"
import { giftHistoryService } from "@/lib/services/gift-history-service"
import { recipientService } from "@/lib/services/recipient-service"
import { GiftHistoryDialog } from "@/components/gift-history-dialog"
import { GiftHistoryItem } from "@/lib/types/gift-history"
import { Recipient } from "@/lib/types/recipient"

export default function GiftHistoryPage() {
  const { user } = useAuth()
  const [history, setHistory] = React.useState<GiftHistoryItem[]>([])
  const [recipients, setRecipients] = React.useState<Recipient[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedRecipientFilter, setSelectedRecipientFilter] = React.useState("All")

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [itemToEdit, setItemToEdit] = React.useState<GiftHistoryItem | null>(null)
  const [notification, setNotification] = React.useState<string | null>(null)

  const loadData = React.useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const [historyData, recipientsData] = await Promise.all([
        giftHistoryService.getAll(user.uid),
        recipientService.getAll(user.uid),
      ])
      setHistory(historyData)
      setRecipients(recipientsData)
    } catch (err) {
      console.error("Failed to load gift history:", err)
    } finally {
      setLoading(false)
    }
  }, [user])

  React.useEffect(() => {
    loadData()
  }, [loadData])

  const handleSave = async (data: Omit<GiftHistoryItem, "id" | "userId" | "createdAt">) => {
    if (!user) return
    if (itemToEdit) {
      await giftHistoryService.update(user.uid, itemToEdit.id, data)
      setNotification(`Updated "${data.giftName}" in history.`)
    } else {
      await giftHistoryService.create(user.uid, data)
      setNotification(`Recorded "${data.giftName}" in history archive.`)
    }
    setTimeout(() => setNotification(null), 3500)
    await loadData()
  }

  const handleDelete = async (id: string, name: string) => {
    if (!user) return
    try {
      await giftHistoryService.delete(user.uid, id)
      setHistory((prev) => prev.filter((item) => item.id !== id))
      setNotification(`Deleted "${name}" from history.`)
      setTimeout(() => setNotification(null), 3000)
    } catch (err) {
      console.error("Failed to delete history item:", err)
    }
  }

  const filteredHistory = history.filter((item) => {
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      item.giftName.toLowerCase().includes(q) ||
      item.recipientName.toLowerCase().includes(q) ||
      item.occasion.toLowerCase().includes(q) ||
      (item.giftNotes && item.giftNotes.toLowerCase().includes(q))

    const matchesRecipient =
      selectedRecipientFilter === "All" ||
      item.recipientName === selectedRecipientFilter ||
      item.recipientId === selectedRecipientFilter

    return matchesSearch && matchesRecipient
  })

  // Summary Metrics
  const totalSpent = history.reduce((sum, item) => sum + (item.giftPrice || 0), 0)
  const uniqueRecipientsCount = new Set(history.map((h) => h.recipientName)).size

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Gift History & Archive"
        description="A nostalgic record of every gift you have ever given. Prevents repeat gifts and tracks what brought genuine smiles."
        badgeText={`${history.length} Given Gifts`}
      >
        <Button
          onClick={() => {
            setItemToEdit(null)
            setIsDialogOpen(true)
          }}
          className="gap-2 shadow-xs cursor-pointer"
        >
          <Plus data-icon="inline-start" />
          Record Past Gift
        </Button>
      </PageHeader>

      {/* Notification Banner */}
      {notification && (
        <div className="flex items-center gap-2 rounded-2xl bg-secondary/80 border border-accent/80 p-4 text-xs font-semibold text-foreground shadow-sm animate-in fade-in duration-200">
          <Sparkles className="size-4 text-primary" />
          <span>{notification}</span>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-3xl border border-border/80 bg-card/85 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Total Gifts Given
            </span>
            <Gift className="size-4 text-primary" />
          </div>
          <div className="font-serif text-3xl font-bold text-foreground mt-2">
            {history.length}
          </div>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">
            Across {uniqueRecipientsCount} cherished recipients
          </span>
        </Card>

        <Card className="rounded-3xl border border-border/80 bg-card/85 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Total Historical Spend
            </span>
            <Wallet className="size-4 text-primary" />
          </div>
          <div className="font-serif text-3xl font-bold text-foreground mt-2">
            ₹{totalSpent.toLocaleString()}
          </div>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">
            Average: ₹{history.length ? Math.round(totalSpent / history.length).toLocaleString() : 0} / gift
          </span>
        </Card>

        <Card className="rounded-3xl border border-border/80 bg-card/85 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Recipient Coverage
            </span>
            <Award className="size-4 text-primary" />
          </div>
          <div className="font-serif text-3xl font-bold text-foreground mt-2">
            {uniqueRecipientsCount}
          </div>
          <span className="text-[11px] text-muted-foreground mt-0.5 block">
            Profiles in your personal circle
          </span>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      {history.length > 0 && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-secondary/20 p-3 rounded-2xl border border-border/60">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search previous gifts, occasions, reactions..."
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
              {Array.from(new Set(history.map((h) => h.recipientName).filter(Boolean))).map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* History Items Grid */}
      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : filteredHistory.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filteredHistory.map((item) => {
            const formattedDate = new Date(item.giftDate).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })

            return (
              <Card
                key={item.id}
                className="p-5 rounded-3xl border border-border/70 bg-card/90 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary/70 text-primary border border-border/50">
                    <History className="size-5" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif text-lg font-bold text-foreground leading-snug">
                        {item.giftName}
                      </h3>
                      <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                        {item.occasion}
                      </Badge>
                      <Badge variant="secondary" className="text-[11px] font-medium">
                        For {item.recipientName}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="size-3 text-primary" />
                        {formattedDate}
                      </span>
                      <span>•</span>
                      <span className="font-serif font-bold text-foreground">
                        {item.currency || "₹"}{item.giftPrice.toLocaleString()}
                      </span>
                    </div>

                    {item.giftNotes && (
                      <p className="text-xs text-muted-foreground/90 mt-1 italic leading-relaxed">
                        &ldquo;{item.giftNotes}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      setItemToEdit(item)
                      setIsDialogOpen(true)
                    }}
                    className="rounded-xl text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Edit record"
                  >
                    <Edit2 className="size-3.5" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleDelete(item.id, item.giftName)}
                    className="rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <EmptyState
          icon={History}
          badgeText="Zero Archive Records"
          title={history.length === 0 ? "No completed gifts recorded yet" : "No matching gifts found"}
          description={
            history.length === 0
              ? "Record previous gifts given to your loved ones to build a permanent, nostalgic archive and prevent duplicate ideas."
              : "Try changing your search term or recipient filter."
          }
          action={
            <Button
              onClick={() => {
                setItemToEdit(null)
                setIsDialogOpen(true)
              }}
              className="gap-2"
            >
              <Plus data-icon="inline-start" />
              Record First Gift
            </Button>
          }
        />
      )}

      {/* Add / Edit Dialog */}
      <GiftHistoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        recipients={recipients}
        initialData={itemToEdit}
        onSubmit={handleSave}
      />
    </div>
  )
}
