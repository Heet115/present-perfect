export interface ImportantDate {
  id: string
  title: string
  date: string // YYYY-MM-DD
  type: "birthday" | "anniversary" | "graduation" | "custom"
}

export interface RecipientPreferences {
  sizing?: string
  preferredColors?: string
  preferredVibe?: string
}

export interface Recipient {
  id?: string
  userId: string
  name: string
  relationship: string
  ageGroup?: string
  interests: string[]
  personalityTraits: string[]
  preferences: RecipientPreferences
  favoriteThings: string[]
  dislikes: string[]
  personalNotes: string
  importantDates: ImportantDate[]
  createdAt?: any
  updatedAt?: any
}

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  defaultCurrency?: string
  createdAt?: any
  updatedAt?: any
}
