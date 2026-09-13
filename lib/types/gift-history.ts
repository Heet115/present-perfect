export interface GiftHistoryItem {
  id: string
  userId: string
  recipientId?: string
  recipientName: string
  giftName: string
  giftPrice: number
  currency: string
  occasion: string
  giftDate: string // YYYY-MM-DD
  giftNotes?: string
  createdAt?: string
}
