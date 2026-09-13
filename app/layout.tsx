import type { Metadata } from "next"
import { Cormorant_Garamond, Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProvider } from "@/context/auth-context"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Present Perfect — Bespoke AI Gift Recommendation Concierge",
  description:
    "Discover gifts they will genuinely cherish. Present Perfect uses AI to analyze personalities, milestones, and personal nuances to curate unforgettable gifts.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable, cormorant.variable)}
    >
      <body className="min-h-screen bg-background text-foreground selection:bg-accent/30 selection:text-foreground">
        <ThemeProvider>
          <AuthProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

