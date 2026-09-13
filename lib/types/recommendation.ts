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
}

export interface GiftRecommendation {
  id: string
  name: string
  tagline: string
  description: string
  whyItFits: string
  estimatedPrice: number
  currency: string
  category: string
  compatibilityScore: number // 80 - 99
  pros: string[]
  cons: string[]
  searchQuery: string
  sentimentTone: string
  handwrittenNote: string
}
