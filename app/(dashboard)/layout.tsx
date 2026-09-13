import * as React from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { DashboardNav } from "@/components/dashboard-nav"
import { DashboardMobileNav } from "@/components/dashboard-mobile-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <DashboardMobileNav />

          <div className="flex items-start gap-8">
            <DashboardNav />
            <div className="min-w-0 flex-1">{children}</div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
