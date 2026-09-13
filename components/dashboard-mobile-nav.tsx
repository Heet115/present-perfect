"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { dashboardNavItems } from "@/components/dashboard-nav"
import { cn } from "@/lib/utils"

export function DashboardMobileNav() {
  const pathname = usePathname()
  const allItems = dashboardNavItems.flatMap((g) => g.items)

  return (
    <div className="md:hidden -mx-4 px-4 pb-3 overflow-x-auto scrollbar-none">
      <div className="flex items-center gap-1.5 min-w-max">
        {allItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "bg-card/70 border border-border/60 text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-3.5" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
