"use client"

import * as React from "react"
import { Calendar, Sparkles, Loader2, AlertCircle } from "lucide-react"
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
import { useAuth } from "@/context/auth-context"
import { recipientService } from "@/lib/services/recipient-service"
import { occasionService } from "@/lib/services/occasion-service"
import { Occasion, OccasionType } from "@/lib/types/occasion"
import { Recipient } from "@/lib/types/recipient"

interface OccasionFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  occasionToEdit?: Occasion | null
  onSuccess: () => void
}

const occasionTypes: { label: string; value: OccasionType }[] = [
  { label: "Birthday", value: "birthday" },
  { label: "Anniversary", value: "anniversary" },
  { label: "Holiday / Festive", value: "holiday" },
  { label: "Graduation", value: "graduation" },
  { label: "Wedding", value: "wedding" },
  { label: "Career / Promotion", value: "promotion" },
  { label: "Custom Occasion", value: "custom" },
]

export function OccasionFormDialog({
  open,
  onOpenChange,
  occasionToEdit,
  onSuccess,
}: OccasionFormDialogProps) {
  const { user } = useAuth()
  const [recipients, setRecipients] = React.useState<Recipient[]>([])
  const [isSaving, setIsSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Form states
  const [title, setTitle] = React.useState("")
  const [recipientId, setRecipientId] = React.useState<string>("")
  const [date, setDate] = React.useState("")
  const [type, setType] = React.useState<OccasionType>("birthday")
  const [budget, setBudget] = React.useState<string>("")
  const [notes, setNotes] = React.useState("")

  React.useEffect(() => {
    if (!user) return
    recipientService.getAll(user.uid).then(setRecipients).catch(console.error)
  }, [user])

  React.useEffect(() => {
    if (occasionToEdit) {
      setTitle(occasionToEdit.title || "")
      setRecipientId(occasionToEdit.recipientId || "")
      setDate(occasionToEdit.date || "")
      setType(occasionToEdit.type || "birthday")
      setBudget(occasionToEdit.budget ? occasionToEdit.budget.toString() : "")
      setNotes(occasionToEdit.notes || "")
    } else {
      setTitle("")
      setRecipientId("")
      setDate("")
      setType("birthday")
      setBudget("")
      setNotes("")
    }
    setError(null)
  }, [occasionToEdit, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    if (!title.trim() || !date) {
      setError("Please provide an occasion title and date.")
      return
    }

    setIsSaving(true)
    setError(null)

    const selectedRecipient = recipients.find((r) => r.id === recipientId)

    const payload = {
      title: title.trim(),
      recipientId: recipientId || undefined,
      recipientName: selectedRecipient?.name || undefined,
      date,
      type,
      budget: budget ? parseFloat(budget) : undefined,
      notes: notes.trim() || undefined,
    }

    try {
      if (occasionToEdit?.id) {
        await occasionService.updateOccasion(user.uid, occasionToEdit.id, payload)
      } else {
        await occasionService.createOccasion(user.uid, payload)
      }
      onOpenChange(false)
      onSuccess()
    } catch (err) {
      console.error("Save occasion error:", err)
      setError("Failed to save occasion. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto bg-card p-6 sm:p-8 rounded-3xl border border-border/80 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary text-xs font-mono">
            <Calendar className="size-3.5" />
            <span className="uppercase tracking-widest font-sans font-semibold">
              {occasionToEdit ? "Edit Milestone" : "Schedule Milestone"}
            </span>
          </div>
          <DialogTitle className="font-serif text-2xl font-bold text-foreground">
            {occasionToEdit ? `Update ${occasionToEdit.title}` : "Track an Occasion"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Set countdowns and budgets to ensure thoughtful gift preparation well in advance.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground/90">
              Occasion Title *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Tara's 3rd Anniversary, Mom's 50th Birthday"
              required
              className="h-10 bg-background/60"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground/90">
                Link to Recipient
              </label>
              <select
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                className="h-10 rounded-xl border border-input bg-background/60 px-3 text-xs text-foreground outline-none"
              >
                <option value="">General / Family</option>
                {recipients.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.relationship})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground/90">
                Occasion Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as OccasionType)}
                className="h-10 rounded-xl border border-input bg-background/60 px-3 text-xs text-foreground outline-none"
              >
                {occasionTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground/90">
                Date *
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="h-10 bg-background/60"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground/90">
                Target Budget (₹)
              </label>
              <Input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. 5000"
                min="0"
                className="h-10 bg-background/60"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground/90">
              Notes & Gifting Vibe
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any planning reminders or special instructions (e.g. Wants a quiet celebration, loves experiences over physical items)"
              className="w-full resize-none rounded-xl border border-input bg-background/60 p-3 text-xs text-foreground outline-none focus:border-ring"
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
                  {occasionToEdit ? "Update Occasion" : "Schedule Milestone"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
