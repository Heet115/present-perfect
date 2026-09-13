"use client"

import * as React from "react"
import {
  X,
  Plus,
  Calendar,
  Sparkles,
  Loader2,
  Heart,
  Tag,
  AlertCircle,
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
import { DatePicker } from "@/components/ui/date-picker"
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
import { Recipient, ImportantDate } from "@/lib/types/recipient"

interface RecipientFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  recipientToEdit?: Recipient | null
  onSuccess: () => void
}

const relationshipOptions = [
  "Partner",
  "Spouse",
  "Mother",
  "Father",
  "Sister",
  "Brother",
  "Best Friend",
  "Friend",
  "Colleague",
  "Mentor",
  "Child",
  "Other",
]

const suggestedTraits = [
  "Minimalist",
  "Sentimental",
  "Practical",
  "Adventurous",
  "Creative",
  "Bookish",
  "Artisanal",
  "Introverted",
  "Extroverted",
  "Detail-Oriented",
]

export function RecipientFormDialog({
  open,
  onOpenChange,
  recipientToEdit,
  onSuccess,
}: RecipientFormDialogProps) {
  const { user } = useAuth()
  const [isSaving, setIsSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Form states
  const [name, setName] = React.useState("")
  const [relationship, setRelationship] = React.useState("Best Friend")
  const [ageGroup, setAgeGroup] = React.useState("20s")
  const [interests, setInterests] = React.useState<string[]>([])
  const [interestInput, setInterestInput] = React.useState("")
  const [personalityTraits, setPersonalityTraits] = React.useState<string[]>([])
  const [traitInput, setTraitInput] = React.useState("")
  const [favoriteThings, setFavoriteThings] = React.useState<string[]>([])
  const [favInput, setFavInput] = React.useState("")
  const [dislikes, setDislikes] = React.useState<string[]>([])
  const [dislikeInput, setDislikeInput] = React.useState("")
  const [sizing, setSizing] = React.useState("")
  const [preferredColors, setPreferredColors] = React.useState("")
  const [preferredVibe, setPreferredVibe] = React.useState("")
  const [personalNotes, setPersonalNotes] = React.useState("")
  const [importantDates, setImportantDates] = React.useState<ImportantDate[]>([])

  // New Date Row state
  const [dateTitle, setDateTitle] = React.useState("")
  const [dateValue, setDateValue] = React.useState("")
  const [dateType, setDateType] = React.useState<"birthday" | "anniversary" | "graduation" | "custom">("birthday")

  // Reset or populate on open
  React.useEffect(() => {
    if (recipientToEdit) {
      setName(recipientToEdit.name || "")
      setRelationship(recipientToEdit.relationship || "Best Friend")
      setAgeGroup(recipientToEdit.ageGroup || "20s")
      setInterests(recipientToEdit.interests || [])
      setPersonalityTraits(recipientToEdit.personalityTraits || [])
      setFavoriteThings(recipientToEdit.favoriteThings || [])
      setDislikes(recipientToEdit.dislikes || [])
      setSizing(recipientToEdit.preferences?.sizing || "")
      setPreferredColors(recipientToEdit.preferences?.preferredColors || "")
      setPreferredVibe(recipientToEdit.preferences?.preferredVibe || "")
      setPersonalNotes(recipientToEdit.personalNotes || "")
      setImportantDates(recipientToEdit.importantDates || [])
    } else {
      setName("")
      setRelationship("Best Friend")
      setAgeGroup("20s")
      setInterests([])
      setPersonalityTraits([])
      setFavoriteThings([])
      setDislikes([])
      setSizing("")
      setPreferredColors("")
      setPreferredVibe("")
      setPersonalNotes("")
      setImportantDates([])
    }
    setError(null)
  }, [recipientToEdit, open])

  // Chip addition helpers
  const addChip = (
    input: string,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const val = input.trim()
    if (val && !list.includes(val)) {
      setList([...list, val])
      setInput("")
    }
  }

  const removeChip = (
    valToRemove: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList(list.filter((item) => item !== valToRemove))
  }

  const addDate = () => {
    if (!dateTitle.trim() || !dateValue) return
    const newDate: ImportantDate = {
      id: Date.now().toString(),
      title: dateTitle.trim(),
      date: dateValue,
      type: dateType,
    }
    setImportantDates([...importantDates, newDate])
    setDateTitle("")
    setDateValue("")
  }

  const removeDate = (id: string) => {
    setImportantDates(importantDates.filter((d) => d.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    if (!name.trim()) {
      setError("Please specify the recipient's name.")
      return
    }

    setIsSaving(true)
    setError(null)

    const payload = {
      name: name.trim(),
      relationship,
      ageGroup,
      interests,
      personalityTraits,
      favoriteThings,
      dislikes,
      preferences: {
        sizing: sizing.trim(),
        preferredColors: preferredColors.trim(),
        preferredVibe: preferredVibe.trim(),
      },
      personalNotes: personalNotes.trim(),
      importantDates,
    }

    try {
      if (recipientToEdit?.id) {
        await recipientService.update(user.uid, recipientToEdit.id, payload)
      } else {
        await recipientService.create(user.uid, payload)
      }
      onOpenChange(false)
      onSuccess()
    } catch (err) {
      console.error("Save recipient error:", err)
      setError("Failed to save recipient. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto bg-card p-6 sm:p-8 rounded-3xl border border-border/80 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary text-xs font-mono">
            <Heart className="size-3.5" />
            <span className="uppercase tracking-widest font-sans font-semibold">
              {recipientToEdit ? "Edit Dossier" : "New Recipient Dossier"}
            </span>
          </div>
          <DialogTitle className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
            {recipientToEdit ? `Update ${recipientToEdit.name}` : "Create Recipient Profile"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            The more nuanced your dossier, the more accurate and heartwarming our AI gift recommendations will be.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 pt-2">
          {/* Section 1: Basic Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-foreground/90">
                Full or Preferred Name *
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tara, Kabir, Mom"
                required
                className="h-10 bg-background/60"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-foreground/90">
                Relationship
              </Label>
              <Select
                value={relationship}
                onValueChange={(val) => {
                  if (val) setRelationship(val)
                }}
              >
                <SelectTrigger className="h-10 w-full rounded-xl border border-input bg-background/60 px-3 text-xs text-foreground">
                  <SelectValue>{relationship}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {relationshipOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Section 2: Interests & Passions */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-medium text-foreground/90 flex items-center justify-between">
              <span>Passions & Interests</span>
              <span className="text-[11px] text-muted-foreground font-normal">
                Press Enter to add chip
              </span>
            </Label>
            <div className="flex gap-2">
              <Input
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addChip(interestInput, setInterestInput, interests, setInterests)
                  }
                }}
                placeholder="e.g. Analog photography, Japanese ceramics, Matcha"
                className="h-9 bg-background/60 text-xs"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => addChip(interestInput, setInterestInput, interests, setInterests)}
                className="text-xs h-9 px-3"
              >
                Add
              </Button>
            </div>
            {interests.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {interests.map((item) => (
                  <Badge
                    key={item}
                    variant="secondary"
                    className="gap-1 px-2.5 py-1 text-xs border border-border/60"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => removeChip(item, interests, setInterests)}
                      className="hover:text-destructive"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Personality Traits */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-medium text-foreground/90">
              Personality Traits
            </Label>
            <div className="flex flex-wrap gap-1.5 mb-1.5">
              {suggestedTraits.map((trait) => {
                const isSelected = personalityTraits.includes(trait)
                return (
                  <button
                    key={trait}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        removeChip(trait, personalityTraits, setPersonalityTraits)
                      } else {
                        setPersonalityTraits([...personalityTraits, trait])
                      }
                    }}
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium border transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary/40 text-muted-foreground border-border/60 hover:text-foreground"
                    }`}
                  >
                    {trait}
                  </button>
                )
              })}
            </div>
            <div className="flex gap-2">
              <Input
                value={traitInput}
                onChange={(e) => setTraitInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addChip(traitInput, setTraitInput, personalityTraits, setPersonalityTraits)
                  }
                }}
                placeholder="Or type custom trait (e.g. Philanthropic, Tech-Savvy)"
                className="h-9 bg-background/60 text-xs"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => addChip(traitInput, setTraitInput, personalityTraits, setPersonalityTraits)}
                className="text-xs h-9 px-3"
              >
                Add
              </Button>
            </div>
          </div>

          <Separator />

          {/* Section 4: Loves vs Dislikes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Favorites */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium text-foreground/90">
                Things They Adore / Specific Brands
              </Label>
              <div className="flex gap-1.5">
                <Input
                  value={favInput}
                  onChange={(e) => setFavInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addChip(favInput, setFavInput, favoriteThings, setFavoriteThings)
                    }
                  }}
                  placeholder="e.g. Moleskine, Aesop, Dark roast"
                  className="h-9 bg-background/60 text-xs"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => addChip(favInput, setFavInput, favoriteThings, setFavoriteThings)}
                  className="text-xs h-9 px-2.5"
                >
                  Add
                </Button>
              </div>
              {favoriteThings.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {favoriteThings.map((item) => (
                    <Badge key={item} variant="outline" className="gap-1 px-2 py-0.5 text-[11px] border-accent/80">
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => removeChip(item, favoriteThings, setFavoriteThings)}
                        className="hover:text-destructive"
                      >
                        <X className="size-2.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Dislikes */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium text-foreground/90">
                Things They Dislike (Strictly Avoid)
              </Label>
              <div className="flex gap-1.5">
                <Input
                  value={dislikeInput}
                  onChange={(e) => setDislikeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addChip(dislikeInput, setDislikeInput, dislikes, setDislikes)
                    }
                  }}
                  placeholder="e.g. Plastic items, Novelty mugs, Wool"
                  className="h-9 bg-background/60 text-xs"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => addChip(dislikeInput, setDislikeInput, dislikes, setDislikes)}
                  className="text-xs h-9 px-2.5"
                >
                  Add
                </Button>
              </div>
              {dislikes.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {dislikes.map((item) => (
                    <Badge key={item} variant="destructive" className="gap-1 px-2 py-0.5 text-[11px] bg-destructive/15 text-destructive border-0">
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => removeChip(item, dislikes, setDislikes)}
                        className="hover:text-foreground"
                      >
                        <X className="size-2.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Section 5: Important Dates */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-medium text-foreground/90 flex items-center gap-1.5">
              <Calendar className="size-3.5 text-primary" />
              <span>Important Dates & Milestones</span>
            </Label>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <Input
                value={dateTitle}
                onChange={(e) => setDateTitle(e.target.value)}
                placeholder="Occasion (e.g. Birthday)"
                className="h-9 bg-background/60 text-xs sm:col-span-2"
              />
              <DatePicker
                value={dateValue}
                onChange={setDateValue}
                placeholder="Select date"
                className="h-9 bg-background/60 text-xs"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addDate}
                className="h-9 text-xs gap-1"
              >
                <Plus className="size-3" />
                Add Date
              </Button>
            </div>

            {importantDates.length > 0 && (
              <div className="flex flex-col gap-1.5 pt-2">
                {importantDates.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between rounded-xl bg-secondary/30 px-3 py-2 border border-border/50 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="size-3 text-primary" />
                      <span className="font-semibold text-foreground">{d.title}</span>
                      <span className="text-muted-foreground font-mono">({d.date})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDate(d.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Section 6: Sizing & Personal Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-foreground/90">
                Sizing & Color Preferences
              </Label>
              <Input
                value={sizing}
                onChange={(e) => setSizing(e.target.value)}
                placeholder="e.g. Medium, Size 8 UK, Warm earth tones"
                className="h-9 bg-background/60 text-xs"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-foreground/90">
                Aesthetic & Living Context
              </Label>
              <Input
                value={preferredVibe}
                onChange={(e) => setPreferredVibe(e.target.value)}
                placeholder="e.g. Compact studio apartment, Minimalist"
                className="h-9 bg-background/60 text-xs"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-foreground/90">
              Personal Notes & Inside Stories
            </Label>
            <Textarea
              rows={3}
              value={personalNotes}
              onChange={(e) => setPersonalNotes(e.target.value)}
              placeholder="Any details you want the AI concierge to keep in mind (e.g. Dreams of visiting Iceland, allergic to lavender, sentimental about handmade gifts)"
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
                  Saving Dossier...
                </>
              ) : (
                <>
                  <Sparkles className="size-3.5" />
                  {recipientToEdit ? "Update Dossier" : "Save Recipient Dossier"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
