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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

    const payload: Record<string, any> = {
      title: title.trim(),
      date,
      type,
    }
    if (recipientId) {
      payload.recipientId = recipientId
      if (selectedRecipient?.name) {
        payload.recipientName = selectedRecipient.name
      }
    }
    if (budget && !isNaN(parseFloat(budget))) {
      payload.budget = parseFloat(budget)
    }
    if (notes.trim()) {
      payload.notes = notes.trim()
    }

    try {
      if (occasionToEdit?.id) {
        await occasionService.updateOccasion(user.uid, occasionToEdit.id, payload)
      } else {
        await occasionService.createOccasion(user.uid, payload as any)
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
            <Label className="text-xs font-medium text-foreground/90">
              Occasion Title *
            </Label>
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
              <Label className="text-xs font-medium text-foreground/90">
                Link to Recipient
              </Label>
              <Select
                value={recipientId || "none"}
                onValueChange={(val) => setRecipientId(val === "none" ? "" : (val ?? ""))}
              >
                <SelectTrigger className="h-10 w-full rounded-xl border border-input bg-background/60 px-3 text-xs text-foreground">
                  <SelectValue placeholder="General / Family">
                    {recipientId
                      ? recipients.find((r) => r.id === recipientId)?.name
                      : "General / Family"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">General / Family</SelectItem>
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
                Occasion Type
              </Label>
              <Select
                value={type}
                onValueChange={(val) => {
                  if (val) setType(val as OccasionType)
                }}
              >
                <SelectTrigger className="h-10 w-full rounded-xl border border-input bg-background/60 px-3 text-xs text-foreground">
                  <SelectValue>
                    {occasionTypes.find((t) => t.value === type)?.label || type}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {occasionTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-foreground/90">
                Date *
              </Label>
              <DatePicker
                value={date}
                onChange={setDate}
                placeholder="Select occasion date"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-foreground/90">
                Target Budget (₹)
              </Label>
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
            <Label className="text-xs font-medium text-foreground/90">
              Notes & Gifting Vibe
            </Label>
            <Textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any planning reminders or special instructions (e.g. Wants a quiet celebration, loves experiences over physical items)"
              className="min-h-[80px] w-full rounded-xl border border-input bg-background/60 p-3 text-xs text-foreground"
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
