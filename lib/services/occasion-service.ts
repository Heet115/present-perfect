import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Occasion, GiftPlan, GiftPlanStatus } from "@/lib/types/occasion"

const getUserOccasionsRef = (userId: string) =>
  collection(db, "users", userId, "occasions")

const getUserGiftPlansRef = (userId: string) =>
  collection(db, "users", userId, "giftPlans")

export const occasionService = {
  // ===================== OCCASIONS =====================
  async getAllOccasions(userId: string): Promise<Occasion[]> {
    if (!userId) return []
    const q = query(getUserOccasionsRef(userId), orderBy("date", "asc"))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Occasion[]
  },

  async createOccasion(userId: string, data: Omit<Occasion, "id" | "userId" | "createdAt" | "updatedAt">): Promise<string> {
    if (!userId) throw new Error("User ID is required.")
    const docRef = await addDoc(getUserOccasionsRef(userId), {
      ...data,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  },

  async updateOccasion(userId: string, occasionId: string, data: Partial<Omit<Occasion, "id" | "userId" | "createdAt">>): Promise<void> {
    if (!userId || !occasionId) throw new Error("Invalid parameters for update.")
    const ref = doc(db, "users", userId, "occasions", occasionId)
    await updateDoc(ref, {
      ...data,
      updatedAt: serverTimestamp(),
    })
  },

  async deleteOccasion(userId: string, occasionId: string): Promise<void> {
    if (!userId || !occasionId) throw new Error("Invalid parameters for delete.")
    const ref = doc(db, "users", userId, "occasions", occasionId)
    await deleteDoc(ref)
  },

  // ===================== GIFT PLANS =====================
  async getAllGiftPlans(userId: string): Promise<GiftPlan[]> {
    if (!userId) return []
    const q = query(getUserGiftPlansRef(userId), orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as GiftPlan[]
  },

  async createGiftPlan(userId: string, data: Omit<GiftPlan, "id" | "userId" | "createdAt" | "updatedAt">): Promise<string> {
    if (!userId) throw new Error("User ID is required.")
    const docRef = await addDoc(getUserGiftPlansRef(userId), {
      ...data,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  },

  async updateGiftPlan(userId: string, planId: string, data: Partial<Omit<GiftPlan, "id" | "userId" | "createdAt">>): Promise<void> {
    if (!userId || !planId) throw new Error("Invalid parameters for update.")
    const ref = doc(db, "users", userId, "giftPlans", planId)
    await updateDoc(ref, {
      ...data,
      updatedAt: serverTimestamp(),
    })
  },

  async updatePlanStatus(userId: string, planId: string, status: GiftPlanStatus): Promise<void> {
    if (!userId || !planId) return
    const ref = doc(db, "users", userId, "giftPlans", planId)
    await updateDoc(ref, {
      status,
      updatedAt: serverTimestamp(),
    })
  },

  async deleteGiftPlan(userId: string, planId: string): Promise<void> {
    if (!userId || !planId) throw new Error("Invalid parameters for delete.")
    const ref = doc(db, "users", userId, "giftPlans", planId)
    await deleteDoc(ref)
  },
}

// Utility to calculate days until an occasion date
export function getDaysRemaining(dateString: string): {
  days: number
  label: string
  isPast: boolean
  isToday: boolean
} {
  if (!dateString) return { days: 0, label: "No date", isPast: false, isToday: false }

  const targetDate = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  targetDate.setHours(0, 0, 0, 0)

  const diffTime = targetDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return { days: 0, label: "Today", isPast: false, isToday: true }
  } else if (diffDays === 1) {
    return { days: 1, label: "Tomorrow", isPast: false, isToday: false }
  } else if (diffDays > 1) {
    return { days: diffDays, label: `In ${diffDays} days`, isPast: false, isToday: false }
  } else {
    return { days: Math.abs(diffDays), label: `${Math.abs(diffDays)} days ago`, isPast: true, isToday: false }
  }
}
