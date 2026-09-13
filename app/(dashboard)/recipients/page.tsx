"use client"

import * as React from "react"
import Link from "next/link"
import {
  Users,
  UserPlus,
  Search,
  Sparkles,
  Calendar,
  Tag,
  Loader2,
  Trash2,
  Edit2,
  ExternalLink,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { RecipientFormDialog } from "@/components/recipient-form-dialog"
import { RecipientDetailDialog } from "@/components/recipient-detail-dialog"
import { useAuth } from "@/context/auth-context"
import { recipientService } from "@/lib/services/recipient-service"
import { Recipient } from "@/lib/types/recipient"

export default function RecipientsPage() {
  const { user } = useAuth()
  const [recipients, setRecipients] = React.useState<Recipient[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")

  // Dialog controls
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [recipientToEdit, setRecipientToEdit] = React.useState<Recipient | null>(null)
  const [selectedRecipient, setSelectedRecipient] = React.useState<Recipient | null>(null)
  const [isDetailOpen, setIsDetailOpen] = React.useState(false)

  const loadRecipients = React.useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await recipientService.getAll(user.uid)
      setRecipients(data)
    } catch (err) {
      console.error("Failed to load recipients:", err)
    } finally {
      setLoading(false)
    }
  }, [user])

  React.useEffect(() => {
    loadRecipients()
  }, [loadRecipients])

  const handleDelete = async (recipientId: string) => {
    if (!user) return
    try {
      await recipientService.delete(user.uid, recipientId)
      setRecipients((prev) => prev.filter((r) => r.id !== recipientId))
      if (selectedRecipient?.id === recipientId) {
        setIsDetailOpen(false)
        setSelectedRecipient(null)
      }
    } catch (err) {
      console.error("Failed to delete recipient:", err)
    }
  }

  const filteredRecipients = recipients.filter((r) => {
    const q = searchQuery.toLowerCase()
    return (
      r.name.toLowerCase().includes(q) ||
      r.relationship.toLowerCase().includes(q) ||
      r.interests?.some((i) => i.toLowerCase().includes(q))
    )
  })

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Recipients Dossier"
        description="Intimate profiles of the people who matter most: quirks, passions, sizing, dislikes, and milestone dates."
        badgeText={`${recipients.length} Dossiers`}
      >
        <Button
          onClick={() => {
            setRecipientToEdit(null)
            setIsFormOpen(true)
          }}
          className="gap-2 shadow-xs"
        >
          <UserPlus data-icon="inline-start" />
          Add Recipient
        </Button>
      </PageHeader>

      {/* Loading state */}
      {loading ? (
        <div className="flex min-h-[35vh] flex-col items-center justify-center gap-3 text-center">
          <Loader2 className="size-8 animate-spin text-primary" />
          <span className="text-xs text-muted-foreground font-serif italic">
            Retrieving recipient dossiers from your private vault...
          </span>
        </div>
      ) : recipients.length === 0 ? (
        <EmptyState
          icon={Users}
          badgeText="Vault Empty"
          title="No recipient dossiers created yet"
          description="Build comprehensive taste profiles so Present Perfect can suggest hyper-personalized gifts. Add your partner, parents, siblings, or best friends."
          action={
            <Button
              onClick={() => {
                setRecipientToEdit(null)
                setIsFormOpen(true)
              }}
              className="gap-2"
            >
              <UserPlus data-icon="inline-start" />
              Add Your First Recipient
            </Button>
          }
          hintText="All profiles are strictly isolated to your private Firebase account."
        />
      ) : (
        <div className="flex flex-col gap-6">
          {/* Search & Filter Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, relationship, or interest..."
              className="h-10 pl-10 bg-card/60"
            />
          </div>

          {filteredRecipients.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/80 p-8 text-center text-xs text-muted-foreground">
              No recipients match your search query &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredRecipients.map((recipient) => {
                const initials = recipient.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)

                const nextDate = recipient.importantDates?.[0]

                return (
                  <Card
                    key={recipient.id}
                    className="group border-border/70 bg-card/85 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    <CardHeader className="p-5 pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary/80 text-primary font-serif font-bold text-base ring-1 ring-border/60 shadow-xs group-hover:scale-105 transition-transform">
                            {initials}
                          </div>
                          <div className="flex flex-col">
                            <CardTitle className="font-serif text-lg font-bold text-foreground">
                              {recipient.name}
                            </CardTitle>
                            <span className="text-xs text-muted-foreground">
                              {recipient.relationship}
                            </span>
                          </div>
                        </div>

                        <Badge variant="outline" className="border-accent/80 text-[10px]">
                          {recipient.ageGroup || "Adult"}
                        </Badge>
                      </div>

                      {/* Next Milestone */}
                      {nextDate && (
                        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground bg-secondary/30 p-2 rounded-xl border border-border/40">
                          <Calendar className="size-3 text-primary" />
                          <span className="font-medium text-foreground">{nextDate.title}:</span>
                          <span className="font-mono">{nextDate.date}</span>
                        </div>
                      )}
                    </CardHeader>

                    <CardContent className="p-5 pt-0 flex flex-col gap-2.5">
                      {/* Interest Pills */}
                      {recipient.interests && recipient.interests.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {recipient.interests.slice(0, 4).map((interest) => (
                            <span
                              key={interest}
                              className="rounded-md bg-secondary/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground border border-border/40"
                            >
                              {interest}
                            </span>
                          ))}
                          {recipient.interests.length > 4 && (
                            <span className="rounded-md bg-secondary/40 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                              +{recipient.interests.length - 4}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Personal Notes Snippet */}
                      {recipient.personalNotes && (
                        <p className="text-[11px] text-muted-foreground line-clamp-2 italic">
                          &ldquo;{recipient.personalNotes}&rdquo;
                        </p>
                      )}
                    </CardContent>

                    <CardFooter className="p-5 pt-2 border-t border-border/50 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setSelectedRecipient(recipient)
                          setIsDetailOpen(true)
                        }}
                        className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                      >
                        <span>View Dossier</span>
                        <ExternalLink className="size-3" />
                      </button>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-foreground"
                          onClick={() => {
                            setRecipientToEdit(recipient)
                            setIsFormOpen(true)
                          }}
                          title="Edit"
                        >
                          <Edit2 className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-destructive"
                          onClick={() => {
                            if (recipient.id) handleDelete(recipient.id)
                          }}
                          title="Delete"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Recipient Form Modal (Add / Edit) */}
      <RecipientFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        recipientToEdit={recipientToEdit}
        onSuccess={loadRecipients}
      />

      {/* Recipient Detail Modal */}
      <RecipientDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        recipient={selectedRecipient}
        onEdit={(rec) => {
          setRecipientToEdit(rec)
          setIsFormOpen(true)
        }}
        onDelete={handleDelete}
      />
    </div>
  )
}
