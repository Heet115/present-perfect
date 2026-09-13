"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { User, Bell, Palette, LogOut, Sparkles } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/auth-context"

export default function SettingsPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [displayName, setDisplayName] = React.useState(user?.displayName || "")

  React.useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName)
    }
  }, [user])

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (err) {
      console.error("Logout error:", err)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Account & Preferences"
        description="Configure your gifting concierge settings, default currency, milestone reminders, and security."
        badgeText="Preferences"
      />

      <div className="flex flex-col gap-6">
        {/* Profile Details */}
        <Card className="border-border/70 bg-card/75 shadow-xs">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="size-4 text-primary" />
              <CardTitle className="text-base font-semibold">Profile Information</CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Your personal details used for card sign-offs and account identification
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground/80">Display Name</label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your Name"
                  className="h-10 bg-background/50"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground/80">Email Address</label>
                <Input
                  value={user?.email || ""}
                  disabled
                  className="h-10 bg-background/30 text-muted-foreground"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Currency & Gifting Preferences */}
        <Card className="border-border/70 bg-card/75 shadow-xs">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="size-4 text-primary" />
              <CardTitle className="text-base font-semibold">Gifting Preferences</CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Configure default currency and recommendation preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground/80">Default Currency</label>
                <Input defaultValue="INR (₹) - Indian Rupee" className="h-10 bg-background/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground/80">Default Reminder Lead Time</label>
                <Input defaultValue="14 days before occasion" className="h-10 bg-background/50" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications & Security */}
        <Card className="border-border/70 bg-card/75 shadow-xs">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="size-4 text-primary" />
              <CardTitle className="text-base font-semibold">Occasion Alerts</CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Stay ahead of birthdays and anniversaries without stress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Automated milestone reminders will synchronize with your Firestore database in Phase 3 & 4.
            </p>
          </CardContent>
        </Card>

        {/* Sign Out Card */}
        <Card className="border-destructive/30 bg-destructive/5 shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-destructive">Account Session</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Log out of your personal gifting concierge session on this device
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="gap-2 text-xs"
            >
              <LogOut data-icon="inline-start" className="size-4" />
              Sign Out of Present Perfect
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
