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
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { RecommendationCard } from "@/components/recommendation-card"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/auth-context"
import { recipientService } from "@/lib/services/recipient-service"
import { occasionService } from "@/lib/services/occasion-service"
import { Recipient } from "@/lib/types/recipient"
import { RecommendationRequest, GiftRecommendation } from "@/lib/types/recommendation"

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

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setIsGenerating(true)
    setError(null)
    setSavedNotification(null)

    const payload: RecommendationRequest = {
      recipientId: selectedRecipientId || undefined,
      recipientName: recipientName.trim() || "Recipient",
      age,
      relationship,
      interests,
      personalityTraits,
      occasion,
      budget,
      currency,
      dislikes,
      personalNotes,
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

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="AI Gift Finder"
        description="Describe who you are celebrating naturally. Our AI concierge cross-references subtle quirks, tastes, budget, and relationship depth."
        badgeText="Gemini Concierge Engine"
      />

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
              className="text-xs bg-card/80 hover:bg-card px-3 py-1.5 rounded-full border border-border/60 text-muted-foreground hover:text-foreground transition-all shadow-2xs"
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
                  className="h-9 rounded-xl border border-input bg-background/80 px-2.5 text-xs text-foreground outline-none"
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
          <form onSubmit={handleGenerate} className="flex flex-col gap-5">
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
                className="w-full sm:w-auto h-11 px-8 rounded-full shadow-md text-sm gap-2"
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
              Curating for {recipientName || "them"}
            </span>
            <span className="text-xs text-muted-foreground leading-relaxed">
              Evaluating compatibility scores, emotional resonance, and artisanal craftsmanship against your ₹{budget.toLocaleString()} budget...
            </span>
          </div>
        </div>
      ) : recommendations.length > 0 ? (
        <div className="flex flex-col gap-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/70 pb-4">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                Curated Recommendations
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                4 tailor-made pieces ranked by emotional resonance for {recipientName}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleGenerate()}
              className="text-xs gap-1.5 rounded-xl self-start sm:self-auto"
            >
              <RotateCcw className="size-3.5" />
              Regenerate Fresh Picks
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((rec) => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                recipientName={recipientName}
                onSaveToPlan={handleSaveToPlan}
              />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Compass}
          badgeText="Atelier Synthesis"
          title="Ready to curate bespoke gifts"
          description="Fill out the consultation form above or choose an inspiration chip. Present Perfect will generate structured, ranked gift recommendations with compatibility scores and envelope notes."
          hintText="Powered by Google Gemini 2.5 Flash."
        />
      )}
    </div>
  )
}
