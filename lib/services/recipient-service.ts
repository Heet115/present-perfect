import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore"
import { db, cleanFirestoreData } from "@/lib/firebase"
import { Recipient, UserProfile } from "@/lib/types/recipient"

const getUserRecipientsRef = (userId: string) =>
  collection(db, "users", userId, "recipients")

export const recipientService = {
  // Fetch all recipients for an authenticated user
  async getAll(userId: string): Promise<Recipient[]> {
    if (!userId) return []
    const q = query(getUserRecipientsRef(userId), orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Recipient[]
  },

  // Fetch single recipient
  async getById(userId: string, recipientId: string): Promise<Recipient | null> {
    if (!userId || !recipientId) return null
    const ref = doc(db, "users", userId, "recipients", recipientId)
    const snapshot = await getDoc(ref)
    if (!snapshot.exists()) return null
    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Recipient
  },

  // Add a new recipient dossier
  async create(userId: string, data: Omit<Recipient, "id" | "userId" | "createdAt" | "updatedAt">): Promise<string> {
    if (!userId) throw new Error("User ID is required to create a recipient.")
    const sanitized = cleanFirestoreData({
      ...data,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    const docRef = await addDoc(getUserRecipientsRef(userId), sanitized)
    return docRef.id
  },

  // Update existing recipient
  async update(
    userId: string,
    recipientId: string,
    data: Partial<Omit<Recipient, "id" | "userId" | "createdAt">>
  ): Promise<void> {
    if (!userId || !recipientId) throw new Error("Invalid parameters for update.")
    const ref = doc(db, "users", userId, "recipients", recipientId)
    const sanitized = cleanFirestoreData({
      ...data,
      updatedAt: serverTimestamp(),
    })
    await updateDoc(ref, sanitized)
  },

  // Delete recipient
  async delete(userId: string, recipientId: string): Promise<void> {
    if (!userId || !recipientId) throw new Error("Invalid parameters for delete.")
    const ref = doc(db, "users", userId, "recipients", recipientId)
    await deleteDoc(ref)
  },

  // User profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    if (!userId) return null
    const ref = doc(db, "users", userId)
    const snapshot = await getDoc(ref)
    if (!snapshot.exists()) return null
    return snapshot.data() as UserProfile
  },

  async upsertUserProfile(userId: string, profile: Partial<UserProfile>): Promise<void> {
    if (!userId) return
    const ref = doc(db, "users", userId)
    await setDoc(
      ref,
      {
        ...profile,
        uid: userId,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    )
  },
}
