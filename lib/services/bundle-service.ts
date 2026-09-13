import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { GiftBundle, BundleItem, PresentationIdea } from "@/lib/types/bundle"

const getBundlesRef = (userId: string) =>
  collection(db, "users", userId, "gift_bundles")

export const bundleService = {
  async getAll(userId: string): Promise<GiftBundle[]> {
    if (!userId) return []
    try {
      const q = query(getBundlesRef(userId), orderBy("createdAt", "desc"))
      const snapshot = await getDocs(q)
      return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate ? d.data().createdAt.toDate().toISOString() : new Date().toISOString(),
      })) as GiftBundle[]
    } catch (err) {
      console.warn("Falling back to unordered bundles fetch:", err)
      const snapshot = await getDocs(getBundlesRef(userId))
      return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: new Date().toISOString(),
      })) as GiftBundle[]
    }
  },

  async create(
    userId: string,
    data: Omit<GiftBundle, "id" | "userId" | "createdAt" | "updatedAt">
  ): Promise<string> {
    if (!userId) throw new Error("User ID is required.")
    const docRef = await addDoc(getBundlesRef(userId), {
      ...data,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  },

  async update(
    userId: string,
    bundleId: string,
    data: Partial<Omit<GiftBundle, "id" | "userId" | "createdAt">>
  ): Promise<void> {
    if (!userId || !bundleId) return
    const ref = doc(db, "users", userId, "gift_bundles", bundleId)
    await updateDoc(ref, {
      ...data,
      updatedAt: serverTimestamp(),
    })
  },

  async delete(userId: string, bundleId: string): Promise<void> {
    if (!userId || !bundleId) return
    const ref = doc(db, "users", userId, "gift_bundles", bundleId)
    await deleteDoc(ref)
  },

  async addItem(userId: string, bundleId: string, item: BundleItem): Promise<void> {
    const ref = doc(db, "users", userId, "gift_bundles", bundleId)
    const snap = await getDoc(ref)
    if (!snap.exists()) return
    const existing = snap.data() as GiftBundle
    const updatedItems = [...(existing.items || []), item]
    await updateDoc(ref, {
      items: updatedItems,
      updatedAt: serverTimestamp(),
    })
  },

  async removeItem(userId: string, bundleId: string, itemId: string): Promise<void> {
    const ref = doc(db, "users", userId, "gift_bundles", bundleId)
    const snap = await getDoc(ref)
    if (!snap.exists()) return
    const existing = snap.data() as GiftBundle
    const updatedItems = (existing.items || []).filter((i) => i.id !== itemId)
    await updateDoc(ref, {
      items: updatedItems,
      updatedAt: serverTimestamp(),
    })
  },

  async replaceItem(
    userId: string,
    bundleId: string,
    oldItemId: string,
    newItem: BundleItem
  ): Promise<void> {
    const ref = doc(db, "users", userId, "gift_bundles", bundleId)
    const snap = await getDoc(ref)
    if (!snap.exists()) return
    const existing = snap.data() as GiftBundle
    const updatedItems = (existing.items || []).map((i) =>
      i.id === oldItemId ? newItem : i
    )
    await updateDoc(ref, {
      items: updatedItems,
      updatedAt: serverTimestamp(),
    })
  },

  async updatePresentation(
    userId: string,
    bundleId: string,
    presentation: PresentationIdea
  ): Promise<void> {
    const ref = doc(db, "users", userId, "gift_bundles", bundleId)
    await updateDoc(ref, {
      presentation,
      updatedAt: serverTimestamp(),
    })
  },
}
