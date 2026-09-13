import * as React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface PageHeaderProps {
  title: string
  description?: string
  badgeText?: string
  breadcrumbs?: { label: string; href?: string }[]
  children?: React.ReactNode
}

export function PageHeader({
  title,
  description,
  badgeText,
  breadcrumbs,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3.5 pb-6 border-b border-border/70">
      {/* Optional Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1
            return (
              <React.Fragment key={crumb.label}>
                {idx > 0 && <ChevronRight className="size-3 text-muted-foreground/50" />}
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={isLast ? "text-foreground font-medium" : ""}>
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            )
          })}
        </nav>
      )}

      {/* Main Header Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>
            {badgeText && (
              <Badge
                variant="outline"
                className="border-accent/80 bg-secondary/40 text-[11px] uppercase tracking-wider text-primary font-medium"
              >
                {badgeText}
              </Badge>
            )}
          </div>
          {description && (
            <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Action Slot */}
        {children && <div className="flex items-center gap-2.5 shrink-0">{children}</div>}
      </div>
    </div>
  )
}
