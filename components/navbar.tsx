"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Gift,
  Menu,
  Sparkles,
  ArrowRight,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Bookmark,
  Settings as SettingsIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/context/auth-context"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/find-gift", label: "Find a Gift" },
  { href: "/recipients", label: "Recipients" },
  { href: "/occasions", label: "Occasions" },
  { href: "/gift-plans", label: "Gift Plans" },
  { href: "/dashboard", label: "Dashboard" },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, loading } = useAuth()
  const [isOpen, setIsOpen] = React.useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (err) {
      console.error("Logout error:", err)
    }
  }

  // Get user initials for avatar fallback
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
    <header className="sticky top-0 sm:top-3 z-40 w-full px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all duration-300">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 rounded-2xl border border-border/80 bg-card/75 backdrop-blur-xl shadow-xs transition-colors">
        {/* Brand Logo with Luxury Monogram */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs transition-all duration-300 group-hover:scale-105 group-hover:shadow-md ring-1 ring-accent/40">
            <Gift data-icon="inline-start" className="size-4.5" />
            <div className="absolute -inset-0.5 -z-10 rounded-xl bg-accent/30 blur-xs opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold tracking-tight text-foreground sm:text-xl">
                Present Perfect
              </span>
              <Badge
                variant="outline"
                className="hidden sm:inline-flex border-accent/60 bg-secondary/50 text-[10px] uppercase tracking-widest text-primary font-medium"
              >
                Atelier
              </Badge>
            </div>
            <span className="text-[10px] text-muted-foreground -mt-1 hidden sm:block tracking-wide">
              Bespoke AI Gifting
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 lg:flex bg-secondary/30 p-1 rounded-full border border-border/40">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href)

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200",
                  isActive
                    ? "bg-card text-foreground font-semibold shadow-xs ring-1 ring-border/60"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Separator orientation="vertical" className="hidden h-5 sm:block" />

          {/* Authenticated vs Guest Desktop UI */}
          <div className="hidden items-center gap-2 sm:flex">
            {!loading && user ? (
              <>
                <Button
                  size="sm"
                  className="text-xs shadow-xs hover:shadow-md transition-all font-medium"
                  render={<Link href="/find-gift" />}
                >
                  <Sparkles data-icon="inline-start" />
                  Find a Gift
                </Button>

                {/* User Dropdown Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <button
                        className="flex size-9 items-center justify-center rounded-full ring-1 ring-border/80 hover:ring-primary transition-all outline-none"
                        aria-label="User account menu"
                      >
                        <Avatar size="sm">
                          {user.photoURL && (
                            <AvatarImage src={user.photoURL} alt={user.displayName || "User"} />
                          )}
                          <AvatarFallback className="bg-secondary text-primary font-semibold text-xs">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    }
                  />
                  <DropdownMenuContent align="end" className="w-56 p-2 bg-card/95 backdrop-blur-xl border border-border/80">
                    <div className="flex flex-col gap-1 p-2">
                      <span className="font-serif font-bold text-sm text-foreground truncate">
                        {user.displayName || "Concierge Member"}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </span>
                    </div>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => router.push("/dashboard")}
                        className="cursor-pointer gap-2 text-xs py-2"
                      >
                        <LayoutDashboard className="size-3.5 text-muted-foreground" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => router.push("/saved-gifts")}
                        className="cursor-pointer gap-2 text-xs py-2"
                      >
                        <Bookmark className="size-3.5 text-muted-foreground" />
                        <span>Saved Gifts</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => router.push("/settings")}
                        className="cursor-pointer gap-2 text-xs py-2"
                      >
                        <SettingsIcon className="size-3.5 text-muted-foreground" />
                        <span>Preferences</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer gap-2 text-xs text-destructive hover:bg-destructive/10 py-2"
                    >
                      <LogOut className="size-3.5" />
                      <span>Log Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-foreground"
                  render={<Link href="/login" />}
                >
                  <UserIcon data-icon="inline-start" />
                  Sign in
                </Button>
                <Button
                  size="sm"
                  className="text-xs shadow-xs hover:shadow-md transition-all font-medium"
                  render={<Link href="/find-gift" />}
                >
                  <Sparkles data-icon="inline-start" />
                  Find a Gift
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-9 rounded-xl border-border/80"
                    aria-label="Open menu"
                  >
                    <Menu data-icon="inline-start" />
                  </Button>
                }
              />
              <SheetContent side="right" className="w-[300px] sm:w-[360px] p-6 bg-card/95 backdrop-blur-xl">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

                <div className="flex flex-col gap-6 pt-4">
                  <div className="flex items-center gap-3 pb-2">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                      <Gift data-icon="inline-start" className="size-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-serif text-lg font-bold text-foreground">
                        Present Perfect
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Bespoke Gifting Concierge
                      </span>
                    </div>
                  </div>

                  {user && (
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/40 border border-border/60">
                      <Avatar size="default">
                        {user.photoURL && (
                          <AvatarImage src={user.photoURL} alt={user.displayName || "User"} />
                        )}
                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xs">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="font-serif font-bold text-sm text-foreground truncate">
                          {user.displayName || "Concierge Member"}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  )}

                  <Separator />

                  <nav className="flex flex-col gap-1.5">
                    {navLinks.map((link) => {
                      const isActive =
                        link.href === "/"
                          ? pathname === "/"
                          : pathname.startsWith(link.href)

                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-secondary text-foreground font-semibold ring-1 ring-border/50"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <span>{link.label}</span>
                          {isActive && (
                            <ArrowRight data-icon="inline-end" className="size-3.5 text-primary" />
                          )}
                        </Link>
                      )
                    })}
                  </nav>

                  <Separator />

                  <div className="flex flex-col gap-2 pt-2">
                    {user ? (
                      <Button
                        variant="outline"
                        className="w-full justify-start text-xs rounded-xl text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          setIsOpen(false)
                          handleLogout()
                        }}
                      >
                        <LogOut data-icon="inline-start" />
                        Log Out
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-xs rounded-xl"
                          onClick={() => setIsOpen(false)}
                          render={<Link href="/login" />}
                        >
                          <UserIcon data-icon="inline-start" />
                          Sign In
                        </Button>
                        <Button
                          className="w-full justify-start text-xs rounded-xl shadow-sm"
                          onClick={() => setIsOpen(false)}
                          render={<Link href="/find-gift" />}
                        >
                          <Sparkles data-icon="inline-start" />
                          Start Gift Finder
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
