"use client"

import * as React from "react"
import {
  Sparkles,
  ExternalLink,
  Bookmark,
  ThumbsUp,
  AlertCircle,
  Copy,
  Check,
  Feather,
  Wallet,
  HeartHandshake,
  Layers,
  ChevronDown,
  ChevronUp,
  Award,
  Gem,
  PiggyBank,
  Compass,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GiftRecommendation, RecommendationType } from "@/lib/types/recommendation"

interface RecommendationCardProps {
  recommendation: GiftRecommendation
  recipientName: string
  onSaveToPlan?: (rec: GiftRecommendation) => void
  onSaveToVault?: (rec: GiftRecommendation) => void
  onSelectAlternative?: (altName: string, altPrice: number) => void
}

export function RecommendationCard({
  recommendation,
  recipientName,
  onSaveToPlan,
  onSaveToVault,
  onSelectAlternative,
}: RecommendationCardProps) {
  const [copied, setCopied] = React.useState(false)
  const [isSaved, setIsSaved] = React.useState(false)
  const [isVaultSaved, setIsVaultSaved] = React.useState(false)
  const [showAlternatives, setShowAlternatives] = React.useState(false)

  const handleCopyNote = () => {
    if (!recommendation.handwrittenNote) return
    navigator.clipboard.writeText(recommendation.handwrittenNote)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const buyUrl = `https://www.google.com/search?q=${encodeURIComponent(
    recommendation.searchQuery || recommendation.name
  )}`

  const renderTypeBadge = (type?: RecommendationType) => {
    switch (type) {
      case "Best Match":
        return (
          <Badge className="bg-warm-mocha text-warm-ivory border-0 text-[10px] uppercase font-bold tracking-wider gap-1 shadow-xs">
            <Award className="size-3" />
            <span>Best Match</span>
          </Badge>
        )
      case "Unique":
        return (
          <Badge className="bg-accent/80 text-foreground border border-border text-[10px] uppercase font-bold tracking-wider gap-1">
            <Compass className="size-3 text-primary" />
            <span>Unique</span>
          </Badge>
        )
      case "Budget Friendly":
        return (
          <Badge className="bg-secondary text-secondary-foreground border border-border text-[10px] uppercase font-bold tracking-wider gap-1">
            <PiggyBank className="size-3 text-primary" />
            <span>Budget Friendly</span>
          </Badge>
        )
      case "Premium":
        return (
          <Badge className="bg-primary text-primary-foreground border-0 text-[10px] uppercase font-bold tracking-wider gap-1 shadow-xs">
            <Gem className="size-3" />
            <span>Premium Tier</span>
          </Badge>
        )
      case "Personalized":
        return (
          <Badge className="bg-warm-sand text-warm-ivory border-0 text-[10px] uppercase font-bold tracking-wider gap-1 shadow-xs">
            <Feather className="size-3" />
            <span>Personalized</span>
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
            {type || "Curated"}
          </Badge>
        )
    }
  }

  const score = recommendation.matchScore ?? recommendation.compatibilityScore ?? 95
  const reason = recommendation.whyRecommended || recommendation.whyItFits

  return (
    <Card className="group relative overflow-hidden rounded-3xl border border-border/80 bg-card/85 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      {/* Top Gradient Banner */}
      <div className="h-1.5 w-full bg-linear-to-r from-warm-mocha via-warm-sand to-warm-parchment opacity-85 group-hover:opacity-100 transition-opacity" />

      <CardHeader className="p-6 pb-3">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {renderTypeBadge(recommendation.recommendationType)}
            <Badge
              variant="outline"
              className="border-border/80 bg-secondary/30 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold"
            >
              {recommendation.category}
            </Badge>
          </div>

          <Badge variant="secondary" className="font-mono font-bold text-xs">
            <Sparkles className="size-3 mr-1 text-primary inline" />
            {score}% Match
          </Badge>
        </div>

        {/* Title and Tagline */}
        <div className="mt-3">
          {recommendation.tagline && (
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">
              {recommendation.tagline}
            </span>
          )}
          <CardTitle className="font-serif text-2xl font-bold text-foreground mt-1 leading-snug">
            {recommendation.name}
          </CardTitle>
        </div>

        {/* Price */}
        <div className="mt-2 flex items-center justify-between text-sm">
          <div className="font-serif text-2xl font-bold text-foreground flex items-center gap-1">
            <span>{recommendation.currency}</span>
            <span>{recommendation.estimatedPrice.toLocaleString()}</span>
          </div>
          <span className="text-xs text-muted-foreground">Estimated Market Value</span>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-0 flex flex-col gap-4">
        {recommendation.description && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            {recommendation.description}
          </p>
        )}

        {/* Why it was recommended */}
        {reason && (
          <div className="rounded-2xl border border-border/60 bg-secondary/30 p-3.5 text-xs text-muted-foreground leading-relaxed">
            <span className="font-serif font-bold text-foreground block text-sm mb-1">
              Why this was recommended for {recipientName}:
            </span>
            {reason}
          </div>
        )}

        {/* Compatibility Matrix: Budget & Recipient */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {recommendation.budgetCompatibility && (
            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-secondary/20 border border-border/50">
              <Wallet className="size-3.5 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-foreground text-[11px] block">
                  Budget Compatibility
                </span>
                <span className="text-[11px] text-muted-foreground leading-tight">
                  {recommendation.budgetCompatibility}
                </span>
              </div>
            </div>
          )}

          {recommendation.recipientCompatibility && (
            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-secondary/20 border border-border/50">
              <HeartHandshake className="size-3.5 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-foreground text-[11px] block">
                  Recipient Resonance
                </span>
                <span className="text-[11px] text-muted-foreground leading-tight">
                  {recommendation.recipientCompatibility}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Highlights & Considerations */}
        {((recommendation.pros && recommendation.pros.length > 0) ||
          (recommendation.cons && recommendation.cons.length > 0)) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            {recommendation.pros && recommendation.pros.length > 0 && (
              <div className="flex flex-col gap-1 p-2.5 rounded-xl bg-secondary/20 border border-border/40">
                <span className="font-semibold text-foreground flex items-center gap-1">
                  <ThumbsUp className="size-3 text-primary" />
                  <span>Key Highlights</span>
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
        )}

        {/* Alternative Suggestions Accordion / Drawer */}
        {recommendation.alternativeSuggestions &&
          recommendation.alternativeSuggestions.length > 0 && (
            <div className="rounded-2xl border border-border/60 bg-secondary/20 p-3">
              <button
                type="button"
                onClick={() => setShowAlternatives(!showAlternatives)}
                className="w-full flex items-center justify-between text-[11px] font-semibold text-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Layers className="size-3.5 text-primary" />
                  <span>
                    Alternative Variations ({recommendation.alternativeSuggestions.length})
                  </span>
                </span>
                {showAlternatives ? (
                  <ChevronUp className="size-3.5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                )}
              </button>

              {showAlternatives && (
                <div className="mt-2.5 flex flex-col gap-2 pt-2 border-t border-border/40">
                  {recommendation.alternativeSuggestions.map((alt, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-card border border-border/50 text-[11px] flex items-start justify-between gap-2"
                    >
                      <div>
                        <span className="font-medium text-foreground block">{alt.name}</span>
                        <span className="text-muted-foreground text-[10px]">
                          {alt.differenceReason}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-foreground text-xs">
                          {recommendation.currency}
                          {alt.estimatedPrice.toLocaleString()}
                        </span>
                        {onSelectAlternative && (
                          <button
                            type="button"
                            onClick={() => onSelectAlternative(alt.name, alt.estimatedPrice)}
                            className="block text-[10px] text-primary hover:underline font-medium mt-0.5"
                          >
                            Switch to this
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        {/* Envelope Note Preview */}
        {recommendation.handwrittenNote && (
          <div className="rounded-2xl border border-border/60 bg-card/60 p-3.5 relative">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-primary font-semibold mb-1">
              <span className="flex items-center gap-1">
                <Feather className="size-3" />
                <span>
                  Envelope Note {recommendation.sentimentTone && `(${recommendation.sentimentTone})`}
                </span>
              </span>
              <button
                onClick={handleCopyNote}
                className="hover:text-foreground flex items-center gap-1 text-[10px] cursor-pointer"
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

        <div className="flex items-center gap-1.5">
          {onSaveToVault && (
            <Button
              variant={isVaultSaved ? "secondary" : "ghost"}
              size="sm"
              onClick={() => {
                onSaveToVault(recommendation)
                setIsVaultSaved(true)
              }}
              title="Save to permanent vault"
              className="text-xs gap-1 rounded-xl cursor-pointer"
            >
              <Bookmark className={`size-3.5 ${isVaultSaved ? "fill-primary text-primary" : ""}`} />
              <span className="hidden sm:inline">{isVaultSaved ? "Saved" : "Save"}</span>
            </Button>
          )}

          {onSaveToPlan && (
            <Button
              variant={isSaved ? "secondary" : "outline"}
              size="sm"
              onClick={() => {
                onSaveToPlan(recommendation)
                setIsSaved(true)
              }}
              className="text-xs gap-1 rounded-xl cursor-pointer"
            >
              <Sparkles className={`size-3.5 ${isSaved ? "text-primary" : ""}`} />
              <span>{isSaved ? "Shortlisted" : "Shortlist to Plan"}</span>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

