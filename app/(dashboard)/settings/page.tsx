import type { Metadata } from "next"
import { Settings, User, Bell, Palette, Shield } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const metadata: Metadata = {
  title: "Settings — Present Perfect",
  description: "Manage account settings, currency preferences, notification thresholds, and security.",
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Account & Preferences"
        description="Configure your gifting concierge settings, default currency, milestone reminders, and security."
        badgeText="Preferences"
      />

      <div className="flex flex-col gap-6">
        {/* Profile Details */}
        <Card className="border-border/60 bg-card/70">
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
                <Input defaultValue="Heet" className="h-9 bg-background/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground/80">Email Address</label>
                <Input defaultValue="heet@example.com" disabled className="h-9 bg-background/30" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button size="sm">Save Changes</Button>
            </div>
          </CardContent>
        </Card>

        {/* Currency & Gifting Preferences */}
        <Card className="border-border/60 bg-card/70">
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
                <Input defaultValue="INR (₹) - Indian Rupee" className="h-9 bg-background/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-foreground/80">Default Reminder Lead Time</label>
                <Input defaultValue="14 days before occasion" className="h-9 bg-background/50" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications & Security */}
        <Card className="border-border/60 bg-card/70">
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
            <p className="text-xs text-muted-foreground">
              Automated email and push reminders for upcoming dates will be connected with Firestore in Phase 3 & 4.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
