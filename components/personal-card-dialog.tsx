"use client"

import * as React from "react"
import {
  Feather,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Loader2,
  Heart,
  Smile,
  Send,
  SlidersHorizontal,
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
import { Badge } from "@/components/ui/badge"
import { Recipient } from "@/lib/types/recipient"
import { MessageOccasion, MessageTone } from "@/app/api/personalize-message/route"

const occasions: MessageOccasion[] = [
  "Birthday",
  "Anniversary",
  "Friendship",
  "Congratulations",
  "Thank-you",
  "Custom",
]

const tones: { label: string; tone: MessageTone; desc: string }[] = [
  { label: "Heartfelt", tone: "Heartfelt", desc: "Warm & sincere" },
  { label: "Funny", tone: "Funny", desc: "Witty & playful" },
  { label: "Romantic", tone: "Romantic", desc: "Intimate & devoted" },
  { label: "Casual", tone: "Casual", desc: "Breezy & natural" },
  { label: "Emotional", tone: "Emotional", desc: "Deeply moving" },
  { label: "Short", tone: "Short", desc: "Brief & poignant" },
  { label: "Poetic", tone: "Poetic", desc: "Lyrical & timeless" },
  { label: "Professional", tone: "Professional", desc: "Gracious & polished" },
]

interface PersonalCardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialRecipientName?: string
  initialOccasion?: string
  recipients?: Recipient[]
  giftItemName?: string
}

