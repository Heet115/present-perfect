export interface BundleItem {
  id: string
  title: string
  price: number
  category?: string
  notes?: string
}

export interface PresentationIdea {
  wrappingSuggestion: string
  wrappingMaterials: string[]
  presentationRitual: string
  surpriseIdea: string
  cardEnvelopeIdea: string
}

export interface GiftBundle {
  id: string
  userId: string
  title: string
  recipientId?: string
  recipientName: string
  targetBudget: number
  currency: string
  items: BundleItem[]
  presentation?: PresentationIdea
  notes?: string
  createdAt?: string
  updatedAt?: string
}
