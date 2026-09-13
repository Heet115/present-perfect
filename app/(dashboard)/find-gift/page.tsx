import type { Metadata } from "next"
import { Sparkles, Compass, Lightbulb } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Find a Gift — Present Perfect",
  description: "Natural language AI gift finder. Describe recipient personality, hobbies, and budget.",
}

const samplePrompts = [
  "My best friend is 21, loves photography, coffee and travelling. Budget ₹3,000.",
  "Sister graduating law school, loves minimalist jewelry and espresso. Budget ₹5,000.",
  "Dad turning 60, passionate about woodworking and historical biographies. Budget ₹4,500.",
  "Coworker farewell gift, enjoys artisan teas and desk organization. Budget ₹1,500.",
]

export default function FindGiftPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="AI Gift Finder"
        description="Describe who you are shopping for naturally. Include their passions, quirks, relationship, and budget."
        badgeText="Natural Language AI"
      />

      {/* Input Preview Card */}
      <Card className="border-border/70 bg-card/80 shadow-sm backdrop-blur-xs">
        <CardContent className="flex flex-col gap-4 p-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            <span>Describe the recipient</span>
          </div>

          <div className="relative">
            <textarea
              readOnly
              value="My best friend is 21, loves photography, coffee and travelling, and doesn't like romantic gifts. My budget is ₹3000."
              rows={3}
              className="w-full resize-none rounded-xl border border-input bg-background/50 p-3.5 text-sm text-foreground/90 outline-none focus:border-ring focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lightbulb className="size-3 text-primary" />
              <span>Inspiration chips (click to explore prompts):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((prompt, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="cursor-pointer border-accent/40 bg-secondary/60 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  {prompt}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button disabled className="gap-2">
              <Sparkles data-icon="inline-start" />
              Generate Curated Gifts (Phase 5)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Feed Placeholder */}
      <EmptyState
        icon={Compass}
        badgeText="Recommendation Engine"
        title="Ready to curate bespoke gifts"
        description="Once the AI recommendation engine is connected in Phase 5 & 6, you will receive ranked matches with compatibility scores, why-recommended breakdowns, and alternative ideas."
        hintText="AI API Integration will be implemented in Phase 5."
      />
    </div>
  )
}
