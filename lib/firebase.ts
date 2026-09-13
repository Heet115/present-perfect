import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase as a singleton instance
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: "select_account" })

export { app, auth, db, googleProvider }

/**
 * Recursively strips undefined keys and nested undefined values
 * to prevent Firestore "Function addDoc() called with invalid data. Unsupported field value: undefined" errors.
 */
export function cleanFirestoreData<T extends Record<string, any>>(data: T): Partial<T> {
  const clean: Record<string, any> = {}
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      if (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        !(value instanceof Date) &&
        !("_methodName" in value)
      ) {
        clean[key] = cleanFirestoreData(value)
      } else if (Array.isArray(value)) {
        clean[key] = value
          .map((item) =>
            item !== null && typeof item === "object" && !(item instanceof Date)
              ? cleanFirestoreData(item)
              : item
          )
          .filter((item) => item !== undefined)
      } else {
        clean[key] = value
      }
    }
  }
  return clean as Partial<T>
}
