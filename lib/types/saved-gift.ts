import { GiftRecommendation } from "./recommendation"

export interface SavedGift {
  id: string
  userId: string
  recipientId?: string
  recipientName?: string
  recommendation: GiftRecommendation
  savedAt: string
  notes?: string
}
