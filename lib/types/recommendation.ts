export type RecommendationType =
  | "Best Match"
  | "Unique"
  | "Budget Friendly"
  | "Premium"
  | "Personalized"

export interface AlternativeSuggestion {
  name: string
  estimatedPrice: number
  differenceReason: string
}

export type RefinementModifier =
  | "cheaper"
  | "more_personal"
  | "unique"
  | "practical"
  | "romantic"
  | "funny"
  | "change_category"
  | "exclude_category"
  | "custom"

export interface AssistantMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp?: number
}

export interface RecommendationRequest {
  recipientId?: string
  recipientName?: string
  age?: string
  relationship: string
  interests: string[]
  personalityTraits: string[]
  occasion: string
  budget: number
  currency?: string
  dislikes?: string[]
  personalNotes?: string
  recommendationTypeFilter?: RecommendationType
  refinementInstruction?: string
  refinementModifier?: RefinementModifier
  excludedCategory?: string
  targetCategory?: string
  mode?: "standard" | "no_idea" | "surprise_me"
}

export interface GiftRecommendation {
  id: string
  name: string
  recommendationType: RecommendationType
  matchScore: number // 80 - 99
  compatibilityScore?: number
  estimatedPrice: number
  currency: string
  category: string
  whyRecommended: string
  whyItFits?: string
  budgetCompatibility: string
  recipientCompatibility: string
  alternativeSuggestions: AlternativeSuggestion[]
  tagline?: string
  description?: string
  pros?: string[]
  cons?: string[]
  searchQuery?: string
  sentimentTone?: string
  handwrittenNote?: string
}
