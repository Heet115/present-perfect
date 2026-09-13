"use client"

import * as React from "react"
import { History, Sparkles, Loader2, Calendar, Coins, Gift, Heart } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Recipient } from "@/lib/types/recipient"
import { GiftHistoryItem } from "@/lib/types/gift-history"

interface GiftHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  recipients: Recipient[]
  initialData?: GiftHistoryItem | null
  onSubmit: (data: Omit<GiftHistoryItem, "id" | "userId" | "createdAt">) => Promise<void>
}

export function GiftHistoryDialog({
  open,
  onOpenChange,
  recipients,
  initialData,
  onSubmit,
}: GiftHistoryDialogProps) {
  const [giftName, setGiftName] = React.useState("")
  const [selectedRecipientId, setSelectedRecipientId] = React.useState("")
  const [customRecipientName, setCustomRecipientName] = React.useState("")
  const [giftDate, setGiftDate] = React.useState(new Date().toISOString().split("T")[0])
  const [giftPrice, setGiftPrice] = React.useState(2500)
  const [currency, setCurrency] = React.useState("₹")
  const [occasion, setOccasion] = React.useState("Birthday")
  const [giftNotes, setGiftNotes] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (initialData) {
      setGiftName(initialData.giftName)
      setSelectedRecipientId(initialData.recipientId || "")
      setCustomRecipientName(initialData.recipientName)
      setGiftDate(initialData.giftDate)
      setGiftPrice(initialData.giftPrice)
      setCurrency(initialData.currency || "₹")
      setOccasion(initialData.occasion)
      setGiftNotes(initialData.giftNotes || "")
    } else {
      setGiftName("")
      setSelectedRecipientId(recipients[0]?.id || "")
      setCustomRecipientName(recipients[0]?.name || "")
      setGiftDate(new Date().toISOString().split("T")[0])
      setGiftPrice(2500)
      setCurrency("₹")
      setOccasion("Birthday")
      setGiftNotes("")
    }
  }, [initialData, recipients, open])

  const handleRecipientChange = (id: string) => {
    setSelectedRecipientId(id)
    const found = recipients.find((r) => r.id === id)
    if (found) {
      setCustomRecipientName(found.name)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!giftName.trim()) return

    const recipientName =
      selectedRecipientId && selectedRecipientId !== "custom"
        ? recipients.find((r) => r.id === selectedRecipientId)?.name || customRecipientName
        : customRecipientName || "Someone Special"

    setSubmitting(true)
    try {
      await onSubmit({
        giftName: giftName.trim(),
        recipientId: selectedRecipientId || undefined,
        recipientName,
        giftPrice: Number(giftPrice) || 0,
        currency,
        occasion: occasion.trim() || "Celebration",
        giftDate,
        giftNotes: giftNotes.trim() || undefined,
      })
      onOpenChange(false)
    } catch (err) {
      console.error("Failed to save history entry:", err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card p-6 sm:p-8 rounded-3xl border border-border/80 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
            <History className="size-4" />
            <span>Archive Entry</span>
          </div>
          <DialogTitle className="font-serif text-2xl font-bold text-foreground">
            {initialData ? "Edit Gift Record" : "Record Given Gift"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Log previous gifts so you never repeat ideas and remember what resonated deeply.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          {/* Gift Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">Gift Name *</label>
            <Input
              value={giftName}
              onChange={(e) => setGiftName(e.target.value)}
              placeholder="e.g. Vintage Brass Espresso Machine"
              required
              className="h-10 text-xs bg-background/60 rounded-xl"
            />
          </div>

          {/* Recipient Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">Recipient *</label>
            {recipients.length > 0 ? (
              <select
                value={selectedRecipientId}
                onChange={(e) => handleRecipientChange(e.target.value)}
                className="h-10 rounded-xl border border-input bg-background/60 px-3 text-xs text-foreground outline-none cursor-pointer"
              >
                {recipients.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.relationship})
                  </option>
                ))}
                <option value="custom">Other / Custom Recipient</option>
              </select>
            ) : null}

            {(!recipients.length || selectedRecipientId === "custom") && (
              <Input
                value={customRecipientName}
                onChange={(e) => setCustomRecipientName(e.target.value)}
                placeholder="Recipient's Name"
                required
                className="h-10 text-xs bg-background/60 rounded-xl mt-1"
              />
            )}
          </div>

          {/* Occasion & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Occasion *</label>
              <Input
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder="e.g. 30th Birthday"
                required
                className="h-10 text-xs bg-background/60 rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Date Given *</label>
              <Input
                type="date"
                value={giftDate}
                onChange={(e) => setGiftDate(e.target.value)}
                required
                className="h-10 text-xs bg-background/60 rounded-xl font-mono"
              />
            </div>
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">Price / Spend (₹) *</label>
            <Input
              type="number"
              value={giftPrice}
              onChange={(e) => setGiftPrice(parseFloat(e.target.value) || 0)}
              min="0"
              step="50"
              required
              className="h-10 text-xs bg-background/60 rounded-xl font-mono"
            />
          </div>

          {/* Notes & Memories */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">
              Personal Reaction & Memories (Optional)
            </label>
            <textarea
              value={giftNotes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setGiftNotes(e.target.value)}
              placeholder="How did they react? Did they use it immediately? Where did you purchase it?"
              rows={3}
              className="w-full rounded-xl border border-input bg-background/60 p-3 text-xs text-foreground outline-none resize-none"
            />
          </div>

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-xs rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || !giftName.trim()}
              className="text-xs rounded-xl gap-1.5 cursor-pointer shadow-xs"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Sparkles className="size-3.5" />
                  {initialData ? "Save Changes" : "Log Gift"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
