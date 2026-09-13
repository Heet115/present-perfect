import type { Metadata } from "next"
import Link from "next/link"
import {
  Sparkles,
  ArrowRight,
  Gift,
  Heart,
  Calendar,
  Users,
  Compass,
  FileText,
  SlidersHorizontal,
  Coffee,
  Camera,
  BookOpen,
  Feather,
  Flower2,
  BookmarkCheck,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroCurationPreview } from "@/components/hero-curation-preview"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Present Perfect — Bespoke AI Gift Recommendation Concierge",
  description:
    "Gifts that feel like they were meant to be found. Present Perfect uses AI to analyze personalities, milestones, and personal nuances to curate unforgettable gifts.",
}

const tasteArchetypes = [
  {
    icon: Coffee,
    title: "The Coffee Ritualist",
    subtitle: "Appreciates morning stillness",
    samplePicks: ["Brass Pour-Over Stands", "Single-Origin Beans", "Japanese Drippers"],
  },
  {
    icon: Camera,
    title: "The Analog Archivist",
    subtitle: "Sees magic in grain & film",
    samplePicks: ["Hand-Stitched Leather Straps", "Archival Negatives Case", "Medium Format Books"],
  },
  {
    icon: Flower2,
    title: "The Botanical Escapist",
    subtitle: "Surrounds life with green sanctuaries",
    samplePicks: ["Raw Terracotta Pots", "Heirloom Pruning Shears", "Botanical Field Guides"],
  },
  {
    icon: BookOpen,
    title: "The Literary Nocturne",
    subtitle: "Lives inside rare pages",
    samplePicks: ["Solid Brass Book Weights", "First-Edition Anthologies", "Amber Reading Lamps"],
  },
]

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors selection:bg-accent/30 selection:text-foreground">
      <Navbar />

      <main className="flex-1">
        {/* ========================================================= */}
        {/* HERO SECTION                                              */}
        {/* ========================================================= */}
        <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
          {/* Layered Warm Ambient Halos */}
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden">
            <div className="h-[600px] w-[900px] rounded-full bg-linear-to-b from-warm-parchment/30 via-warm-sand/15 to-transparent blur-3xl opacity-70" />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center">
              {/* Floating Concierge Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/85 px-4 py-1.5 text-xs font-medium text-foreground/90 shadow-xs backdrop-blur-md">
                <span className="flex size-1.5 rounded-full bg-primary animate-pulse" />
                <span className="font-serif italic font-semibold text-primary">Atelier Concierge</span>
                <span className="text-muted-foreground/50">•</span>
                <span className="text-muted-foreground">The art of thoughtful giving</span>
              </div>

              {/* Editorial Display Heading */}
              <h1 className="mt-8 max-w-4xl font-serif text-4xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl leading-[1.08]">
                Gifts that feel like they were{" "}
                <span className="italic font-normal text-primary underline decoration-accent/60 decoration-wavy decoration-1 underline-offset-8">
                  meant
                </span>{" "}
                to be found.
              </h1>

              {/* Refined Subtitle */}
              <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl font-sans leading-relaxed">
                Present Perfect listens to their subtle quirks, recalls milestone anniversaries,
                and crafts bespoke gift recommendations that make your favorite people feel genuinely celebrated.
              </p>

              {/* High-End Dual CTAs */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button
                  size="lg"
                  className="h-12 px-7 text-sm rounded-full shadow-md hover:shadow-lg transition-all"
                  render={<Link href="/find-gift" />}
                >
                  <Sparkles data-icon="inline-start" />
                  Begin Gift Discovery
                  <ArrowRight data-icon="inline-end" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-7 text-sm rounded-full border-border/80 bg-card/60 backdrop-blur-xs hover:bg-secondary/60"
                  render={<Link href="/dashboard" />}
                >
                  View Concierge Dashboard
                </Button>
              </div>

              {/* Centerpiece Interactive Showcase */}
              <div className="mt-16 w-full max-w-3xl">
                <HeroCurationPreview />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* TASTE ARCHETYPES: BEYOND GENERIC CATEGORIES              */}
        {/* ========================================================= */}
        <section className="border-y border-border/60 bg-secondary/20 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center mb-14">
              <Badge variant="outline" className="border-accent/70 text-[10px] uppercase tracking-widest text-primary mb-2">
                Resonance Mapping
              </Badge>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                We cater to souls, not demographics
              </h2>
              <p className="mt-2.5 max-w-lg text-sm text-muted-foreground leading-relaxed">
                A glimpse into how our recommendation engine maps personal quirks to enduring artifacts.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {tasteArchetypes.map((arch) => {
                const Icon = arch.icon
                return (
                  <Card
                    key={arch.title}
                    className="group border-border/70 bg-card/85 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                  >
                    <CardHeader className="p-6 pb-3">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary/80 text-primary mb-3 ring-1 ring-border/50 group-hover:scale-110 transition-transform">
                        <Icon className="size-5" />
                      </div>
                      <CardTitle className="font-serif text-lg font-bold text-foreground">
                        {arch.title}
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground">
                        {arch.subtitle}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-2">
                      <div className="flex flex-col gap-1.5 pt-2 border-t border-border/50">
                        {arch.samplePicks.map((pick) => (
                          <div key={pick} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="size-1 rounded-full bg-primary/60 shrink-0" />
                            <span className="truncate">{pick}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* BENTO GRID: THE CONCIERGE SUITE                           */}
        {/* ========================================================= */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center mb-16">
              <span className="font-serif italic text-primary text-sm font-medium mb-1">
                The Atelier Suite
              </span>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
                Every detail of the gesture, perfected
              </h2>
              <p className="mt-3 max-w-xl text-sm text-muted-foreground leading-relaxed">
                From remembering intimate preferences to generating heartfelt card messages.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Tile 1: Recipient Dossiers */}
              <Card className="border-border/70 bg-card/80 md:col-span-2 shadow-xs hover:shadow-sm transition-shadow">
                <CardHeader className="p-6 sm:p-8 pb-4">
                  <div className="flex items-center gap-2 text-primary font-mono text-xs">
                    <span>I.</span>
                    <span className="uppercase tracking-widest font-sans font-semibold">
                      Recipient Dossiers
                    </span>
                  </div>
                  <CardTitle className="font-serif text-2xl font-bold text-foreground mt-2">
                    Capture their subtle nuances, not just generic hobbies
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground leading-relaxed mt-1">
                    Store their favorite coffee roastery, ring sizes, aesthetic inspirations, things they strictly dislike,
                    and nostalgic memories. The AI cross-references every nuance during recommendation.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 sm:p-8 pt-0">
                  <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border/60 bg-secondary/30 p-4 sm:grid-cols-3 text-xs">
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground font-medium">Loves</span>
                      <span className="font-serif font-bold text-foreground">Single Origin, Vinyl, Film</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground font-medium">Dislikes</span>
                      <span className="font-serif font-bold text-destructive/90">Novelty Mugs, Synthetic Scents</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-muted-foreground font-medium">Inside Joke</span>
                      <span className="font-serif font-bold text-foreground">&ldquo;The 2022 Lisbon Tram&rdquo;</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tile 2: Occasion Radar */}
              <Card className="border-border/70 bg-card/80 shadow-xs hover:shadow-sm transition-shadow">
                <CardHeader className="p-6 sm:p-8 pb-4">
                  <div className="flex items-center gap-2 text-primary font-mono text-xs">
                    <span>II.</span>
                    <span className="uppercase tracking-widest font-sans font-semibold">
                      Occasion Radar
                    </span>
                  </div>
                  <CardTitle className="font-serif text-xl font-bold text-foreground mt-2">
                    Never scramble hours before an event
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground leading-relaxed mt-1">
                    Automated milestone countdowns with gentle 14-day and 7-day preparation notices.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 sm:p-8 pt-0">
                  <div className="flex flex-col gap-2.5 rounded-2xl border border-border/60 bg-secondary/30 p-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-foreground">Tara&apos;s 3rd Anniversary</span>
                      <Badge variant="outline" className="text-[10px] text-primary border-accent/80">
                        In 9 Days
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                      <BookmarkCheck className="size-3 text-primary" />
                      <span>Gift Plan Status: Shortlisted</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tile 3: Budget Optimizer */}
              <Card className="border-border/70 bg-card/80 shadow-xs hover:shadow-sm transition-shadow">
                <CardHeader className="p-6 sm:p-8 pb-4">
                  <div className="flex items-center gap-2 text-primary font-mono text-xs">
                    <span>III.</span>
                    <span className="uppercase tracking-widest font-sans font-semibold">
                      Budget Calibration
                    </span>
                  </div>
                  <CardTitle className="font-serif text-xl font-bold text-foreground mt-2">
                    Honest spending limits
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground leading-relaxed mt-1">
                    Set precise currency thresholds: Budget-Friendly finds, curated bundles, or luxury statements.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 sm:p-8 pt-0">
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="secondary" className="px-3 py-1">₹1,500 — ₹3,000</Badge>
                    <Badge variant="secondary" className="px-3 py-1">₹3,000 — ₹7,500</Badge>
                    <Badge variant="secondary" className="px-3 py-1">₹10,000+ Keepsake</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Tile 4: Handwritten Sentiment Engine */}
              <Card className="border-border/70 bg-card/80 md:col-span-2 shadow-xs hover:shadow-sm transition-shadow">
                <CardHeader className="p-6 sm:p-8 pb-4">
                  <div className="flex items-center gap-2 text-primary font-mono text-xs">
                    <span>IV.</span>
                    <span className="uppercase tracking-widest font-sans font-semibold">
                      Sentiment & Card Writer
                    </span>
                  </div>
                  <CardTitle className="font-serif text-2xl font-bold text-foreground mt-2">
                    Words that echo in their heart forever
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground leading-relaxed mt-1">
                    AI crafts personalized handwritten messages matching your exact tone: Heartfelt, Witty,
                    Poetic, or Emotional, tailored to your shared history.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 sm:p-8 pt-0">
                  <div className="rounded-2xl border border-border/60 bg-secondary/30 p-5 font-serif text-sm italic text-foreground/90 leading-relaxed">
                    &ldquo;To the one who taught me that good coffee takes quiet patience, and true friendships require
                    even more. Happy 21st, Kabir. Here&apos;s to a million more conversations over brass drippers.&rdquo;
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* EDITORIAL MANIFESTO QUOTE                                 */}
        {/* ========================================================= */}
        <section className="border-y border-border/60 bg-secondary/30 py-20 text-center">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <Feather className="size-6 text-primary mx-auto mb-4 opacity-80" />
            <blockquote className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-foreground/90 italic leading-relaxed">
              &ldquo;A gift should never be an afterthought or an algorithmic list of gadgets.
              It is a quiet statement that says: I know who you are, and I pay attention.&rdquo;
            </blockquote>
            <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground font-sans font-semibold">
              The Present Perfect Philosophy
            </p>
          </div>
        </section>

        {/* ========================================================= */}
        {/* FINAL CALL TO DISCOVERY                                   */}
        {/* ========================================================= */}
        <section className="py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-border/80 bg-card/90 p-10 sm:p-16 shadow-xl backdrop-blur-md">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-secondary text-primary mb-6 ring-1 ring-border/60 shadow-xs">
                <Gift className="size-7" />
              </div>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
                Ready to curate your next unforgettable moment?
              </h2>
              <p className="mt-4 text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Take 60 seconds to describe who you are celebrating. Let our AI concierge discover the gift they will treasure forever.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" className="h-12 px-8 rounded-full shadow-md" render={<Link href="/find-gift" />}>
                  <Sparkles data-icon="inline-start" />
                  Launch AI Gift Finder
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 rounded-full border-border/80"
                  render={<Link href="/register" />}
                >
                  Create Your Account
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
