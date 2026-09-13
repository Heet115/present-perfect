"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import {
  Sparkles,
  Compass,
  Lightbulb,
  Coins,
  Calendar,
  Users,
  Tag,
  ThumbsDown,
  Loader2,
  AlertCircle,
  RotateCcw,
  Plus,
  HelpCircle,
  Dices,
  Wand2,
  DollarSign,
  Heart,
  Smile,
  Hammer,
  Ban,
  ArrowRight,
  Send,
  Layers,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { RecommendationCard } from "@/components/recommendation-card"
import { AiGiftAssistant } from "@/components/ai-gift-assistant"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/auth-context"
import { recipientService } from "@/lib/services/recipient-service"
import { occasionService } from "@/lib/services/occasion-service"
import { savedGiftService } from "@/lib/services/saved-gift-service"
import { Recipient } from "@/lib/types/recipient"
import {
  RecommendationRequest,
  GiftRecommendation,
  RefinementModifier,
} from "@/lib/types/recommendation"

const sampleInspirations = [
  {
    label: "☕ Best Friend · 21st Coffee & Film",
    recipientName: "Kabir",
    relationship: "Best Friend",
    age: "21",
    occasion: "21st Birthday",
    budget: 3000,
    interests: ["Analog Photography", "Specialty Pour-Over", "Solo Backpacking"],
    personalityTraits: ["Observant", "Minimalist", "Adventurous"],
    dislikes: ["Novelty mugs", "Synthetic scents"],
  },
  {
    label: "🪴 Mom · 50th Tea & Ceramics",
    recipientName: "Anjali",
    relationship: "Mother",
    age: "50",
    occasion: "50th Jubilee",
    budget: 6500,
    interests: ["Terracotta Gardening", "First-Flush Tea", "Classical Poetry"],
    personalityTraits: ["Sentimental", "Peaceful", "Discerning"],
    dislikes: ["Plastic containers", "Loud gadgets"],
  },
  {
    label: "🎧 Partner · 3rd Anniversary Keepsake",
    recipientName: "Tara",
    relationship: "Partner",
    age: "28",
    occasion: "3rd Anniversary",
    budget: 5500,
    interests: ["Vinyl Records", "Botanical Perfumes", "Architecture"],
    personalityTraits: ["Romantic", "Artistic", "Nostalgic"],
    dislikes: ["Generic jewelry", "Cheesy cards"],
  },
]

