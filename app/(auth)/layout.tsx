import * as React from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">{children}</div>
      </main>
      <Footer />
    </div>
  )
}
