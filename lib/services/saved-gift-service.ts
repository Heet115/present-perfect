import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore"
import { db, cleanFirestoreData } from "@/lib/firebase"
import { SavedGift } from "@/lib/types/saved-gift"

const getSavedGiftsRef = (userId: string) =>
  collection(db, "users", userId, "saved_gifts")

export const savedGiftService = {
  async getAll(userId: string): Promise<SavedGift[]> {
    if (!userId) return []
    try {
      const q = query(getSavedGiftsRef(userId), orderBy("savedAt", "desc"))
      const snapshot = await getDocs(q)
      return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        savedAt: d.data().savedAt?.toDate ? d.data().savedAt.toDate().toISOString() : new Date().toISOString(),
      })) as SavedGift[]
    } catch (err) {
      console.warn("Falling back to unordered saved gifts fetch:", err)
      const snapshot = await getDocs(getSavedGiftsRef(userId))
      return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        savedAt: new Date().toISOString(),
      })) as SavedGift[]
    }
  },

  async save(
    userId: string,
    data: Omit<SavedGift, "id" | "userId" | "savedAt">
  ): Promise<string> {
    if (!userId) throw new Error("User ID is required.")
    const sanitized = cleanFirestoreData({
      ...data,
      userId,
      savedAt: serverTimestamp(),
    })
    const docRef = await addDoc(getSavedGiftsRef(userId), sanitized)
    return docRef.id
  },

  async delete(userId: string, giftId: string): Promise<void> {
    if (!userId || !giftId) return
    const ref = doc(db, "users", userId, "saved_gifts", giftId)
    await deleteDoc(ref)
  },

  async updateNotes(userId: string, giftId: string, notes: string): Promise<void> {
    if (!userId || !giftId) return
    const ref = doc(db, "users", userId, "saved_gifts", giftId)
    await updateDoc(ref, { notes })
  },
}