export default function FindGiftPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const prefillName = searchParams.get("recipient")

  const [recipients, setRecipients] = React.useState<Recipient[]>([])
  const [selectedRecipientId, setSelectedRecipientId] = React.useState<string>("")

  // Form states
  const [recipientName, setRecipientName] = React.useState("")
  const [relationship, setRelationship] = React.useState("Friend")
  const [age, setAge] = React.useState("20s")
  const [occasion, setOccasion] = React.useState("Birthday")
  const [budget, setBudget] = React.useState(3500)
  const [currency, setCurrency] = React.useState("₹")
  const [interests, setInterests] = React.useState<string[]>(["Coffee", "Photography"])
  const [interestInput, setInterestInput] = React.useState("")
  const [personalityTraits, setPersonalityTraits] = React.useState<string[]>(["Thoughtful", "Creative"])
  const [traitInput, setTraitInput] = React.useState("")
  const [dislikes, setDislikes] = React.useState<string[]>(["Plastic gadgets"])
  const [dislikeInput, setDislikeInput] = React.useState("")
  const [personalNotes, setPersonalNotes] = React.useState("")

  // Generation states
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [recommendations, setRecommendations] = React.useState<GiftRecommendation[]>([])
  const [error, setError] = React.useState<string | null>(null)
  const [savedNotification, setSavedNotification] = React.useState<string | null>(null)

  // Phase 7: Discovery Modes & Refinements
  const [discoveryMode, setDiscoveryMode] = React.useState<"consultation" | "no_idea" | "surprise_me">("consultation")
  const [refinementText, setRefinementText] = React.useState("")
  const [excludeCategoryTarget, setExcludeCategoryTarget] = React.useState<string | null>(null)
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = React.useState(false)

  // "I Have No Idea" Guided Flow states
  const [noIdeaRelation, setNoIdeaRelation] = React.useState("Best Friend")
  const [noIdeaVibe, setNoIdeaVibe] = React.useState("Timeless & Understated")
  const [noIdeaBudget, setNoIdeaBudget] = React.useState(3500)

  // Load existing recipients for auto-fill
  React.useEffect(() => {
    if (!user) return
    recipientService.getAll(user.uid).then((data) => {
      setRecipients(data)
      if (prefillName) {
        const found = data.find((r) => r.name.toLowerCase() === prefillName.toLowerCase())
        if (found && found.id) {
          handleSelectRecipient(found.id, data)
        } else {
          setRecipientName(prefillName)
        }
      }
    }).catch(console.error)
  }, [user, prefillName])

  const handleSelectRecipient = (id: string, list = recipients) => {
    setSelectedRecipientId(id)
    if (!id) return
    const found = list.find((r) => r.id === id)
    if (found) {
      setRecipientName(found.name)
      setRelationship(found.relationship)
      if (found.ageGroup) setAge(found.ageGroup)
      if (found.interests?.length) setInterests(found.interests)
      if (found.personalityTraits?.length) setPersonalityTraits(found.personalityTraits)
      if (found.dislikes?.length) setDislikes(found.dislikes)
      if (found.personalNotes) setPersonalNotes(found.personalNotes)
      if (found.importantDates?.[0]) setOccasion(found.importantDates[0].title)
    }
  }

  const applyInspiration = (item: typeof sampleInspirations[0]) => {
    setSelectedRecipientId("")
    setRecipientName(item.recipientName)
    setRelationship(item.relationship)
    setAge(item.age)
    setOccasion(item.occasion)
    setBudget(item.budget)
    setInterests(item.interests)
    setPersonalityTraits(item.personalityTraits)
    setDislikes(item.dislikes)
  }

  const addTag = (
    val: string,
    setVal: (v: string) => void,
    list: string[],
    setList: (l: string[]) => void
  ) => {
    const trimmed = val.trim()
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed])
      setVal("")
    }
  }

  const removeTag = (val: string, list: string[], setList: (l: string[]) => void) => {
    setList(list.filter((i) => i !== val))
  }

  const handleGenerate = async (
    options?: {
      refinementModifier?: RefinementModifier
      refinementInstruction?: string
      excludedCategory?: string
      targetCategory?: string
      mode?: "standard" | "no_idea" | "surprise_me"
      overrideBudget?: number
      overrideName?: string
      overrideRelation?: string
      overrideInterests?: string[]
      overrideTraits?: string[]
      overrideOccasion?: string
    },
    e?: React.FormEvent
  ) => {
    if (e) e.preventDefault()
    setIsGenerating(true)
    setError(null)
    setSavedNotification(null)

    const payload: RecommendationRequest = {
      recipientId: selectedRecipientId || undefined,
      recipientName: options?.overrideName || recipientName.trim() || "Recipient",
      age,
      relationship: options?.overrideRelation || relationship,
      interests: options?.overrideInterests || interests,
      personalityTraits: options?.overrideTraits || personalityTraits,
      occasion: options?.overrideOccasion || occasion,
      budget: options?.overrideBudget || budget,
      currency,
      dislikes,
      personalNotes,
      refinementModifier: options?.refinementModifier,
      refinementInstruction: options?.refinementInstruction,
      excludedCategory: options?.excludedCategory,
      targetCategory: options?.targetCategory,
      mode: options?.mode,
    }

    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error("Failed to receive recommendations from concierge.")
      }

      const data = await res.json()
      if (data.recommendations && data.recommendations.length > 0) {
        setRecommendations(data.recommendations)
        if (options?.refinementModifier) {
          const modLabel = options.refinementModifier.replace("_", " ")
          setSavedNotification(`Refined curation: Applied "${modLabel}" guidance.`)
          setTimeout(() => setSavedNotification(null), 4000)
        }
      } else {
        setError("Could not generate recommendations. Please adjust your criteria and try again.")
      }
    } catch (err) {
      console.error("Generation error:", err)
      setError("AI Concierge was unable to connect. Please check your network and try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveToPlan = async (rec: GiftRecommendation) => {
    if (!user) return
    try {
      await occasionService.createGiftPlan(user.uid, {
        recipientId: selectedRecipientId || "custom",
        recipientName: recipientName.trim() || "Recipient",
        status: "shortlisted",
        targetBudget: budget,
        currency,
        giftIdeas: [
          {
            id: Date.now().toString(),
            title: rec.name,
            price: rec.estimatedPrice,
            notes: rec.whyItFits,
            isSelected: true,
          },
        ],
        notes: `Selected via AI Gift Finder for ${occasion}. Note: "${rec.handwrittenNote}"`,
      })
      setSavedNotification(`Saved "${rec.name}" to your active Gift Plans!`)
      setTimeout(() => setSavedNotification(null), 4000)
    } catch (err) {
      console.error("Save to plan error:", err)
    }
  }

  const handleSaveToVault = async (rec: GiftRecommendation) => {
    if (!user) return
    try {
      await savedGiftService.save(user.uid, {
        recipientId: selectedRecipientId || undefined,
        recipientName: recipientName.trim() || "Someone Special",
        recommendation: rec,
        notes: `Saved via AI Gift Finder for ${occasion}. Note: "${rec.handwrittenNote}"`,
      })
      setSavedNotification(`Saved "${rec.name}" to your permanent Gift Vault!`)
      setTimeout(() => setSavedNotification(null), 4000)
    } catch (err) {
      console.error("Save to vault error:", err)
    }
  }

  // Recommendation filters and sorting (Phase 6)
  const [selectedTypeFilter, setSelectedTypeFilter] = React.useState<string>("All")
  const [sortBy, setSortBy] = React.useState<"match" | "price-asc" | "price-desc">("match")

  const handleSelectAlternative = (originalRecId: string, altName: string, altPrice: number) => {
    setRecommendations((prev) =>
      prev.map((r) => {
        if (r.id === originalRecId) {
          return {
            ...r,
            name: altName,
            estimatedPrice: altPrice,
            tagline: `Alternative choice for ${altName}`,
            whyRecommended: `${r.whyRecommended} (Switched to alternative variation: ${altName})`,
            whyItFits: `${r.whyItFits} (Switched to alternative variation: ${altName})`,
          }
        }
        return r
      })
    )
    setSavedNotification(`Swapped recommendation to alternative: "${altName}" (₹${altPrice.toLocaleString()})`)
    setTimeout(() => setSavedNotification(null), 4000)
  }

  const filteredRecommendations = React.useMemo(() => {
    let list = [...recommendations]
    if (selectedTypeFilter !== "All") {
      list = list.filter((r) => r.recommendationType === selectedTypeFilter)
    }
    if (sortBy === "match") {
      list.sort((a, b) => (b.matchScore ?? b.compatibilityScore ?? 0) - (a.matchScore ?? a.compatibilityScore ?? 0))
    } else if (sortBy === "price-asc") {
      list.sort((a, b) => a.estimatedPrice - b.estimatedPrice)
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.estimatedPrice - a.estimatedPrice)
    }
    return list
  }, [recommendations, selectedTypeFilter, sortBy])

  return (
    <div className="flex flex-col gap-8 pb-16">
      <PageHeader
        title="AI Gift Finder & Concierge"
        description="Describe who you are celebrating naturally, explore conversational discovery, or refine recommendations with one click."
        badgeText="Phase 7 — AI Assistant & Refinement"
      />

      {/* Discovery Mode Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-secondary/40 border border-border/60 self-start">
        <button
          onClick={() => setDiscoveryMode("consultation")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            discoveryMode === "consultation"
              ? "bg-primary text-primary-foreground shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Wand2 className="size-3.5" />
          <span>Detailed Consultation</span>
        </button>

        <button
          onClick={() => setDiscoveryMode("no_idea")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            discoveryMode === "no_idea"
              ? "bg-primary text-primary-foreground shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <HelpCircle className="size-3.5" />
          <span>&ldquo;I Have No Idea&rdquo; Mode</span>
        </button>

        <button
          onClick={() => setDiscoveryMode("surprise_me")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            discoveryMode === "surprise_me"
              ? "bg-primary text-primary-foreground shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Dices className="size-3.5" />
          <span>&ldquo;Surprise Me&rdquo; Mode</span>
        </button>
      </div>

      {/* Mode 1: "I Have No Idea" Guided 3-Step Questionnaire */}
      {discoveryMode === "no_idea" && (
        <Card className="rounded-3xl border border-accent/80 bg-linear-to-br from-card/95 via-secondary/20 to-card/90 shadow-lg p-6 sm:p-8">
          <div className="flex flex-col gap-6 max-w-2xl">
            <div>
              <Badge className="bg-primary/20 text-primary border-0 text-[10px] uppercase font-bold tracking-widest mb-2">
                Guided Discovery
              </Badge>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                Don&rsquo;t worry, you&rsquo;re in good hands.
              </h2>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                When you don&rsquo;t know where to begin, answer three effortless questions. Our atelier concierge will identify guaranteed, universally cherished gems.
              </p>
            </div>

            {/* Step 1: Recipient Relationship */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-foreground">
                1. Who is this gift for?
              </span>
              <div className="flex flex-wrap gap-2">
                {["Partner", "Best Friend", "Parent", "Sibling", "Colleague", "Mentor"].map((rel) => (
                  <button
                    key={rel}
                    onClick={() => setNoIdeaRelation(rel)}
                    className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer border ${
                      noIdeaRelation === rel
                        ? "bg-primary text-primary-foreground border-primary font-semibold"
                        : "bg-background/80 hover:bg-background border-border/70 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {rel}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Vibe */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-foreground">
                2. What overall vibe feels most right?
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { title: "Timeless & Understated", desc: "Brass artifacts, heritage notebooks, heirloom leather" },
                  { title: "Sensory & Calming", desc: "Ceramic vessels, rare botanicals, aromatic home fragrances" },
                  { title: "Practical & Utilitarian", desc: "Elevated daily carry, durable tools, morning ritual gear" },
                  { title: "Celebratory & Indulgent", desc: "Artisanal tasting flights, limited editions, festive tokens" },
                ].map((v) => (
                  <button
                    key={v.title}
                    onClick={() => setNoIdeaVibe(v.title)}
                    className={`p-3 rounded-2xl text-left transition-all cursor-pointer border ${
                      noIdeaVibe === v.title
                        ? "bg-secondary/70 border-primary text-foreground font-medium shadow-xs"
                        : "bg-background/60 hover:bg-background/90 border-border/60 text-muted-foreground"
                    }`}
                  >
                    <span className="text-xs font-semibold block text-foreground">{v.title}</span>
                    <span className="text-[10px] text-muted-foreground leading-tight mt-0.5 block">{v.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Budget tier */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-foreground">
                3. What is your comfortable budget?
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "₹1,500 (Modest & Meaningful)", value: 1500 },
                  { label: "₹3,500 (Balanced Sweet Spot)", value: 3500 },
                  { label: "₹6,000 (Elevated Luxury)", value: 6000 },
                  { label: "₹10,000+ (Heirloom Caliber)", value: 10000 },
                ].map((b) => (
                  <button
                    key={b.value}
                    onClick={() => setNoIdeaBudget(b.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer border ${
                      noIdeaBudget === b.value
                        ? "bg-primary text-primary-foreground border-primary font-semibold"
                        : "bg-background/80 hover:bg-background border-border/70 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => {
                handleGenerate({
                  mode: "no_idea",
                  overrideName: `${noIdeaRelation}`,
                  overrideRelation: noIdeaRelation,
                  overrideBudget: noIdeaBudget,
                  overrideTraits: [noIdeaVibe, "Discerning"],
                  overrideInterests: [noIdeaVibe.split("&")[0].trim(), "Quiet Luxury"],
                  overrideOccasion: "Special Celebration",
                })
              }}
              disabled={isGenerating}
              className="h-11 px-8 rounded-full shadow-md text-sm gap-2 self-start cursor-pointer mt-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Synthesizing Foolproof Curations...
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Generate Guided Recommendations
                </>
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* Mode 2: "Surprise Me" Instant Serendipity Mode */}
      {discoveryMode === "surprise_me" && (
        <Card className="rounded-3xl border border-warm-sand/80 bg-linear-to-br from-card/95 via-warm-sand/15 to-card/90 shadow-lg p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-xl">
              <Badge className="bg-warm-sand text-warm-ivory border-0 text-[10px] uppercase font-bold tracking-widest self-start">
                Serendipitous Curation
              </Badge>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                Delight with the completely unexpected.
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Break outside conventional gifting categories. The Atelier Concierge will cross-reference independent studios, artisanal guilds, and sensory oddities to surprise you both.
              </p>
            </div>

            <Button
              size="lg"
              onClick={() => {
                handleGenerate({
                  mode: "surprise_me",
                  overrideName: recipientName || "Someone Special",
                  overrideBudget: budget || 4000,
                  overrideOccasion: occasion || "Celebration",
                })
              }}
              disabled={isGenerating}
              className="h-12 px-8 rounded-full shadow-xl bg-warm-mocha text-warm-ivory hover:bg-warm-mocha/90 border border-warm-sand/50 text-sm gap-2 cursor-pointer shrink-0"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Unfurling Wonders...
                </>
              ) : (
                <>
                  <Dices className="size-4 text-warm-parchment animate-spin" />
                  Unfurl Serendipitous Treasures
                </>
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* Mode 3: Detailed Consultation (Default) */}
      {discoveryMode === "consultation" && (
        <>
          {/* Inspiration Quick Chips */}
          <div className="flex flex-col gap-2 p-4 rounded-2xl bg-secondary/30 border border-border/60">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
              <Lightbulb className="size-3.5" />
              <span>Quick Inspiration Prompts (Click to Pre-fill):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {sampleInspirations.map((item) => (
                <button
                  key={item.label}
                  onClick={() => applyInspiration(item)}
                  className="text-xs bg-card/80 hover:bg-card px-3 py-1.5 rounded-full border border-border/60 text-muted-foreground hover:text-foreground transition-all shadow-2xs cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Consultation Form Card */}
          <Card className="rounded-3xl border border-border/80 bg-card/85 shadow-md backdrop-blur-xs">
            <CardHeader className="p-6 sm:p-8 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="font-serif text-2xl font-bold text-foreground">
                  Persona & Occasion Consultation
                </CardTitle>
                {recipients.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      Autofill from Dossier:
                    </span>
                    <select
                      value={selectedRecipientId}
                      onChange={(e) => handleSelectRecipient(e.target.value)}
                      className="h-9 rounded-xl border border-input bg-background/80 px-2.5 text-xs text-foreground outline-none cursor-pointer"
                    >
                      <option value="">Manual Entry</option>
                      {recipients.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} ({r.relationship})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-6 sm:p-8 pt-2">
              <form onSubmit={(e) => { e.preventDefault(); handleGenerate(undefined, e); }} className="flex flex-col gap-5">
                {/* Identity row */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-foreground/90">
                      Who are you buying for? *
                    </label>
                    <Input
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g. Tara, Kabir, Dad"
                      required
                      className="h-10 bg-background/60"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-foreground/90">
                      Relationship
                    </label>
                    <Input
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      placeholder="e.g. Partner, Best Friend"
                      className="h-10 bg-background/60"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-foreground/90">
                      Age / Life Stage
                    </label>
                    <Input
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 21, 30s, Senior"
                      className="h-10 bg-background/60"
                    />
                  </div>
                </div>

                {/* Occasion & Budget */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-medium text-foreground/90">
                      Celebration or Milestone *
                    </label>
                    <Input
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                      placeholder="e.g. 3rd Anniversary, 50th Jubilee, Housewarming"
                      required
                      className="h-10 bg-background/60"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-foreground/90">
                      Budget (₹)
                    </label>
                    <Input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
                      min="500"
                      step="250"
                      required
                      className="h-10 bg-background/60 font-mono"
                    />
                  </div>
                </div>

                <Separator />

                {/* Passions & Traits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Interests */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-foreground/90 flex items-center justify-between">
                      <span>Passions & Obsessions</span>
                      <span className="text-[10px] text-muted-foreground font-normal">
                        Press Enter to add
                      </span>
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={interestInput}
                        onChange={(e) => setInterestInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addTag(interestInput, setInterestInput, interests, setInterests)
                          }
                        }}
                        placeholder="e.g. Analog photography, Matcha, Vinyl"
                        className="h-9 bg-background/60 text-xs"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => addTag(interestInput, setInterestInput, interests, setInterests)}
                        className="text-xs h-9 px-3"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 min-h-6">
                      {interests.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="gap-1 px-2.5 py-0.5 text-xs cursor-pointer"
                          onClick={() => removeTag(tag, interests, setInterests)}
                        >
                          <span>{tag}</span>
                          <span className="text-muted-foreground hover:text-foreground">×</span>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Personality Traits */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-foreground/90 flex items-center justify-between">
                      <span>Personality & Temperament</span>
                      <span className="text-[10px] text-muted-foreground font-normal">
                        Press Enter to add
                      </span>
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={traitInput}
                        onChange={(e) => setTraitInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addTag(traitInput, setTraitInput, personalityTraits, setPersonalityTraits)
                          }
                        }}
                        placeholder="e.g. Minimalist, Sentimental, Adventurous"
                        className="h-9 bg-background/60 text-xs"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => addTag(traitInput, setTraitInput, personalityTraits, setPersonalityTraits)}
                        className="text-xs h-9 px-3"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 min-h-6">
                      {personalityTraits.map((trait) => (
                        <Badge
                          key={trait}
                          variant="outline"
                          className="gap-1 px-2.5 py-0.5 text-xs border-accent/80 cursor-pointer"
                          onClick={() => removeTag(trait, personalityTraits, setPersonalityTraits)}
                        >
                          <span>{trait}</span>
                          <span className="text-muted-foreground hover:text-foreground">×</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Things to Avoid */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-foreground/90 flex items-center justify-between">
                    <span>Gifts to Avoid (Dislikes, Allergies, Anti-Goals)</span>
                    <span className="text-[10px] text-muted-foreground font-normal">
                      Press Enter to add
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={dislikeInput}
                      onChange={(e) => setDislikeInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addTag(dislikeInput, setDislikeInput, dislikes, setDislikes)
                        }
                      }}
                      placeholder="e.g. Synthetic fragrances, Novelty mugs, Wool clothing"
                      className="h-9 bg-background/60 text-xs"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => addTag(dislikeInput, setDislikeInput, dislikes, setDislikes)}
                      className="text-xs h-9 px-3"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 min-h-6">
                    {dislikes.map((dislike) => (
                      <Badge
                        key={dislike}
                        variant="destructive"
                        className="gap-1 px-2.5 py-0.5 text-xs bg-destructive/15 text-destructive border-0 cursor-pointer"
                        onClick={() => removeTag(dislike, dislikes, setDislikes)}
                      >
                        <span>{dislike}</span>
                        <span>×</span>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Submit CTA */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <span className="text-xs text-muted-foreground">
                    Target budget: <strong>₹{budget.toLocaleString()}</strong>
                  </span>

                  <Button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full sm:w-auto h-11 px-8 rounded-full shadow-md text-sm gap-2 cursor-pointer"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Synthesizing bespoke gifts...
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-4" />
                        Curate Gift Recommendations
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </>
      )}

      {/* Feedback Banner on Saving */}
      {savedNotification && (
        <div className="flex items-center gap-2 rounded-2xl bg-secondary/80 border border-accent/80 p-4 text-xs font-semibold text-foreground shadow-sm">
          <Sparkles className="size-4 text-primary" />
          <span>{savedNotification}</span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Recommendations Feed */}
      {isGenerating ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center p-8">
          <div className="relative flex size-16 items-center justify-center rounded-3xl bg-secondary/80 text-primary ring-1 ring-border/60 shadow-md">
            <Sparkles className="size-7 animate-pulse" />
            <Loader2 className="absolute -inset-2.5 size-21 animate-spin text-accent/60 opacity-80" />
          </div>
          <div className="flex flex-col gap-1 max-w-sm">
            <span className="font-serif text-2xl font-bold text-foreground">
              Curating 5 Recommendation Tiers for {recipientName || "them"}
            </span>
            <span className="text-xs text-muted-foreground leading-relaxed">
              Evaluating Best Match, Unique, Budget Friendly, Premium, and Personalized gifts against your ₹{budget.toLocaleString()} budget...
            </span>
          </div>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="flex flex-col gap-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/70 pb-4">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                Structured Recommendations
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {recommendations.length} distinct gift ideas tailored for {recipientName} across 5 curated archetypes.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleGenerate()}
              className="text-xs gap-1.5 rounded-xl self-start sm:self-auto cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              Regenerate Fresh Picks
            </Button>
          </div>

          {/* Phase 7: Natural Language Refinement Toolbar */}
          <div className="flex flex-col gap-3 p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
                <Sparkles className="size-3.5" />
                <span>One-Click Refinement:</span>
              </div>
              <span className="text-[11px] text-muted-foreground">
                Steer curation using natural language modifiers
              </span>
            </div>

            {/* Quick Refinement Action Pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "Make it cheaper", icon: DollarSign, mod: "cheaper" as RefinementModifier },
                { label: "Make it more personal", icon: Heart, mod: "more_personal" as RefinementModifier },
                { label: "Make it unique", icon: Sparkles, mod: "unique" as RefinementModifier },
                { label: "Make it practical", icon: Hammer, mod: "practical" as RefinementModifier },
                { label: "Make it romantic", icon: Heart, mod: "romantic" as RefinementModifier },
                { label: "Make it funny", icon: Smile, mod: "funny" as RefinementModifier },
                { label: "Change category", icon: Layers, mod: "change_category" as RefinementModifier },
                { label: "Exclude a category", icon: Ban, mod: "exclude_category" as RefinementModifier },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    if (item.mod === "exclude_category") {
                      setIsCategoryPickerOpen(!isCategoryPickerOpen)
                    } else {
                      handleGenerate({ refinementModifier: item.mod })
                    }
                  }}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs bg-secondary/50 hover:bg-secondary border border-border/60 text-foreground transition-all cursor-pointer hover:border-primary/50 shadow-2xs"
                >
                  <item.icon className="size-3 text-primary" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Exclude Category Selector Drawer */}
            {isCategoryPickerOpen && (
              <div className="p-3 rounded-xl bg-secondary/30 border border-border/50 flex flex-wrap items-center gap-2 text-xs animate-in fade-in duration-200">
                <span className="text-[11px] text-muted-foreground font-medium">Select category to exclude:</span>
                {Array.from(new Set(recommendations.map((r) => r.category).filter(Boolean))).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setIsCategoryPickerOpen(false)
                      handleGenerate({ refinementModifier: "exclude_category", excludedCategory: cat })
                    }}
                    className="px-2.5 py-1 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 text-xs cursor-pointer"
                  >
                    Exclude &ldquo;{cat}&rdquo;
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setIsCategoryPickerOpen(false)}
                  className="text-[11px] text-muted-foreground hover:underline ml-auto cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Free-form Natural Language Refinement Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (refinementText.trim()) {
                  handleGenerate({ refinementModifier: "custom", refinementInstruction: refinementText.trim() })
                  setRefinementText("")
                }
              }}
              className="flex items-center gap-2 pt-1"
            >
              <Input
                value={refinementText}
                onChange={(e) => setRefinementText(e.target.value)}
                placeholder="Type a custom refinement (e.g. 'They already own a camera bag, focus on vintage lens accessories instead')..."
                className="h-9 text-xs bg-background/70 rounded-xl"
              />
              <Button
                type="submit"
                size="sm"
                disabled={isGenerating || !refinementText.trim()}
                className="h-9 px-4 rounded-xl text-xs gap-1.5 shrink-0 cursor-pointer"
              >
                <Send className="size-3" />
                <span>Refine</span>
              </Button>
            </form>
          </div>

          {/* Phase 6: Category / Recommendation Type Filters & Sorting */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-secondary/20 p-3 rounded-2xl border border-border/60">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {["All", "Best Match", "Unique", "Budget Friendly", "Premium", "Personalized"].map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedTypeFilter(type)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      selectedTypeFilter === type
                        ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                        : "bg-card/70 hover:bg-card text-muted-foreground hover:text-foreground border border-border/50"
                    }`}
                  >
                    {type}
                  </button>
                )
              )}
            </div>

            {/* Sorting selector */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-[11px] text-muted-foreground font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "match" | "price-asc" | "price-desc")}
                className="h-8 rounded-lg border border-input bg-background/80 px-2 text-xs text-foreground outline-none cursor-pointer"
              >
                <option value="match">Highest Match %</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {filteredRecommendations.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-border/60 bg-card/50">
              <p className="text-sm text-muted-foreground">
                No recommendations match the filter &ldquo;{selectedTypeFilter}&rdquo;.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTypeFilter("All")}
                className="mt-3 text-xs cursor-pointer"
              >
                Show All Recommendations
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRecommendations.map((rec) => (
                <RecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  recipientName={recipientName}
                  onSaveToPlan={handleSaveToPlan}
                  onSaveToVault={handleSaveToVault}
                  onSelectAlternative={(altName, altPrice) =>
                    handleSelectAlternative(rec.id, altName, altPrice)
                  }
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          icon={Compass}
          badgeText="Structured Concierge"
          title="Ready to curate bespoke gifts"
          description="Fill out the consultation form above or choose an inspiration chip. Present Perfect will generate structured recommendations covering Best Match, Unique, Budget Friendly, Premium, and Personalized tiers with alternative suggestions and compatibility breakdowns."
          hintText="Powered by Google Gemini 2.5 Flash."
        />
      )}

      {/* Floating AI Gift Assistant Drawer */}
      <AiGiftAssistant
        recipientContext={{
          name: recipientName,
          relationship,
          occasion,
          budget,
          currency,
          interests,
          personalityTraits,
        }}
      />
    </div>
  )
}

