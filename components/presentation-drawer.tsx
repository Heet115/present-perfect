"use client"

import * as React from "react"
import {
  Sparkles,
  Package,
  Gift,
  Feather,
  RefreshCw,
  Loader2,
  Lightbulb,
  Check,
  Compass,
  Coins,
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
import { Badge } from "@/components/ui/badge"
import { GiftBundle, PresentationIdea } from "@/lib/types/bundle"

interface PresentationDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bundle: GiftBundle | null
  onSavePresentation?: (presentation: PresentationIdea) => Promise<void>
}

export function PresentationDrawer({
  open,
  onOpenChange,
  bundle,
  onSavePresentation,
}: PresentationDrawerProps) {
  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState<PresentationIdea & { budgetOptimizationAdvice?: string } | null>(null)

  const fetchPresentation = React.useCallback(async (force = false) => {
    if (!bundle) return
    if (bundle.presentation && !force) {
      setData(bundle.presentation)
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/presentation-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bundleTitle: bundle.title,
          recipientName: bundle.recipientName,
          items: bundle.items.map((i) => ({ title: i.title, price: i.price })),
          targetBudget: bundle.targetBudget,
          currency: bundle.currency || "₹",
        }),
      })

      const json = await res.json()
      if (json.wrappingSuggestion) {
        setData(json)
        if (onSavePresentation) {
          onSavePresentation(json)
        }
      }
    } catch (err) {
      console.error("Presentation styling error:", err)
    } finally {
      setLoading(false)
    }
  }, [bundle, onSavePresentation])

  React.useEffect(() => {
    if (open && bundle) {
      fetchPresentation()
    }
  }, [open, bundle, fetchPresentation])

  if (!bundle) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card p-6 sm:p-8 rounded-3xl border border-border/80 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
            <Package className="size-4" />
            <span>Atelier Presentation & Unboxing</span>
          </div>
          <DialogTitle className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
            {bundle.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Bespoke tactile packaging, staging rituals, and surprise choreography curated for {bundle.recipientName}.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="size-8 animate-spin text-primary" />
            <span className="text-xs font-serif italic">Composing artisanal presentation rituals...</span>
          </div>
        ) : data ? (
          <div className="flex flex-col gap-5 mt-2 text-xs">
            {/* Budget Optimization Callout */}
            {data.budgetOptimizationAdvice && (
              <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60 flex items-start gap-3">
                <Coins className="size-4 text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-foreground text-xs">
                    Budget Optimization Advice
                  </span>
                  <p className="text-muted-foreground leading-relaxed text-xs">
                    {data.budgetOptimizationAdvice}
                  </p>
                </div>
              </div>
            )}

            {/* Wrapping Suggestions */}
            <div className="p-5 rounded-3xl border border-border/60 bg-linear-to-br from-card via-secondary/20 to-card flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-serif font-bold text-foreground">
                <Package className="size-4 text-primary" />
                <span>Tactile Luxury Wrapping Concept</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {data.wrappingSuggestion}
              </p>

              {data.wrappingMaterials && data.wrappingMaterials.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {data.wrappingMaterials.map((mat, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="border-accent/80 bg-background/80 text-[10px] text-foreground font-medium"
                    >
                      {mat}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Presentation Ritual */}
            <div className="p-5 rounded-3xl border border-border/60 bg-card flex flex-col gap-2 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-serif font-bold text-foreground">
                <Compass className="size-4 text-primary" />
                <span>The Unboxing Ritual & Presentation Ceremony</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {data.presentationRitual}
              </p>
            </div>

            {/* Surprise Idea */}
            <div className="p-5 rounded-3xl border border-border/60 bg-card flex flex-col gap-2 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-serif font-bold text-foreground">
                <Lightbulb className="size-4 text-primary" />
                <span>The Unexpected Surprise Element</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {data.surpriseIdea}
              </p>
            </div>

            {/* Card & Envelope Styling */}
            <div className="p-5 rounded-3xl border border-border/60 bg-card flex flex-col gap-2 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-serif font-bold text-foreground">
                <Feather className="size-4 text-primary" />
                <span>Card & Envelope Embellishment</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {data.cardEnvelopeIdea}
              </p>
            </div>
          </div>
        ) : null}

        <DialogFooter className="mt-3 flex items-center justify-between gap-2 border-t border-border/60 pt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchPresentation(true)}
            disabled={loading}
            className="text-xs gap-1.5 rounded-xl cursor-pointer"
          >
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Regenerate Presentation Ideas</span>
          </Button>

          <Button
            onClick={() => onOpenChange(false)}
            className="text-xs rounded-xl cursor-pointer"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
