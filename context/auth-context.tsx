"use client"

import * as React from "react"
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  sendPasswordReset: (email: string) => Promise<void>
  logout: () => Promise<void>
  formatAuthError: (error: unknown) => string
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function formatAuthError(error: unknown): string {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = (error as { code: string }).code
    switch (code) {
      case "auth/invalid-email":
        return "Please enter a valid email address."
      case "auth/user-disabled":
        return "This account has been disabled. Please contact concierge support."
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Invalid email or password. Please try again."
      case "auth/email-already-in-use":
        return "An account with this email already exists. Please sign in instead."
      case "auth/weak-password":
        return "Password is too weak. Please use at least 8 characters."
      case "auth/too-many-requests":
        return "Too many unsuccessful attempts. Please wait a few moments and try again."
      case "auth/popup-closed-by-user":
        return "Sign in popup was closed before completion. Please try again."
      case "auth/network-request-failed":
        return "Network connection issue. Please check your internet connection."
      default:
        return (error as { message?: string }).message || "An unexpected error occurred. Please try again."
    }
  }
  return "An unexpected error occurred. Please try again."
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), password)
  }

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password)
    if (displayName.trim()) {
      await updateProfile(userCredential.user, {
        displayName: displayName.trim(),
      })
      setUser({ ...userCredential.user, displayName: displayName.trim() })
    }
  }

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider)
  }

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim())
  }

  const logout = async () => {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        sendPasswordReset,
        logout,
        formatAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
