"use client"

import * as React from "react"
import Link from "next/link"
import {
  Layers,
  Sparkles,
  Plus,
  Trash2,
  RefreshCw,
  Package,
  Wallet,
  Loader2,
  Gift,
  Coins,
  ArrowRight,
  ExternalLink,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/auth-context"
import { bundleService } from "@/lib/services/bundle-service"
import { recipientService } from "@/lib/services/recipient-service"
import { CreateBundleDialog } from "@/components/create-bundle-dialog"
import { ReplaceBundleItemDialog } from "@/components/replace-bundle-item-dialog"
import { PresentationDrawer } from "@/components/presentation-drawer"
import { GiftBundle, BundleItem, PresentationIdea } from "@/lib/types/bundle"
import { Recipient } from "@/lib/types/recipient"

export default function GiftBundlesPage() {
  const { user } = useAuth()
  const [bundles, setBundles] = React.useState<GiftBundle[]>([])
  const [recipients, setRecipients] = React.useState<Recipient[]>([])
  const [loading, setLoading] = React.useState(true)
  const [notification, setNotification] = React.useState<string | null>(null)

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [activeBundleForPresentation, setActiveBundleForPresentation] = React.useState<GiftBundle | null>(null)
  const [activeItemForReplace, setActiveItemForReplace] = React.useState<{ bundleId: string; item: BundleItem } | null>(null)

  // Inline add item state map (bundleId -> { title, price })
  const [addingToBundleId, setAddingToBundleId] = React.useState<string | null>(null)
  const [inlineTitle, setInlineTitle] = React.useState("")
  const [inlinePrice, setInlinePrice] = React.useState(1000)

  const loadData = React.useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const [bundlesData, recipientsData] = await Promise.all([
        bundleService.getAll(user.uid),
        recipientService.getAll(user.uid),
      ])
      setBundles(bundlesData)
      setRecipients(recipientsData)
    } catch (err) {
      console.error("Failed to load bundles:", err)
    } finally {
      setLoading(false)
    }
  }, [user])

  React.useEffect(() => {
    loadData()
  }, [loadData])

  const handleCreateBundle = async (data: Omit<GiftBundle, "id" | "userId" | "createdAt" | "updatedAt">) => {
    if (!user) return
    await bundleService.create(user.uid, data)
    setNotification(`Created gift bundle "${data.title}"!`)
    setTimeout(() => setNotification(null), 3500)
    await loadData()
  }

  const handleDeleteBundle = async (bundleId: string, title: string) => {
    if (!user) return
    try {
      await bundleService.delete(user.uid, bundleId)
      setBundles((prev) => prev.filter((b) => b.id !== bundleId))
      setNotification(`Deleted bundle "${title}".`)
      setTimeout(() => setNotification(null), 3000)
    } catch (err) {
      console.error("Delete bundle error:", err)
    }
  }

  const handleRemoveItem = async (bundleId: string, itemId: string) => {
    if (!user) return
    try {
      await bundleService.removeItem(user.uid, bundleId, itemId)
      setBundles((prev) =>
        prev.map((b) => {
          if (b.id === bundleId) {
            return {
              ...b,
              items: b.items.filter((i) => i.id !== itemId),
            }
          }
          return b
        })
      )
    } catch (err) {
      console.error("Remove item error:", err)
    }
  }

  const handleReplaceItem = async (newItem: BundleItem) => {
    if (!user || !activeItemForReplace) return
    const { bundleId, item: oldItem } = activeItemForReplace
    try {
      await bundleService.replaceItem(user.uid, bundleId, oldItem.id, newItem)
      setBundles((prev) =>
        prev.map((b) => {
          if (b.id === bundleId) {
            return {
              ...b,
              items: b.items.map((i) => (i.id === oldItem.id ? newItem : i)),
            }
          }
          return b
        })
      )
      setNotification(`Swapped "${oldItem.title}" with "${newItem.title}".`)
      setTimeout(() => setNotification(null), 3000)
    } catch (err) {
      console.error("Replace error:", err)
    }
  }

  const handleInlineAddItem = async (bundleId: string) => {
    if (!user || !inlineTitle.trim()) return
    try {
      const newItem: BundleItem = {
        id: `item-${Date.now()}`,
        title: inlineTitle.trim(),
        price: Number(inlinePrice) || 0,
        category: "Artisanal",
      }
      await bundleService.addItem(user.uid, bundleId, newItem)
      setBundles((prev) =>
        prev.map((b) => (b.id === bundleId ? { ...b, items: [...b.items, newItem] } : b))
      )
      setAddingToBundleId(null)
      setInlineTitle("")
      setInlinePrice(1000)
    } catch (err) {
      console.error("Add item error:", err)
    }
  }

  const handleSavePresentation = async (bundleId: string, presentation: PresentationIdea) => {
    if (!user) return
    try {
      await bundleService.updatePresentation(user.uid, bundleId, presentation)
      setBundles((prev) =>
        prev.map((b) => (b.id === bundleId ? { ...b, presentation } : b))
      )
    } catch (err) {
      console.error("Save presentation error:", err)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Gift Bundles & Presentation"
        description="Assemble harmonious multi-gift collections, optimize total spend, and unlock artisanal packaging & unboxing rituals."
        badgeText={`${bundles.length} Active Bundles`}
      >
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="gap-2 shadow-xs cursor-pointer"
        >
          <Plus data-icon="inline-start" />
          Create Gift Bundle
        </Button>
      </PageHeader>

      {/* Notification banner */}
      {notification && (
        <div className="flex items-center gap-2 rounded-2xl bg-secondary/80 border border-accent/80 p-4 text-xs font-semibold text-foreground shadow-sm animate-in fade-in duration-200">
          <Sparkles className="size-4 text-primary" />
          <span>{notification}</span>
        </div>
      )}

      {/* Bundles Grid */}
      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : bundles.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bundles.map((bundle) => {
            const totalPrice = bundle.items.reduce((sum, item) => sum + (item.price || 0), 0)
            const currency = bundle.currency || "₹"
            const percentage = bundle.targetBudget > 0 ? Math.min(Math.round((totalPrice / bundle.targetBudget) * 100), 100) : 0
            const diff = bundle.targetBudget - totalPrice
            const isOver = diff < 0

            return (
              <Card
                key={bundle.id}
                className="group relative overflow-hidden rounded-3xl border border-border/80 bg-card/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Decorative Gradient Header */}
                <div className="h-1.5 w-full bg-linear-to-r from-warm-mocha via-warm-sand to-warm-parchment" />

                <CardHeader className="p-6 pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Badge
                        variant="secondary"
                        className="text-[10px] uppercase font-semibold tracking-wider text-primary"
                      >
                        Curated Bundle for {bundle.recipientName}
                      </Badge>
                      <CardTitle className="font-serif text-2xl font-bold text-foreground mt-1.5 leading-snug">
                        {bundle.title}
                      </CardTitle>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDeleteBundle(bundle.id, bundle.title)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl cursor-pointer"
                      title="Delete bundle"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>

                  {/* Budget Optimization Tracker */}
                  <div className="mt-4 p-3.5 rounded-2xl bg-secondary/30 border border-border/50 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-semibold text-foreground">
                        <Wallet className="size-3.5 text-primary" />
                        <span>Budget Allocation</span>
                      </div>
                      <div className="font-mono text-xs">
                        <span className="font-bold text-foreground">
                          {currency}{totalPrice.toLocaleString()}
                        </span>{" "}
                        <span className="text-muted-foreground">
                          / {currency}{bundle.targetBudget.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 w-full rounded-full bg-secondary/80 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          isOver ? "bg-amber-600 dark:bg-amber-500" : "bg-primary"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    {/* Variance Pill */}
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{percentage}% allocated</span>
                      <span className={isOver ? "text-amber-700 dark:text-amber-400 font-semibold" : "text-primary font-semibold"}>
                        {isOver
                          ? `+${currency}${Math.abs(diff).toLocaleString()} over target`
                          : `${currency}${diff.toLocaleString()} buffer remaining`}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 pt-0 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-foreground pt-2">
                    <span>Selected Bundle Gifts ({bundle.items.length})</span>
                    <button
                      type="button"
                      onClick={() => setAddingToBundleId(bundle.id)}
                      className="text-[11px] text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="size-3" />
                      <span>Add Gift</span>
                    </button>
                  </div>

                  {/* Bundle Item Rows */}
                  <div className="flex flex-col gap-2">
                    {bundle.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-2xl bg-secondary/20 border border-border/50 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{item.title}</span>
                          {item.category && (
                            <span className="text-[10px] text-muted-foreground">{item.category}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono font-bold text-foreground">
                            {currency}{item.price.toLocaleString()}
                          </span>

                          <button
                            type="button"
                            onClick={() => setActiveItemForReplace({ bundleId: bundle.id, item })}
                            className="text-[10px] px-2 py-1 rounded-lg bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all cursor-pointer"
                            title="Replace this gift with an alternative"
                          >
                            Replace
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveItem(bundle.id, item.id)}
                            className="text-muted-foreground hover:text-destructive p-1 cursor-pointer"
                            title="Remove gift"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Inline Add Item Form */}
                    {addingToBundleId === bundle.id && (
                      <div className="p-3 rounded-2xl bg-secondary/40 border border-primary/40 flex flex-col sm:flex-row gap-2 animate-in fade-in duration-150">
                        <Input
                          value={inlineTitle}
                          onChange={(e) => setInlineTitle(e.target.value)}
                          placeholder="Gift item name"
                          className="h-8 text-xs bg-background/80 rounded-lg flex-1"
                        />
                        <Input
                          type="number"
                          value={inlinePrice}
                          onChange={(e) => setInlinePrice(parseFloat(e.target.value) || 0)}
                          placeholder="Price"
                          className="h-8 text-xs bg-background/80 rounded-lg w-24 font-mono"
                        />
                        <div className="flex items-center gap-1.5">
                          <Button
                            size="sm"
                            onClick={() => handleInlineAddItem(bundle.id)}
                            className="h-8 px-3 text-xs rounded-lg cursor-pointer"
                          >
                            Add
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setAddingToBundleId(null)}
                            className="h-8 px-2 text-xs rounded-lg cursor-pointer"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-2 border-t border-border/60 flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveBundleForPresentation(bundle)}
                    className="text-xs gap-1.5 rounded-xl cursor-pointer"
                  >
                    <Package className="size-3.5 text-primary" />
                    <span>Presentation & Unboxing Atelier</span>
                  </Button>

                  <span className="text-[10px] text-muted-foreground font-mono">
                    {bundle.items.length} items
                  </span>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      ) : (
        <EmptyState
          icon={Layers}
          badgeText="Zero Bundles"
          title="No gift bundles created yet"
          description="Combine multiple harmonious gifts into a cohesive bespoke presentation hamper or milestone ritual."
          action={
            <Button onClick={() => setIsCreateOpen(true)} className="gap-2 shadow-xs cursor-pointer">
              <Plus data-icon="inline-start" />
              Create First Bundle
            </Button>
          }
        />
      )}

      {/* Create Dialog */}
      <CreateBundleDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        recipients={recipients}
        onSubmit={handleCreateBundle}
      />

      {/* Replace Item Dialog */}
      {activeItemForReplace && (
        <ReplaceBundleItemDialog
          open={!!activeItemForReplace}
          onOpenChange={(open) => !open && setActiveItemForReplace(null)}
          itemToReplace={activeItemForReplace.item}
          currency="₹"
          onReplace={handleReplaceItem}
        />
      )}

      {/* Presentation & Unboxing Atelier Drawer */}
      {activeBundleForPresentation && (
        <PresentationDrawer
          open={!!activeBundleForPresentation}
          onOpenChange={(open) => !open && setActiveBundleForPresentation(null)}
          bundle={activeBundleForPresentation}
          onSavePresentation={(presentation) =>
            handleSavePresentation(activeBundleForPresentation.id, presentation)
          }
        />
      )}
    </div>
  )
}
