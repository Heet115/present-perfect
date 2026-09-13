"use client"

import * as React from "react"
import Link from "next/link"
import {
  Sparkles,
  Heart,
  Tag,
  CheckCircle2,
  SlidersHorizontal,
  Bookmark,
  ArrowRight,
  Gift,
  Feather,
  ShieldCheck,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const scenarios = [
  {
    id: "friend",
    tabLabel: "The Coffee Ritualist",
    recipient: "Kabir",
    relationship: "Best Friend · 6 Years",
    occasion: "21st Birthday Milestone",
    budget: "₹3,000",
    tags: ["Analog Photography", "Specialty Pour-Over", "Solo Backpacking"],
    matchScore: "98%",
    matchBadge: "Harmonic Match",
    giftName: "Hand-Turned Brass Pour-Over Dripper & Single-Estate Ethiopian Yirgacheffe",
    estimatedPrice: "₹2,850",
    whyRecommended:
      "Taps into his sacred ritual of slow Sunday mornings. The solid brass develops an organic patina unique to his touch over decades.",
    handwrittenNote:
      "To the one who taught me that great coffee takes quiet patience, and rare friendships take even more. Happy 21st, brother.",
    radar: { aesthetic: 98, sentiment: 94, utility: 90 },
    alternative: "Raw Horween Leather Camera Strap with Hand-Stamped Monogram",
  },
  {
    id: "partner",
    tabLabel: "The Vinyl Collector",
    recipient: "Tara",
    relationship: "Partner · Soulmate",
    occasion: "3rd Anniversary (Leather/Keepsake)",
    budget: "₹5,500",
    tags: ["Rare Vinyl Editions", "Botanical Perfumery", "Japanese Joinery"],
    matchScore: "99%",
    matchBadge: "Soulmate Pick",
    giftName: "Artisanal Tuscan Leather LP Carrier with Engraved Anniversary Coordinates",
    estimatedPrice: "₹5,200",
    whyRecommended:
      "Honors the heritage 3rd-anniversary tradition while elevating her weekend vinyl crate-digging excursions in Old Town.",
    handwrittenNote:
      "Three years of soundtracking our lives to the crackle of old records. There is no one else I would rather spin this world with.",
    radar: { aesthetic: 99, sentiment: 98, utility: 88 },
    alternative: "Hand-Poured Sandalwood & Wild Fig Botanical Room Scent",
  },
  {
    id: "mom",
    tabLabel: "The Garden Hermit",
    recipient: "Anjali",
    relationship: "Mother",
    occasion: "Golden 50th Jubilee",
    budget: "₹7,000",
    tags: ["Terracotta Horticulture", "First-Flush Teas", "Sufi Poetry"],
    matchScore: "97%",
    matchBadge: "Heirloom Keepsake",
    giftName: "Celadon Glazed Ceramic Teapot with Brass Handle & Silver Needle Reserve",
    estimatedPrice: "₹6,400",
    whyRecommended:
      "Anchors her peaceful veranda sunrise tea sessions. Comes nested in a velvet-lined raw cedar wood presentation chest.",
    handwrittenNote:
      "For the hands that grew our entire world with endless grace. May every cup bring you the quiet peace you have always given to us.",
    radar: { aesthetic: 96, sentiment: 99, utility: 92 },
    alternative: "Custom Hand-Bound Cloth Anthology of Ghalib & Tagore Verses",
  },
]

export function HeroCurationPreview() {
  const [activeScenario, setActiveScenario] = React.useState(scenarios[0])
  const [viewMode, setViewMode] = React.useState<"gift" | "card">("gift")
  const [isSaved, setIsSaved] = React.useState(false)

  return (
    <div className="flex flex-col gap-5">
      {/* Aesthetic Segmented Switcher */}
      <div className="flex items-center justify-center gap-1.5 overflow-x-auto p-1.5 bg-secondary/40 rounded-full border border-border/60 max-w-xl mx-auto backdrop-blur-md shadow-xs">
        {scenarios.map((sc) => {
          const isSelected = activeScenario.id === sc.id
          return (
            <button
              key={sc.id}
              onClick={() => {
                setActiveScenario(sc)
                setIsSaved(false)
              }}
              className={`rounded-full px-4 py-1.5 text-xs tracking-wide transition-all duration-200 ${
                isSelected
                  ? "bg-card text-foreground font-semibold shadow-xs ring-1 ring-border/80 scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {sc.tabLabel}
            </button>
          )
        })}
      </div>

      {/* Main Luxury Paper / Keepsake Card */}
      <Card className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/90 shadow-xl backdrop-blur-xl transition-all duration-300">
        {/* Subtle Decorative Gradient Accent Ribbon */}
        <div className="h-1.5 w-full bg-linear-to-r from-warm-mocha via-warm-sand to-warm-parchment" />

        <CardHeader className="p-6 pb-4 sm:p-8 sm:pb-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Monogram Seal */}
              <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary/80 text-primary font-serif font-bold text-lg ring-1 ring-border/60 shadow-xs">
                {activeScenario.recipient[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="font-serif text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    Curation for {activeScenario.recipient}
                  </CardTitle>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activeScenario.relationship} • {activeScenario.occasion}
                </p>
              </div>
            </div>

            {/* Wax Seal Badge */}
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-accent/80 bg-secondary/40 text-xs text-primary font-medium px-3 py-1"
              >
                <Sparkles className="size-3 mr-1 text-primary inline" />
                {activeScenario.matchBadge}
              </Badge>
              <Badge variant="secondary" className="text-xs font-mono font-bold px-2.5 py-1">
                {activeScenario.matchScore} Affinity
              </Badge>
            </div>
          </div>

          {/* Taste & Sentiment Radar Mini Bar */}
          <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-secondary/20 p-2.5 border border-border/40 text-[11px]">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">Aesthetic Alignment</span>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 flex-1 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${activeScenario.radar.aesthetic}%` }}
                  />
                </div>
                <span className="font-mono text-[10px] text-foreground">{activeScenario.radar.aesthetic}%</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">Emotional Weight</span>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 flex-1 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${activeScenario.radar.sentiment}%` }}
                  />
                </div>
                <span className="font-mono text-[10px] text-foreground">{activeScenario.radar.sentiment}%</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">Everyday Utility</span>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 flex-1 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${activeScenario.radar.utility}%` }}
                  />
                </div>
                <span className="font-mono text-[10px] text-foreground">{activeScenario.radar.utility}%</span>
              </div>
            </div>
          </div>

          {/* Sub-view toggle: Recommendation vs Card Note */}
          <div className="flex items-center gap-2 pt-3 border-b border-border/40 pb-2">
            <button
              onClick={() => setViewMode("gift")}
              className={`text-xs font-medium pb-1 transition-all ${
                viewMode === "gift"
                  ? "border-b-2 border-primary text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Curated Gift Piece
            </button>
            <span className="text-muted-foreground/40">•</span>
            <button
              onClick={() => setViewMode("card")}
              className={`text-xs font-medium pb-1 transition-all flex items-center gap-1 ${
                viewMode === "card"
                  ? "border-b-2 border-primary text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Feather className="size-3 text-primary" />
              Handwritten Card Note
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-2 sm:p-8 sm:pt-2">
          {viewMode === "gift" ? (
            <div className="flex flex-col gap-3.5">
              {/* Product Card Highlight */}
              <div className="rounded-2xl border border-border/70 bg-secondary/30 p-5 backdrop-blur-xs">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
                      Primary Suggestion
                    </span>
                    <h4 className="font-serif text-xl sm:text-2xl font-bold text-foreground leading-snug">
                      {activeScenario.giftName}
                    </h4>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <div className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                      {activeScenario.estimatedPrice}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Target: {activeScenario.budget}
                    </span>
                  </div>
                </div>

                {/* Rationale Callout */}
                <div className="mt-4 rounded-xl border border-border/50 bg-card/75 p-3.5 text-xs text-muted-foreground leading-relaxed">
                  <span className="font-serif font-bold text-foreground block text-sm mb-1">
                    Why this resonates:
                  </span>
                  {activeScenario.whyRecommended}
                </div>

                {/* Alternative */}
                <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground gap-1">
                  <span>
                    <strong className="font-medium text-foreground/90">Curated alternative:</strong>{" "}
                    {activeScenario.alternative}
                  </span>
                  <Link href="/find-gift" className="text-primary hover:underline font-medium shrink-0">
                    Explore 4 more variations →
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* Handwritten Note Preview Mode */
            <div className="rounded-2xl border border-border/80 bg-secondary/25 p-6 relative">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-3">
                <Feather className="size-3.5" />
                <span>AI Sentiment Note · Tone: Heartfelt & Nostalgic</span>
              </div>
              <p className="font-serif text-lg sm:text-xl italic text-foreground/90 leading-relaxed max-w-xl">
                &ldquo;{activeScenario.handwrittenNote}&rdquo;
              </p>
              <div className="mt-4 text-xs text-muted-foreground text-right font-serif">
                — Ready to transcribe to your gift envelope
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-wrap items-center justify-between gap-3 p-6 pt-0 sm:p-8 sm:pt-0">
          <div className="flex items-center gap-2">
            <Button
              variant={isSaved ? "secondary" : "outline"}
              size="sm"
              onClick={() => setIsSaved(!isSaved)}
              className="gap-1.5 text-xs rounded-xl"
            >
              <Bookmark className={`size-3.5 ${isSaved ? "fill-primary text-primary" : ""}`} />
              {isSaved ? "Shortlisted in Plans" : "Shortlist Gift"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground"
              render={<Link href="/find-gift" />}
            >
              <SlidersHorizontal className="size-3.5" />
              Adjust Persona
            </Button>
          </div>

          <Button size="sm" className="text-xs rounded-xl shadow-xs" render={<Link href="/find-gift" />}>
            <span>Curate For Your Person</span>
            <ArrowRight className="size-3.5 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
