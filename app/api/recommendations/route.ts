import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"
import { RecommendationRequest, GiftRecommendation } from "@/lib/types/recommendation"

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RecommendationRequest
    const apiKey = process.env.GEMINI_API_KEY

    const prompt = `
You are Present Perfect, an elite bespoke gifting concierge. Your purpose is to curate deeply thoughtful, high-affinity gifts that feel handcrafted, personal, and unforgettable. Avoid generic gadgets, plastic gimmicks, or lazy gift cards.

Recipient Profile:
- Name: ${body.recipientName || "Recipient"}
- Relationship: ${body.relationship || "Close Friend"}
- Age / Stage: ${body.age || "Adult"}
- Occasion: ${body.occasion || "Celebration"}
- Target Budget: ${body.currency || "₹"}${body.budget || 3000}
- Passions & Interests: ${body.interests?.length ? body.interests.join(", ") : "Arts, culture, design, food"}
- Personality Traits: ${body.personalityTraits?.length ? body.personalityTraits.join(", ") : "Thoughtful, observant"}
- Things Strictly to Avoid: ${body.dislikes?.length ? body.dislikes.join(", ") : "Generic mugs, mass-produced plastic"}
- Context & Personal Notes: ${body.personalNotes || "None"}

Please generate 4 distinct, imaginative, and resonant gift recommendations strictly within or near the budget.

Respond ONLY with a valid JSON array of 4 objects matching this exact structure:
[
  {
    "id": "rec-1",
    "name": "Exact Name of the Gift Item",
    "tagline": "Poetic 4-6 word tagline",
    "description": "2-3 sentences describing the item and its craftsmanship",
    "whyItFits": "Detailed explanation of why this matches their specific quirks, traits, and relationship",
    "estimatedPrice": 2850,
    "currency": "${body.currency || "₹"}",
    "category": "Keepsake / Experiential / Artisanal / Functional Art",
    "compatibilityScore": 98,
    "pros": ["Pro point 1", "Pro point 2"],
    "cons": ["Small consideration 1"],
    "searchQuery": "Search term to purchase or explore this item online",
    "sentimentTone": "Heartfelt / Witty / Nostalgic / Poetic",
    "handwrittenNote": "A bespoke 2-sentence note ready to be written inside the gift envelope"
  }
]
`

    let recommendations: GiftRecommendation[] = []

    if (apiKey && !apiKey.startsWith("AQ.placeholder")) {
      try {
        const ai = new GoogleGenAI({ apiKey })
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        })

        const text = response.text?.trim()
        if (text) {
          recommendations = JSON.parse(text)
        }
      } catch (geminiError) {
        console.warn("Gemini API call failed, falling back to concierge synthesis:", geminiError)
      }
    }

    // High-fidelity fallback synthesis if API unavailable or quota reached
    if (!recommendations || recommendations.length === 0) {
      recommendations = generateConciergeFallback(body)
    }

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error("Recommendations API error:", error)
    return NextResponse.json(
      { error: "Failed to generate gift recommendations. Please try again." },
      { status: 500 }
    )
  }
}

function generateConciergeFallback(body: RecommendationRequest): GiftRecommendation[] {
  const currency = body.currency || "₹"
  const budget = body.budget || 3000
  const mainInterest = body.interests?.[0] || "Artisanal Living"
  const secondaryInterest = body.interests?.[1] || "Storytelling"
  const name = body.recipientName || "them"

  return [
    {
      id: "rec-1",
      name: `Handcrafted Solid Brass ${mainInterest} Artifact & Estate Reserve`,
      tagline: "An enduring piece that ages gracefully",
      description: `A custom-turned solid brass piece designed for ${mainInterest}, accompanied by a curated provenance certificate and presentation pouch.`,
      whyItFits: `Directly honors ${name}'s love for ${mainInterest}. Over decades, brass builds an authentic patina unique to their touch, serving as a lasting keepsake of your ${body.relationship.toLowerCase()} bond.`,
      estimatedPrice: Math.round(budget * 0.92),
      currency,
      category: "Artisanal Keepsake",
      compatibilityScore: 98,
      pros: ["Handcrafted durability", "Becomes more beautiful with age", "Highly personal"],
      cons: ["Requires gentle occasional buffing"],
      searchQuery: `Artisanal brass ${mainInterest} gift`,
      sentimentTone: "Heartfelt & Enduring",
      handwrittenNote: `To the one who taught me that the best things in life are made with quiet patience. Happy ${body.occasion}, ${name}.`,
    },
    {
      id: "rec-2",
      name: `Custom Monogrammed Full-Grain Tuscan Leather ${secondaryInterest} Folio`,
      tagline: "Tactile heritage for daily rituals",
      description: `Vegetable-tanned full-grain leather folio with hand-stitched waxed thread, custom blind debossed initials, and heavy cotton parchment paper.`,
      whyItFits: `Celebrates ${name}'s interest in ${secondaryInterest} while offering daily practical utility without compromising on timeless elegance.`,
      estimatedPrice: Math.round(budget * 0.85),
      currency,
      category: "Heritage Leathercraft",
      compatibilityScore: 96,
      pros: ["Aromatherapeutic leather scent", "Includes personalized initials", "Daily utility"],
      cons: ["Needs natural conditioning over years"],
      searchQuery: `Personalized leather folio ${secondaryInterest}`,
      sentimentTone: "Nostalgic & Warm",
      handwrittenNote: `For recording the adventures, ideas, and memories that make you so uniquely you. With endless affection on this ${body.occasion}.`,
    },
    {
      id: "rec-3",
      name: `Artisan Studio Celadon Ceramic Vessel & Rare Botanical Experience`,
      tagline: "Quiet serenity for their home sanctuary",
      description: `Thrown on the potter's wheel and fired with a traditional celadon crackle glaze, paired with an estate tasting flight of rare organic harvests.`,
      whyItFits: `Reflects ${name}'s discerning aesthetic sense. It creates an intentional pocket of peace amidst busy everyday routines.`,
      estimatedPrice: Math.round(budget * 0.78),
      currency,
      category: "Functional Art",
      compatibilityScore: 94,
      pros: ["One-of-a-kind studio piece", "Sensory calming experience", "Beautiful on any surface"],
      cons: ["Delicate ceramic care required"],
      searchQuery: `Studio ceramic celadon handmade gift`,
      sentimentTone: "Poetic & Peaceful",
      handwrittenNote: `May every quiet morning bring you the warmth, peace, and beauty you give so freely to the world around you.`,
    },
    {
      id: "rec-4",
      name: `Limited Hardcover Illustrated Anthology with Commemorative Bookplate`,
      tagline: "A conversation piece for generations",
      description: `Printed on archival acid-free paper with gilt-edged pages and an embossed custom bookplate commemorating this ${body.occasion}.`,
      whyItFits: `A deeply intellectual and aesthetic tribute to ${name}'s contemplative side, designed to live proudly on their study desk.`,
      estimatedPrice: Math.round(budget * 0.65),
      currency,
      category: "Archival Literature",
      compatibilityScore: 91,
      pros: ["Permanent library addition", "Custom dated bookplate", "Budget friendly"],
      cons: ["Heavy weight for travel"],
      searchQuery: `Hardcover illustrated collector edition gift`,
      sentimentTone: "Literary & Reverent",
      handwrittenNote: `Here's to writing the next unforgettable chapters together. Thank you for being such an inspiration in my life.`,
    },
  ]
}
