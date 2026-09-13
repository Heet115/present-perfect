"use client"

import * as React from "react"
import {
  ClipboardList,
  Sparkles,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  Tag,
} from "lucide-react"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/auth-context"
import { recipientService } from "@/lib/services/recipient-service"
import { occasionService } from "@/lib/services/occasion-service"
import { GiftPlan, GiftPlanStatus, GiftIdeaItem, Occasion } from "@/lib/types/occasion"
import { Recipient } from "@/lib/types/recipient"

interface GiftPlanFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  planToEdit?: GiftPlan | null
  onSuccess: () => void
}

const statusOptions: { label: string; value: GiftPlanStatus }[] = [
  { label: "Planning", value: "planning" },
  { label: "Shortlisted", value: "shortlisted" },
  { label: "Purchased", value: "purchased" },
  { label: "Gifted", value: "gifted" },
]

export function GiftPlanFormDialog({
  open,
  onOpenChange,
  planToEdit,
  onSuccess,
}: GiftPlanFormDialogProps) {
  const { user } = useAuth()
  const [recipients, setRecipients] = React.useState<Recipient[]>([])
  const [occasions, setOccasions] = React.useState<Occasion[]>([])
  const [isSaving, setIsSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Form states
  const [recipientId, setRecipientId] = React.useState("")
  const [occasionId, setOccasionId] = React.useState("")
  const [status, setStatus] = React.useState<GiftPlanStatus>("planning")
  const [targetBudget, setTargetBudget] = React.useState("3000")
  const [actualSpend, setActualSpend] = React.useState("")
  const [currency, setCurrency] = React.useState("₹")
  const [notes, setNotes] = React.useState("")

  // Dynamic gift ideas
  const [giftIdeas, setGiftIdeas] = React.useState<GiftIdeaItem[]>([])
  const [ideaTitle, setIdeaTitle] = React.useState("")
  const [ideaPrice, setIdeaPrice] = React.useState("")

  React.useEffect(() => {
    if (!user) return
    recipientService.getAll(user.uid).then(setRecipients).catch(console.error)
    occasionService.getAllOccasions(user.uid).then(setOccasions).catch(console.error)
  }, [user])

  React.useEffect(() => {
    if (planToEdit) {
      setRecipientId(planToEdit.recipientId || "")
      setOccasionId(planToEdit.occasionId || "")
      setStatus(planToEdit.status || "planning")
      setTargetBudget(planToEdit.targetBudget ? planToEdit.targetBudget.toString() : "3000")
      setActualSpend(planToEdit.actualSpend ? planToEdit.actualSpend.toString() : "")
      setCurrency(planToEdit.currency || "₹")
      setNotes(planToEdit.notes || "")
      setGiftIdeas(planToEdit.giftIdeas || [])
    } else {
      setRecipientId("")
      setOccasionId("")
      setStatus("planning")
      setTargetBudget("3000")
      setActualSpend("")
      setCurrency("₹")
      setNotes("")
      setGiftIdeas([])
    }
    setError(null)
  }, [planToEdit, open])

  const addGiftIdea = () => {
    if (!ideaTitle.trim()) return
    const newItem: GiftIdeaItem = {
      id: Date.now().toString(),
      title: ideaTitle.trim(),
      price: ideaPrice ? parseFloat(ideaPrice) : undefined,
    }
    setGiftIdeas([...giftIdeas, newItem])
    setIdeaTitle("")
    setIdeaPrice("")
  }

  const removeGiftIdea = (id: string) => {
    setGiftIdeas(giftIdeas.filter((item) => item.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    if (!recipientId) {
      setError("Please select a recipient for this gift plan.")
      return
    }

    setIsSaving(true)
    setError(null)

    const selectedRecipient = recipients.find((r) => r.id === recipientId)
    const selectedOccasion = occasions.find((o) => o.id === occasionId)

    const payload: Record<string, any> = {
      recipientId,
      recipientName: selectedRecipient?.name || "Recipient",
      status,
      targetBudget: parseFloat(targetBudget) || 0,
      currency,
      giftIdeas,
    }
    if (occasionId) {
      payload.occasionId = occasionId
      if (selectedOccasion?.title) payload.occasionTitle = selectedOccasion.title
      if (selectedOccasion?.date) payload.occasionDate = selectedOccasion.date
    }
    if (actualSpend && !isNaN(parseFloat(actualSpend))) {
      payload.actualSpend = parseFloat(actualSpend)
    }
    if (notes.trim()) {
      payload.notes = notes.trim()
    }

    try {
      if (planToEdit?.id) {
        await occasionService.updateGiftPlan(user.uid, planToEdit.id, payload)
      } else {
        await occasionService.createGiftPlan(user.uid, payload as any)
      }
      onOpenChange(false)
      onSuccess()
    } catch (err) {
      console.error("Save gift plan error:", err)
      setError("Failed to save gift plan. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto bg-card p-6 sm:p-8 rounded-3xl border border-border/80 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary text-xs font-mono">
            <ClipboardList className="size-3.5" />
            <span className="uppercase tracking-widest font-sans font-semibold">
              {planToEdit ? "Edit Plan" : "New Gift Plan"}
            </span>
          </div>
          <DialogTitle className="font-serif text-2xl font-bold text-foreground">
            {planToEdit ? "Update Gift Plan" : "Create Gifting Plan"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Track your gift from brainstorming to shortlisted, purchased, and gifted.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          {/* Recipient & Occasion */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-foreground/90">
                Recipient *
              </Label>
              <Select
                value={recipientId}
                onValueChange={(val) => setRecipientId(val ?? "")}
              >
                <SelectTrigger className="h-10 w-full rounded-xl border border-input bg-background/60 px-3 text-xs text-foreground">
                  <SelectValue placeholder="Select Recipient...">
                    {recipientId
                      ? recipients.find((r) => r.id === recipientId)?.name
                      : "Select Recipient..."}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {recipients.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name} ({r.relationship})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-foreground/90">
                Associated Occasion
              </Label>
              <Select
                value={occasionId || "none"}
                onValueChange={(val) => setOccasionId(val === "none" ? "" : (val ?? ""))}
              >
                <SelectTrigger className="h-10 w-full rounded-xl border border-input bg-background/60 px-3 text-xs text-foreground">
                  <SelectValue placeholder="None / Custom Surprise">
                    {occasionId
                      ? occasions.find((o) => o.id === occasionId)?.title
                      : "None / Custom Surprise"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None / Custom Surprise</SelectItem>
                  {occasions.map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.title} ({o.date})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-foreground/90">
                Plan Status
              </Label>
              <Select
                value={status}
                onValueChange={(val) => {
                  if (val) setStatus(val as GiftPlanStatus)
                }}
              >
                <SelectTrigger className="h-10 w-full rounded-xl border border-input bg-background/60 px-3 text-xs text-foreground">
                  <SelectValue>
                    {statusOptions.find((s) => s.value === status)?.label || status}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-foreground/90">
                Budget (₹)
              </Label>
              <Input
                type="number"
                value={targetBudget}
                onChange={(e) => setTargetBudget(e.target.value)}
                min="0"
                required
                className="h-10 bg-background/60"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-foreground/90">
                Actual Spend (₹)
              </Label>
              <Input
                type="number"
                value={actualSpend}
                onChange={(e) => setActualSpend(e.target.value)}
                placeholder="Optional"
                min="0"
                className="h-10 bg-background/60"
              />
            </div>
          </div>

          <Separator />

          {/* Gift Ideas Section */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-medium text-foreground/90 flex items-center justify-between">
              <span>Gift Ideas & Shortlist</span>
              <span className="text-[11px] text-muted-foreground font-normal">
                Add potential pieces
              </span>
            </Label>

            <div className="flex gap-2">
              <Input
                value={ideaTitle}
                onChange={(e) => setIdeaTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addGiftIdea()
                  }
                }}
                placeholder="Item name (e.g. Brass Pour-Over Dripper)"
                className="h-9 bg-background/60 text-xs flex-1"
              />
              <Input
                type="number"
                value={ideaPrice}
                onChange={(e) => setIdeaPrice(e.target.value)}
                placeholder="₹ Price"
                className="h-9 bg-background/60 text-xs w-24"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addGiftIdea}
                className="h-9 text-xs gap-1 px-3"
              >
                <Plus className="size-3" />
                Add
              </Button>
            </div>

            {giftIdeas.length > 0 && (
              <div className="flex flex-col gap-1.5 pt-2">
                {giftIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="flex items-center justify-between rounded-xl bg-secondary/30 px-3 py-2 border border-border/50 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Tag className="size-3 text-primary" />
                      <span className="font-semibold text-foreground">{idea.title}</span>
                      {idea.price && (
                        <span className="text-muted-foreground font-mono">
                          (₹{idea.price})
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeGiftIdea(idea.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-foreground/90">
              Planning Notes & Delivery Reminders
            </Label>
            <Textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Delivery deadlines, store URLs, or gift wrap instructions..."
              className="min-h-[70px] w-full rounded-xl border border-input bg-background/60 p-3 text-xs text-foreground"
            />
          </div>

          <DialogFooter className="pt-3 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving} className="text-xs gap-1.5">
              {isSaving ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Sparkles className="size-3.5" />
                  {planToEdit ? "Update Plan" : "Create Gift Plan"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
