import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
} from "firebase/firestore"
import { db, cleanFirestoreData } from "@/lib/firebase"
import { GiftHistoryItem } from "@/lib/types/gift-history"

const getGiftHistoryRef = (userId: string) =>
  collection(db, "users", userId, "gift_history")

export const giftHistoryService = {
  async getAll(userId: string, recipientId?: string): Promise<GiftHistoryItem[]> {
    if (!userId) return []
    try {
      let q = query(getGiftHistoryRef(userId), orderBy("giftDate", "desc"))
      if (recipientId) {
        q = query(getGiftHistoryRef(userId), where("recipientId", "==", recipientId), orderBy("giftDate", "desc"))
      }
      const snapshot = await getDocs(q)
      return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate ? d.data().createdAt.toDate().toISOString() : new Date().toISOString(),
      })) as GiftHistoryItem[]
    } catch (err) {
      console.warn("Falling back to client-side filtered history fetch:", err)
      const snapshot = await getDocs(getGiftHistoryRef(userId))
      let list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: new Date().toISOString(),
      })) as GiftHistoryItem[]
      if (recipientId) {
        list = list.filter((item) => item.recipientId === recipientId)
      }
      list.sort((a, b) => new Date(b.giftDate).getTime() - new Date(a.giftDate).getTime())
      return list
    }
  },

  async create(
    userId: string,
    data: Omit<GiftHistoryItem, "id" | "userId" | "createdAt">
  ): Promise<string> {
    if (!userId) throw new Error("User ID is required.")
    const sanitized = cleanFirestoreData({
      ...data,
      userId,
      createdAt: serverTimestamp(),
    })
    const docRef = await addDoc(getGiftHistoryRef(userId), sanitized)
    return docRef.id
  },

  async delete(userId: string, id: string): Promise<void> {
    if (!userId || !id) return
    const ref = doc(db, "users", userId, "gift_history", id)
    await deleteDoc(ref)
  },

  async update(
    userId: string,
    id: string,
    data: Partial<Omit<GiftHistoryItem, "id" | "userId" | "createdAt">>
  ): Promise<void> {
    if (!userId || !id) return
    const ref = doc(db, "users", userId, "gift_history", id)
    const sanitized = cleanFirestoreData(data)
    await updateDoc(ref, sanitized)
  },
}
