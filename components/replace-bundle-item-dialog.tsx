"use client"

import * as React from "react"
import { RefreshCw, Sparkles, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BundleItem } from "@/lib/types/bundle"

interface ReplaceBundleItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemToReplace: BundleItem | null
  currency?: string
  onReplace: (newItem: BundleItem) => Promise<void>
}

export function ReplaceBundleItemDialog({
  open,
  onOpenChange,
  itemToReplace,
  currency = "₹",
  onReplace,
}: ReplaceBundleItemDialogProps) {
  const [newTitle, setNewTitle] = React.useState("")
  const [newPrice, setNewPrice] = React.useState(1500)
  const [newCategory, setNewCategory] = React.useState("Artisanal")
  const [submitting, setSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (itemToReplace) {
      setNewTitle("")
      setNewPrice(itemToReplace.price)
      setNewCategory(itemToReplace.category || "Artisanal")
    }
  }, [itemToReplace, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !itemToReplace) return

    setSubmitting(true)
    try {
      await onReplace({
        id: `rep-${Date.now()}`,
        title: newTitle.trim(),
        price: Number(newPrice) || 0,
        category: newCategory.trim() || "Replacement",
      })
      onOpenChange(false)
    } catch (err) {
      console.error("Replace item error:", err)
    } finally {
      setSubmitting(false)
    }
  }

  if (!itemToReplace) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card p-6 sm:p-8 rounded-3xl border border-border/80 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
            <RefreshCw className="size-4" />
            <span>Harmonious Swap</span>
          </div>
          <DialogTitle className="font-serif text-2xl font-bold text-foreground">
            Replace Bundle Gift
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Replacing &ldquo;{itemToReplace.title}&rdquo; ({currency}{itemToReplace.price.toLocaleString()})
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">New Replacement Item Name *</label>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Hand-Turned Brass Bookmark"
              required
              className="h-10 text-xs bg-background/60 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Estimated Price ({currency}) *</label>
              <Input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
                required
                className="h-10 text-xs bg-background/60 rounded-xl font-mono"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Category</label>
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category"
                className="h-10 text-xs bg-background/60 rounded-xl"
              />
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-xs rounded-xl cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || !newTitle.trim()}
              className="text-xs rounded-xl gap-1.5 cursor-pointer shadow-xs"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Replacing...
                </>
              ) : (
                <>
                  <RefreshCw className="size-3.5" />
                  Confirm Swap
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