export function PersonalCardDialog({
  open,
  onOpenChange,
  initialRecipientName,
  initialOccasion,
  recipients = [],
  giftItemName,
}: PersonalCardDialogProps) {
  const [recipientName, setRecipientName] = React.useState("")
  const [selectedRecipientId, setSelectedRecipientId] = React.useState("")
  const [selectedOccasion, setSelectedOccasion] = React.useState<MessageOccasion | string>("Birthday")
  const [customOccasion, setCustomOccasion] = React.useState("")
  const [selectedTone, setSelectedTone] = React.useState<MessageTone>("Heartfelt")
  const [customDetails, setCustomDetails] = React.useState("")
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  // Generated message state
  const [result, setResult] = React.useState<{
    salutation: string
    message: string
    signOff: string
    calligraphyTag: string
  } | null>(null)

  React.useEffect(() => {
    if (initialRecipientName) {
      setRecipientName(initialRecipientName)
      const found = recipients.find(
        (r) => r.name.toLowerCase() === initialRecipientName.toLowerCase()
      )
      if (found) setSelectedRecipientId(found.id || "")
    } else if (recipients.length > 0) {
      setRecipientName(recipients[0].name)
      setSelectedRecipientId(recipients[0].id || "")
    }

    if (initialOccasion) {
      if (occasions.includes(initialOccasion as MessageOccasion)) {
        setSelectedOccasion(initialOccasion as MessageOccasion)
      } else {
        setSelectedOccasion("Custom")
        setCustomOccasion(initialOccasion)
      }
    }
  }, [initialRecipientName, initialOccasion, recipients, open])

  const handleGenerate = async (overrideTone?: MessageTone) => {
    const toneToUse = overrideTone || selectedTone
    if (!recipientName.trim()) return

    setIsGenerating(true)
    try {
      const occasionToUse =
        selectedOccasion === "Custom" ? customOccasion || "Special Celebration" : selectedOccasion

      const foundRecipient = recipients.find((r) => r.id === selectedRecipientId)

      const res = await fetch("/api/personalize-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientName: recipientName.trim(),
          relationship: foundRecipient?.relationship,
          occasion: occasionToUse,
          tone: toneToUse,
          customDetails: customDetails.trim() || undefined,
          recipientTraits: foundRecipient?.personalityTraits,
          giftItemName,
        }),
      })

      const data = await res.json()
      if (data.message) {
        setResult(data)
      }
    } catch (err) {
      console.error("Message generation error:", err)
    } finally {
      setIsGenerating(false)
    }
  }

  // Auto-generate initial note when opened
  React.useEffect(() => {
    if (open && recipientName && !result) {
      handleGenerate()
    }
  }, [open, recipientName])

  const handleCopy = () => {
    if (!result) return
    const fullText = `${result.salutation}\n\n${result.message}\n\n${result.signOff}`
    navigator.clipboard.writeText(fullText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleToneChange = (tone: MessageTone) => {
    setSelectedTone(tone)
    handleGenerate(tone)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card p-6 sm:p-8 rounded-3xl border border-border/80 shadow-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
            <Feather className="size-4" />
            <span>Epistolary Atelier</span>
          </div>
          <DialogTitle className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
            Bespoke Envelope Message
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            AI-crafted personal sentiments tailored to your bond, occasion, and signature tone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 mt-2">
          {/* Controls row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Recipient */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">For Recipient</label>
              <Input
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Recipient Name"
                className="h-9 text-xs bg-background/70 rounded-xl"
              />
            </div>

            {/* Occasion */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Occasion</label>
              <select
                value={selectedOccasion}
                onChange={(e) => setSelectedOccasion(e.target.value as MessageOccasion)}
                className="h-9 rounded-xl border border-input bg-background/70 px-3 text-xs text-foreground outline-none cursor-pointer"
              >
                {occasions.map((occ) => (
                  <option key={occ} value={occ}>
                    {occ}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom details / memory */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">
                Nuance / Inside Joke (Optional)
              </label>
              <Input
                value={customDetails}
                onChange={(e) => setCustomDetails(e.target.value)}
                placeholder="e.g. Remember Paris 2022"
                className="h-9 text-xs bg-background/70 rounded-xl"
              />
            </div>
          </div>

          {selectedOccasion === "Custom" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Custom Occasion Name</label>
              <Input
                value={customOccasion}
                onChange={(e) => setCustomOccasion(e.target.value)}
                placeholder="e.g. Master's Thesis Defense, Marathon Finish"
                className="h-9 text-xs bg-background/70 rounded-xl"
              />
            </div>
          )}

          {/* Tone Selector Pills */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <SlidersHorizontal className="size-3.5 text-primary" />
              <span>Select Tone of Voice:</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {tones.map((t) => (
                <button
                  key={t.tone}
                  onClick={() => handleToneChange(t.tone)}
                  disabled={isGenerating}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                    selectedTone === t.tone
                      ? "bg-primary text-primary-foreground border-primary font-semibold shadow-2xs"
                      : "bg-secondary/40 hover:bg-secondary border-border/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* The Calligraphy Card Preview */}
          <div className="relative rounded-3xl border border-warm-sand/80 bg-linear-to-br from-[#FFFBE9] via-[#FFFDF5] to-[#F7F2DE] dark:from-[#26201b] dark:via-[#1c1815] dark:to-[#171310] p-6 sm:p-8 shadow-inner overflow-hidden">
            {/* Elegant Calligraphic Header Ribbon */}
            <div className="flex items-center justify-between border-b border-warm-sand/40 pb-3 mb-4 text-xs">
              <div className="flex items-center gap-2">
                <Feather className="size-3.5 text-primary" />
                <span className="font-serif font-bold text-foreground tracking-wide">
                  Envelope Stationery
                </span>
                {result?.calligraphyTag && (
                  <Badge variant="outline" className="text-[10px] uppercase border-warm-sand">
                    {result.calligraphyTag}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  disabled={!result || isGenerating}
                  className="inline-flex items-center gap-1 text-xs text-primary hover:text-foreground font-medium transition-colors cursor-pointer"
                >
                  {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  <span>{copied ? "Copied!" : "Copy Note"}</span>
                </button>
              </div>
            </div>

            {isGenerating ? (
              <div className="flex min-h-[160px] flex-col items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="size-5 animate-spin text-primary" />
                <span className="text-xs italic font-serif">Inscribing thoughtful lines...</span>
              </div>
            ) : result ? (
              <div className="flex flex-col gap-3 font-serif leading-relaxed text-foreground">
                <p className="text-sm sm:text-base font-semibold text-foreground/90">
                  {result.salutation}
                </p>
                <p className="text-sm sm:text-base italic text-foreground/85 leading-relaxed whitespace-pre-wrap">
                  {result.message}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-foreground/80 mt-2">
                  {result.signOff}
                </p>
              </div>
            ) : (
              <div className="min-h-[140px] flex items-center justify-center text-xs text-muted-foreground italic">
                Click regenerate to compose your card note.
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4 flex items-center justify-between gap-2 border-t border-border/60 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleGenerate()}
            disabled={isGenerating}
            className="text-xs gap-1.5 rounded-xl cursor-pointer"
          >
            <RefreshCw className={`size-3.5 ${isGenerating ? "animate-spin" : ""}`} />
            <span>Regenerate Note</span>
          </Button>

          <Button
            onClick={handleCopy}
            disabled={!result}
            className="text-xs gap-1.5 rounded-xl cursor-pointer shadow-xs"
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            <span>{copied ? "Copied to Clipboard" : "Copy Message"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
