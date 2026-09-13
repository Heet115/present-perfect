"use client"

import * as React from "react"
import { Layers, Sparkles, Plus, Trash2, Loader2 } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { Recipient } from "@/lib/types/recipient"
import { GiftBundle, BundleItem } from "@/lib/types/bundle"

interface CreateBundleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  recipients: Recipient[]
  onSubmit: (data: Omit<GiftBundle, "id" | "userId" | "createdAt" | "updatedAt">) => Promise<void>
}

export function CreateBundleDialog({
  open,
  onOpenChange,
  recipients,
  onSubmit,
}: CreateBundleDialogProps) {
  const [title, setTitle] = React.useState("")
  const [selectedRecipientId, setSelectedRecipientId] = React.useState(recipients[0]?.id || "")
  const [customRecipientName, setCustomRecipientName] = React.useState(recipients[0]?.name || "")
  const [targetBudget, setTargetBudget] = React.useState(6000)
  const [currency, setCurrency] = React.useState("₹")
  const [items, setItems] = React.useState<{ title: string; price: number; category: string }[]>([
    { title: "Artisan Pour-Over Ceramic Dripper", price: 2200, category: "Functional Art" },
    { title: "Estate Single-Origin Coffee Beans (250g)", price: 850, category: "Gourmet" },
  ])
  const [newItemTitle, setNewItemTitle] = React.useState("")
  const [newItemPrice, setNewItemPrice] = React.useState(1500)
  const [newItemCategory, setNewItemCategory] = React.useState("Keepsake")
  const [submitting, setSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (recipients.length > 0 && !selectedRecipientId) {
      setSelectedRecipientId(recipients[0].id || "")
      setCustomRecipientName(recipients[0].name)
    }
  }, [recipients, selectedRecipientId])

  const handleRecipientChange = (id: string) => {
    setSelectedRecipientId(id)
    const found = recipients.find((r) => r.id === id)
    if (found) {
      setCustomRecipientName(found.name)
    }
  }

  const handleAddItem = () => {
    if (!newItemTitle.trim()) return
    setItems((prev) => [
      ...prev,
      {
        title: newItemTitle.trim(),
        price: Number(newItemPrice) || 0,
        category: newItemCategory.trim() || "Gift Item",
      },
    ])
    setNewItemTitle("")
    setNewItemPrice(1000)
  }

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const totalPrice = items.reduce((sum, item) => sum + (item.price || 0), 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || items.length === 0) return

    const recipientName =
      selectedRecipientId && selectedRecipientId !== "custom"
        ? recipients.find((r) => r.id === selectedRecipientId)?.name || customRecipientName
        : customRecipientName || "Someone Special"

    setSubmitting(true)
    try {
      await onSubmit({
        title: title.trim(),
        recipientId: selectedRecipientId || undefined,
        recipientName,
        targetBudget: Number(targetBudget) || 0,
        currency,
        items: items.map((i, idx) => ({
          id: `item-${Date.now()}-${idx}`,
          title: i.title,
          price: i.price,
          category: i.category,
        })),
      })
      onOpenChange(false)
      setTitle("")
      setItems([])
    } catch (err) {
      console.error("Create bundle error:", err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-card p-6 sm:p-8 rounded-3xl border border-border/80 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-1">
            <Layers className="size-4" />
            <span>Curate Bundle</span>
          </div>
          <DialogTitle className="font-serif text-2xl font-bold text-foreground">
            Create Curated Gift Bundle
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Assemble multiple complementary gifts into a unified, harmonious presentation experience.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">Bundle Name *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Morning Sanctuary Kit, Paris Memories Hamper"
              required
              className="h-10 text-xs bg-background/60 rounded-xl"
            />
          </div>

          {/* Recipient and Target Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Recipient *</label>
              {recipients.length > 0 ? (
                <select
                  value={selectedRecipientId}
                  onChange={(e) => handleRecipientChange(e.target.value)}
                  className="h-10 rounded-xl border border-input bg-background/60 px-3 text-xs text-foreground outline-none cursor-pointer"
                >
                  {recipients.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.relationship})
                    </option>
                  ))}
                  <option value="custom">Other / Custom</option>
                </select>
              ) : (
                <Input
                  value={customRecipientName}
                  onChange={(e) => setCustomRecipientName(e.target.value)}
                  placeholder="Recipient Name"
                  required
                  className="h-10 text-xs bg-background/60 rounded-xl"
                />
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">Target Budget (₹) *</label>
              <Input
                type="number"
                value={targetBudget}
                onChange={(e) => setTargetBudget(parseFloat(e.target.value) || 0)}
                min="500"
                step="250"
                required
                className="h-10 text-xs bg-background/60 rounded-xl font-mono"
              />
            </div>
          </div>

          {/* Items In Bundle */}
          <div className="flex flex-col gap-2 pt-2 border-t border-border/60">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">
                Bundle Items ({items.length})
              </span>
              <span className="font-mono text-xs">
                Total: <strong>{currency}{totalPrice.toLocaleString()}</strong> / {currency}{targetBudget.toLocaleString()}
              </span>
            </div>

            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/30 border border-border/50 text-xs"
              >
                <div>
                  <span className="font-medium text-foreground block">{item.title}</span>
                  <span className="text-[10px] text-muted-foreground">{item.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-foreground">
                    {currency}{item.price.toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="text-muted-foreground hover:text-destructive cursor-pointer p-1"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {/* Add Item Row */}
            <div className="flex flex-col sm:flex-row gap-2 mt-1 p-2.5 rounded-2xl bg-secondary/15 border border-border/40">
              <Input
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                placeholder="Gift item name"
                className="h-8 text-xs bg-background/70 rounded-lg flex-1"
              />
              <Input
                type="number"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(parseFloat(e.target.value) || 0)}
                placeholder="Price"
                className="h-8 text-xs bg-background/70 rounded-lg w-24 font-mono"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleAddItem}
                className="h-8 text-xs rounded-lg gap-1 shrink-0 cursor-pointer"
              >
                <Plus className="size-3" />
                <span>Add Item</span>
              </Button>
            </div>
          </div>

          <DialogFooter className="mt-3">
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
              disabled={submitting || !title.trim() || items.length === 0}
              className="text-xs rounded-xl gap-1.5 cursor-pointer shadow-xs"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="size-3.5" />
                  Assemble Bundle
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
