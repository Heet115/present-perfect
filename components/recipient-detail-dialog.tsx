"use client"

import * as React from "react"
import Link from "next/link"
import {
  Calendar,
  Sparkles,
  Heart,
  Tag,
  Edit2,
  Trash2,
  AlertTriangle,
  Info,
  Gift,
  ThumbsDown,
  Clock,
  History,
  Bookmark,
  Feather,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/auth-context"
import { giftHistoryService } from "@/lib/services/gift-history-service"
import { savedGiftService } from "@/lib/services/saved-gift-service"
import { Recipient } from "@/lib/types/recipient"
import { GiftHistoryItem } from "@/lib/types/gift-history"
import { SavedGift } from "@/lib/types/saved-gift"
import { PersonalCardDialog } from "@/components/personal-card-dialog"

interface RecipientDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  recipient: Recipient | null
  onEdit: (recipient: Recipient) => void
  onDelete: (recipientId: string) => void
}

export function RecipientDetailDialog({
  open,
  onOpenChange,
  recipient,
  onEdit,
  onDelete,
}: RecipientDetailDialogProps) {
  const { user } = useAuth()
  const [showConfirmDelete, setShowConfirmDelete] = React.useState(false)
  const [isCardOpen, setIsCardOpen] = React.useState(false)
  const [pastGifts, setPastGifts] = React.useState<GiftHistoryItem[]>([])
  const [vaultGifts, setVaultGifts] = React.useState<SavedGift[]>([])
  const [loadingHistory, setLoadingHistory] = React.useState(false)

  React.useEffect(() => {
    if (!open || !user || !recipient?.id) return
    setLoadingHistory(true)
    Promise.all([
      giftHistoryService.getAll(user.uid, recipient.id),
      savedGiftService.getAll(user.uid),
    ])
      .then(([historyList, savedList]) => {
        setPastGifts(historyList)
        const matchedVault = savedList.filter(
          (s) =>
            s.recipientId === recipient.id ||
            s.recipientName?.toLowerCase() === recipient.name.toLowerCase()
        )
        setVaultGifts(matchedVault)
      })
      .catch(console.error)
      .finally(() => setLoadingHistory(false))
  }, [open, user, recipient])

  if (!recipient) return null

  const initials = recipient.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto bg-card p-6 sm:p-8 rounded-3xl border border-border/80 shadow-2xl">
        <DialogHeader className="pb-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary/80 text-primary font-serif font-bold text-xl ring-1 ring-border/60 shadow-xs">
                {initials}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <DialogTitle className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
                    {recipient.name}
                  </DialogTitle>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <Badge variant="secondary" className="text-[11px] font-medium border-border/60">
                    {recipient.relationship}
                  </Badge>
                  {recipient.ageGroup && <span>• {recipient.ageGroup}</span>}
                </div>
              </div>
            </div>

            <Button
              size="sm"
              className="text-xs gap-1.5 shadow-xs shrink-0"
              render={<Link href={`/find-gift?recipient=${encodeURIComponent(recipient.name)}`} />}
            >
              <Sparkles className="size-3.5" />
              Find a Gift
            </Button>
          </div>
        </DialogHeader>

        <Separator className="my-2" />

        <div className="flex flex-col gap-5 py-2 text-xs">
          {/* Interests & Passions */}
          {recipient.interests && recipient.interests.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="font-semibold uppercase tracking-wider text-muted-foreground text-[10px]">
                Passions & Interests
              </span>
              <div className="flex flex-wrap gap-1.5">
                {recipient.interests.map((item) => (
                  <Badge key={item} variant="secondary" className="px-2.5 py-1 border border-border/50">
                    <Tag className="size-3 mr-1 text-primary" />
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Personality Traits */}
          {recipient.personalityTraits && recipient.personalityTraits.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="font-semibold uppercase tracking-wider text-muted-foreground text-[10px]">
                Personality Traits
              </span>
              <div className="flex flex-wrap gap-1.5">
                {recipient.personalityTraits.map((trait) => (
                  <Badge key={trait} variant="outline" className="px-2.5 py-1 border-accent/80 text-foreground/90">
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Favorites & Dislikes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recipient.favoriteThings && recipient.favoriteThings.length > 0 && (
              <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-secondary/30 border border-border/60">
                <div className="flex items-center gap-1.5 font-semibold text-foreground text-[11px]">
                  <Heart className="size-3.5 text-primary" />
                  <span>Loved Brands / Items</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {recipient.favoriteThings.map((fav) => (
                    <Badge key={fav} variant="secondary" className="text-[10px]">
                      {fav}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {recipient.dislikes && recipient.dislikes.length > 0 && (
              <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-destructive/5 border border-destructive/20">
                <div className="flex items-center gap-1.5 font-semibold text-destructive text-[11px]">
                  <ThumbsDown className="size-3.5" />
                  <span>Strictly Avoid</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {recipient.dislikes.map((dislike) => (
                    <Badge key={dislike} variant="outline" className="text-[10px] text-destructive border-destructive/30">
                      {dislike}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Important Dates */}
          {recipient.importantDates && recipient.importantDates.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="font-semibold uppercase tracking-wider text-muted-foreground text-[10px] flex items-center gap-1">
                <Calendar className="size-3 text-primary" />
                <span>Important Dates & Milestones</span>
              </span>
              <div className="flex flex-col gap-1.5">
                {recipient.importantDates.map((date) => (
                  <div
                    key={date.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/20 border border-border/40"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="size-3.5 text-primary" />
                      <span className="font-serif font-bold text-foreground text-sm">{date.title}</span>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">{date.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Phase 8: Recipient-Wise Gift History */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold uppercase tracking-wider text-muted-foreground text-[10px] flex items-center gap-1">
                <History className="size-3 text-primary" />
                <span>Gift History ({pastGifts.length})</span>
              </span>
              <Link
                href="/gift-history"
                className="text-[10px] text-primary hover:underline font-medium"
              >
                Open Archive →
              </Link>
            </div>

            {pastGifts.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                {pastGifts.map((pg) => (
                  <div
                    key={pg.id}
                    className="p-2.5 rounded-xl bg-secondary/20 border border-border/40 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{pg.giftName}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {pg.occasion} • {pg.giftDate}
                      </span>
                    </div>
                    <span className="font-serif font-bold text-foreground shrink-0">
                      {pg.currency || "₹"}{pg.giftPrice.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-secondary/10 border border-border/30 text-center text-xs text-muted-foreground">
                No previous gifts recorded for {recipient.name} yet.
              </div>
            )}
          </div>

          {/* Phase 8: Bookmarked in Vault */}
          {vaultGifts.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold uppercase tracking-wider text-muted-foreground text-[10px] flex items-center gap-1">
                  <Bookmark className="size-3 text-primary" />
                  <span>Bookmarked in Vault ({vaultGifts.length})</span>
                </span>
                <Link
                  href="/saved-gifts"
                  className="text-[10px] text-primary hover:underline font-medium"
                >
                  View Vault →
                </Link>
              </div>

              <div className="flex flex-col gap-1.5">
                {vaultGifts.map((vg) => (
                  <div
                    key={vg.id}
                    className="p-2.5 rounded-xl bg-secondary/20 border border-border/40 flex items-center justify-between gap-2 text-xs"
                  >
                    <span className="font-medium text-foreground truncate">
                      {vg.recommendation.name}
                    </span>
                    <span className="font-serif font-bold text-foreground shrink-0">
                      {vg.recommendation.currency}
                      {vg.recommendation.estimatedPrice.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sizing & Aesthetic */}
          {(recipient.preferences?.sizing || recipient.preferences?.preferredVibe) && (
            <div className="p-3 rounded-2xl bg-secondary/20 border border-border/40 flex flex-col gap-1 text-xs">
              {recipient.preferences?.sizing && (
                <div>
                  <span className="font-semibold text-foreground">Sizing/Fit: </span>
                  <span className="text-muted-foreground">{recipient.preferences.sizing}</span>
                </div>
              )}
              {recipient.preferences?.preferredVibe && (
                <div>
                  <span className="font-semibold text-foreground">Aesthetic/Vibe: </span>
                  <span className="text-muted-foreground">{recipient.preferences.preferredVibe}</span>
                </div>
              )}
            </div>
          )}

          {/* Personal Notes */}
          {recipient.personalNotes && (
            <div className="flex flex-col gap-1.5 p-3.5 rounded-2xl bg-secondary/30 border border-border/50">
              <span className="font-semibold uppercase tracking-wider text-muted-foreground text-[10px] flex items-center gap-1">
                <Info className="size-3 text-primary" />
                <span>Personal Notes</span>
              </span>
              <p className="text-muted-foreground leading-relaxed text-xs italic">
                &ldquo;{recipient.personalNotes}&rdquo;
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 border-t border-border/60">
          {showConfirmDelete ? (
            <div className="flex items-center gap-2 w-full justify-between">
              <span className="text-xs text-destructive flex items-center gap-1">
                <AlertTriangle className="size-3.5" />
                Are you certain?
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConfirmDelete(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (recipient.id) {
                      onDelete(recipient.id)
                      onOpenChange(false)
                    }
                  }}
                  className="text-xs"
                >
                  Confirm Delete
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConfirmDelete(true)}
                className="text-destructive hover:bg-destructive/10 text-xs gap-1.5"
              >
                <Trash2 className="size-3.5" />
                Delete Dossier
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onOpenChange(false)
                    onEdit(recipient)
                  }}
                  className="text-xs gap-1.5"
                >
                  <Edit2 className="size-3.5" />
                  Edit Dossier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCardOpen(true)}
                  className="text-xs gap-1.5 cursor-pointer"
                >
                  <Feather className="size-3.5 text-primary" />
                  Compose Card
                </Button>
                <Button
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  className="text-xs cursor-pointer"
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogFooter>

        <PersonalCardDialog
          open={isCardOpen}
          onOpenChange={setIsCardOpen}
          initialRecipientName={recipient.name}
          initialOccasion={recipient.importantDates?.[0]?.title}
        />
      </DialogContent>
    </Dialog>
  )
}
