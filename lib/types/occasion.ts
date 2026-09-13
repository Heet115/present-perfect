export type OccasionType =
  | "birthday"
  | "anniversary"
  | "holiday"
  | "graduation"
  | "wedding"
  | "promotion"
  | "custom"

export interface Occasion {
  id?: string
  userId: string
  recipientId?: string
  recipientName?: string
  title: string
  date: string // YYYY-MM-DD
  type: OccasionType
  budget?: number
  notes?: string
  createdAt?: any
  updatedAt?: any
}

export type GiftPlanStatus = "planning" | "shortlisted" | "purchased" | "gifted"

export interface GiftIdeaItem {
  id: string
  title: string
  price?: number
  url?: string
  notes?: string
  isSelected?: boolean
}

export interface GiftPlan {
  id?: string
  userId: string
  recipientId: string
  recipientName: string
  occasionId?: string
  occasionTitle?: string
  occasionDate?: string
  status: GiftPlanStatus
  targetBudget: number
  actualSpend?: number
  currency: string
  giftIdeas: GiftIdeaItem[]
  notes?: string
  createdAt?: any
  updatedAt?: any
}
