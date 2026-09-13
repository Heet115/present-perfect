import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

export type MessageOccasion =
  | "Birthday"
  | "Anniversary"
  | "Friendship"
  | "Congratulations"
  | "Thank-you"
  | "Custom"

export type MessageTone =
  | "Heartfelt"
  | "Funny"
  | "Romantic"
  | "Casual"
  | "Emotional"
  | "Short"
  | "Poetic"
  | "Professional"

export interface PersonalizeRequest {
  recipientName: string
  relationship?: string
  occasion: MessageOccasion | string
  tone: MessageTone
  customDetails?: string
  recipientTraits?: string[]
  giftItemName?: string
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as PersonalizeRequest
    const apiKey = process.env.GEMINI_API_KEY

    const prompt = `
You are Present Perfect's master epistolary concierge and personal card calligrapher.
Craft a deeply resonant, bespoke card message to accompany a gift.

Context:
- Recipient: ${body.recipientName || "Someone Special"}
- Relationship: ${body.relationship || "Close Connection"}
- Occasion: ${body.occasion}
- Tone Required: ${body.tone} (Strictly embody this tone)
- Accompanying Gift Item: ${body.giftItemName || "A thoughtful gift"}
- Shared Memories / Special Nuance: ${body.customDetails || "None provided"}
- Traits & Quirks: ${body.recipientTraits?.join(", ") || "Thoughtful"}

Tone Guidelines:
- "Heartfelt": Sincere, warm, touching, honoring the depth of the bond.
- "Funny": Clever, witty, affectionate teasing, high-brow humor.
- "Romantic": Intimate, poetic, deeply devoted, candlelit warmth.
- "Casual": Breezy, natural, relaxed, like a close conversation over coffee.
- "Emotional": Vulnerable, expressive, heartfelt gratitude, tears of joy.
- "Short": Punchy, memorable, elegant brevity (1-2 sentences).
- "Poetic": Lyrical, evocative metaphors, timeless cadence.
- "Professional": Gracious, polished, warm yet respectful decorum.

Respond ONLY with a JSON object:
{
  "message": "The complete card text formatted with natural line breaks.",
  "salutation": "Opening greeting, e.g., Dearest [Name],",
  "signOff": "Closing signature, e.g., With all my fondest love,",
  "calligraphyTag": "Short 2-3 word tone descriptor, e.g., Lyrical & Intimate"
}
`

    if (apiKey && !apiKey.startsWith("AQ.placeholder")) {
      try {
        const ai = new GoogleGenAI({ apiKey })
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        })

        const text = response.text?.trim()
        if (text) {
          const parsed = JSON.parse(text)
          return NextResponse.json(parsed)
        }
      } catch (geminiErr) {
        console.warn("Gemini message synthesis failed, using concierge fallback:", geminiErr)
      }
    }

    // High-fidelity fallback generation
    const fallback = generateFallbackMessage(body)
    return NextResponse.json(fallback)
  } catch (error) {
    console.error("Personalize message error:", error)
    return NextResponse.json(
      { error: "Unable to synthesize personal message. Please try again." },
      { status: 500 }
    )
  }
}

function generateFallbackMessage(body: PersonalizeRequest) {
  const name = body.recipientName || "Friend"
  const occasion = body.occasion || "Celebration"
  const tone = body.tone || "Heartfelt"

  switch (tone) {
    case "Funny":
      return {
        salutation: `Dear ${name},`,
        message: `Happy ${occasion}! I spent weeks agonizing over whether to get you something profoundly mature or delightfully absurd. You know you're one of my absolute favorite humans when I willingly spent this much effort finding something you wouldn't immediately return. Here's to surviving another year of our questionable life choices!`,
        signOff: "With genuine affection and mild concern,",
        calligraphyTag: "Playful & Witty",
      }
    case "Romantic":
      return {
        salutation: `My Dearest ${name},`,
        message: `Happy ${occasion}. Every ordinary day becomes a quiet celebration simply because you are in it. In a hurried world, loving you is the easiest and most beautiful rhythm I have ever known. May this small token remind you of how deeply cherished you are, today and across every tomorrow.`,
        signOff: "Yours, entirely and always,",
        calligraphyTag: "Devoted & Romantic",
      }
    case "Short":
      return {
        salutation: `To ${name},`,
        message: `Happy ${occasion}! May this year bring you as much quiet joy, wonder, and warmth as you effortlessly bring to everyone around you.`,
        signOff: "Warmest wishes,",
        calligraphyTag: "Brief & Poignant",
      }
    case "Poetic":
      return {
        salutation: `Dearest ${name},`,
        message: `Some souls move through the world like gentle lantern light, making every room a little softer and every path a little clearer. On this ${occasion}, I celebrate the quiet brilliance of your presence and all the unwritten beauty waiting ahead.`,
        signOff: "With endless reverence and affection,",
        calligraphyTag: "Lyrical & Timeless",
      }
    case "Casual":
      return {
        salutation: `Hey ${name},`,
        message: `Just wanted to send the biggest celebration wishes your way for ${occasion}! So grateful for the spontaneous laughs, the easy conversations, and having you in my corner. Hope you take some well-deserved time to celebrate yourself properly!`,
        signOff: "Cheers to you,",
        calligraphyTag: "Breezy & Warm",
      }
    case "Emotional":
      return {
        salutation: `Dearest ${name},`,
        message: `Happy ${occasion}. Looking back at everything we've walked through together, my heart overflows with gratitude. Thank you for showing up with unwavering kindness, for listening without judgment, and for being the anchor you are. I am so profoundly grateful for you.`,
        signOff: "With all my love and deepest gratitude,",
        calligraphyTag: "Deeply Moving",
      }
    case "Professional":
      return {
        salutation: `Dear ${name},`,
        message: `Warmest congratulations on your ${occasion}. It is a true pleasure and privilege working alongside someone of your dedication, insight, and integrity. Wishing you continued fulfillment, well-deserved recognition, and great success in the milestones ahead.`,
        signOff: "With sincere regards,",
        calligraphyTag: "Gracious & Polished",
      }
    case "Heartfelt":
    default:
      return {
        salutation: `Dearest ${name},`,
        message: `Happy ${occasion}! The best things in life are never things—they are the people who make us feel understood and seen. Thank you for being such an extraordinary presence in my world. May this milestone be wrapped in the same warmth and peace you so generously give to those around you.`,
        signOff: "With all my heartfelt fondness,",
        calligraphyTag: "Enduring & Sincere",
      }
  }
}
