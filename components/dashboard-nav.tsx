"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Sparkles,
  Users,
  Calendar,
  ClipboardList,
  Bookmark,
  History,
  Settings,
  ChevronRight,
  LogOut,
  Layers,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/context/auth-context"
import { cn } from "@/lib/utils"

export const dashboardNavItems = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        badge: null,
      },
      {
        title: "Find a Gift",
        href: "/find-gift",
        icon: Sparkles,
        badge: "AI",
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Recipients",
        href: "/recipients",
        icon: Users,
        badge: null,
      },
      {
        title: "Occasions",
        href: "/occasions",
        icon: Calendar,
        badge: null,
      },
      {
        title: "Gift Plans",
        href: "/gift-plans",
        icon: ClipboardList,
        badge: null,
      },
      {
        title: "Gift Bundles",
        href: "/gift-bundles",
        icon: Layers,
        badge: "New",
      },
    ],
  },
  {
    title: "Archive & Setup",
    items: [
      {
        title: "Saved Gifts",
        href: "/saved-gifts",
        icon: Bookmark,
        badge: null,
      },
      {
        title: "Gift History",
        href: "/gift-history",
        icon: History,
        badge: null,
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
        badge: null,
      },
    ],
  },
]

export function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (err) {
      console.error("Logout error:", err)
    }
  }

  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "PP"

  return (
    <aside className="w-64 shrink-0 hidden md:block">
      <div className="sticky top-24 flex flex-col gap-6 rounded-3xl border border-border/80 bg-card/80 p-5 backdrop-blur-xl shadow-xs">
        {dashboardNavItems.map((group) => (
          <div key={group.title} className="flex flex-col gap-1.5">
            <span className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {group.title}
            </span>
            <nav className="flex flex-col gap-1">
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                        : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={cn(
                          "size-4 shrink-0 transition-colors",
                          isActive
                            ? "text-primary-foreground"
                            : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                      <span>{item.title}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <Badge
                          variant={isActive ? "outline" : "secondary"}
                          className={cn(
                            "px-1.5 py-0 text-[10px]",
                            isActive
                              ? "border-primary-foreground/40 text-primary-foreground"
                              : "border-accent/40 text-primary font-semibold"
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                      {isActive && (
                        <ChevronRight className="size-3.5 text-primary-foreground/80" />
                      )}
                    </div>
                  </Link>
                )
              })}
            </nav>
          </div>
        ))}

        {/* User Session Footer Card */}
        {user && (
          <div className="flex flex-col gap-3 pt-2 border-t border-border/60">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar size="sm">
                  {user.photoURL && (
                    <AvatarImage src={user.photoURL} alt={user.displayName || "User"} />
                  )}
                  <AvatarFallback className="bg-secondary text-primary font-semibold text-[11px]">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-serif font-bold text-foreground truncate">
                    {user.displayName || "Concierge Member"}
                  </span>
                  <span className="text-[11px] text-muted-foreground truncate">
                    {user.email}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Log out"
                className="flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0"
              >
                <LogOut className="size-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
