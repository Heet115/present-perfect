import * as React from "react"
import { LucideIcon, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  badgeText?: string
  action?: React.ReactNode
  hintText?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  badgeText,
  action,
  hintText,
}: EmptyStateProps) {
  return (
    <Card className="relative overflow-hidden rounded-3xl border border-dashed border-border/80 bg-card/60 shadow-xs backdrop-blur-xs transition-all">
      {/* Delicate Warm Gradient Wash in Background */}
      <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-16 size-48 rounded-full bg-secondary/30 blur-3xl" />

      <CardContent className="flex flex-col items-center justify-center py-20 px-6 text-center relative z-10">
        {/* Warm Icon Monogram Halo */}
        <div className="relative mb-5 flex size-16 items-center justify-center rounded-2xl bg-secondary/80 text-primary shadow-xs ring-1 ring-border/70">
          <Icon className="size-7" />
          <div className="absolute -inset-1.5 -z-10 rounded-2xl bg-accent/30 blur-sm" />
        </div>

        {badgeText && (
          <Badge
            variant="outline"
            className="mb-3 border-accent/80 bg-secondary/40 text-[10px] uppercase tracking-widest text-primary font-medium"
          >
            {badgeText}
          </Badge>
        )}

        <h3 className="font-serif text-2xl font-bold text-foreground tracking-tight sm:text-3xl">
          {title}
        </h3>

        <p className="mt-2.5 max-w-md text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>

        {action && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {action}
          </div>
        )}

        {hintText && (
          <div className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-secondary/30 px-3 py-1 text-xs text-muted-foreground/80 font-mono">
            <Sparkles className="size-3 text-primary/70" />
            <span>{hintText}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
