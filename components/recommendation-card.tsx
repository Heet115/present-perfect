"use client"

import * as React from "react"
import {
  Sparkles,
  Gift,
  Coins,
  Check,
  Feather,
  ExternalLink,
  Bookmark,
  ThumbsUp,
  AlertCircle,
  Copy,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GiftRecommendation } from "@/lib/types/recommendation"

interface RecommendationCardProps {
  recommendation: GiftRecommendation
  recipientName: string
  onSaveToPlan?: (rec: GiftRecommendation) => void
}

export function RecommendationCard({
  recommendation,
  recipientName,
  onSaveToPlan,
}: RecommendationCardProps) {
  const [copied, setCopied] = React.useState(false)
  const [isSaved, setIsSaved] = React.useState(false)

  const handleCopyNote = () => {
    navigator.clipboard.writeText(recommendation.handwrittenNote)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const buyUrl = `https://www.google.com/search?q=${encodeURIComponent(recommendation.searchQuery)}`

  return (
    <Card className="group relative overflow-hidden rounded-3xl border border-border/80 bg-card/85 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      {/* Decorative Warm Accent Header */}
      <div className="h-1.5 w-full bg-linear-to-r from-warm-mocha via-warm-sand to-warm-parchment opacity-80 group-hover:opacity-100 transition-opacity" />

      <CardHeader className="p-6 pb-3">
        <div className="flex items-start justify-between gap-3">
          <Badge
            variant="outline"
            className="border-accent/80 bg-secondary/40 text-[10px] uppercase tracking-widest text-primary font-semibold"
          >
            {recommendation.category}
          </Badge>

          <div className="flex items-center gap-1.5">
            <Badge variant="secondary" className="font-mono font-bold text-xs">
              <Sparkles className="size-3 mr-1 text-primary inline" />
              {recommendation.compatibilityScore}% Affinity
            </Badge>
          </div>
        </div>

        <div className="mt-3">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">
            {recommendation.tagline}
          </span>
          <CardTitle className="font-serif text-2xl font-bold text-foreground mt-1 leading-snug">
            {recommendation.name}
          </CardTitle>
        </div>

        <div className="mt-2 flex items-center justify-between text-sm">
          <div className="font-serif text-xl font-bold text-foreground flex items-center gap-1">
            <span>{recommendation.currency}</span>
            <span>{recommendation.estimatedPrice.toLocaleString()}</span>
          </div>
          <span className="text-xs text-muted-foreground">Estimated</span>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-0 flex flex-col gap-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          {recommendation.description}
        </p>

        {/* Why it fits rationale */}
        <div className="rounded-2xl border border-border/60 bg-secondary/30 p-3.5 text-xs text-muted-foreground leading-relaxed">
          <span className="font-serif font-bold text-foreground block text-sm mb-1">
            Why this resonates for {recipientName}:
          </span>
          {recommendation.whyItFits}
        </div>

        {/* Pros & Cons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          {recommendation.pros && recommendation.pros.length > 0 && (
            <div className="flex flex-col gap-1 p-2.5 rounded-xl bg-secondary/20 border border-border/40">
              <span className="font-semibold text-foreground flex items-center gap-1">
                <ThumbsUp className="size-3 text-primary" />
                <span>Highlights</span>
              </span>
              <ul className="flex flex-col gap-0.5 text-muted-foreground">
                {recommendation.pros.map((pro, idx) => (
                  <li key={idx} className="flex items-center gap-1">
                    <span className="size-1 rounded-full bg-primary shrink-0" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recommendation.cons && recommendation.cons.length > 0 && (
            <div className="flex flex-col gap-1 p-2.5 rounded-xl bg-secondary/20 border border-border/40">
              <span className="font-semibold text-foreground flex items-center gap-1">
                <AlertCircle className="size-3 text-muted-foreground" />
                <span>Considerations</span>
              </span>
              <ul className="flex flex-col gap-0.5 text-muted-foreground">
                {recommendation.cons.map((con, idx) => (
                  <li key={idx} className="flex items-center gap-1">
                    <span className="size-1 rounded-full bg-muted-foreground shrink-0" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Handwritten Note Callout */}
        {recommendation.handwrittenNote && (
          <div className="rounded-2xl border border-border/60 bg-card/60 p-3.5 relative">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-primary font-semibold mb-1">
              <span className="flex items-center gap-1">
                <Feather className="size-3" />
                <span>Suggested Envelope Note ({recommendation.sentimentTone})</span>
              </span>
              <button
                onClick={handleCopyNote}
                className="hover:text-foreground flex items-center gap-1 text-[10px]"
              >
                {copied ? <Check className="size-3 text-primary" /> : <Copy className="size-3" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <p className="font-serif italic text-xs text-foreground/90 leading-relaxed">
              &ldquo;{recommendation.handwrittenNote}&rdquo;
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-2 border-t border-border/60 flex items-center justify-between gap-2">
        <a
          href={buyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
        >
          <span>Explore Sources</span>
          <ExternalLink className="size-3" />
        </a>

        <div className="flex items-center gap-2">
          {onSaveToPlan && (
            <Button
              variant={isSaved ? "secondary" : "outline"}
              size="sm"
              onClick={() => {
                onSaveToPlan(recommendation)
                setIsSaved(true)
              }}
              className="text-xs gap-1 rounded-xl"
            >
              <Bookmark className={`size-3.5 ${isSaved ? "fill-primary text-primary" : ""}`} />
              <span>{isSaved ? "Shortlisted" : "Shortlist"}</span>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
