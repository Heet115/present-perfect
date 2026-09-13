import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"
import { PresentationIdea } from "@/lib/types/bundle"

export interface PresentationRequest {
  bundleTitle: string
  recipientName: string
  items: { title: string; price: number }[]
  targetBudget: number
  currency: string
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as PresentationRequest
    const apiKey = process.env.GEMINI_API_KEY
    const currency = body.currency || "₹"
    const itemsList = body.items.map((i) => `- ${i.title} (${currency}${i.price})`).join("\n")

    const prompt = `
You are Present Perfect's master gift stylist, presentation designer, and packaging atelier.
Generate thoughtful, sensory, bespoke presentation ideas and wrapping suggestions for this gift bundle:

Bundle Title: "${body.bundleTitle}"
Recipient: ${body.recipientName}
Target Budget: ${currency}${body.targetBudget}
Selected Gifts in Bundle:
${itemsList}

Provide:
1. "wrappingSuggestion": 2-3 sentences describing a tactile, sustainable luxury wrapping concept (e.g., Japanese Furoshiki raw linen wrap, botanical pressed flowers, wax seal stamps).
2. "wrappingMaterials": list of 4 specific packaging materials/accessories.
3. "presentationRitual": 2-3 sentences describing an unforgettable unboxing moment or reveal ceremony.
4. "surpriseIdea": a clever, unexpected touch or surprise delivery method.
5. "cardEnvelopeIdea": a bespoke card pairing or envelope embellishment concept.
6. "budgetOptimizationAdvice": 2 sentences advising how to balance the bundle to hit the ${currency}${body.targetBudget} target gracefully.

Respond ONLY with a JSON object matching this schema:
{
  "wrappingSuggestion": "...",
  "wrappingMaterials": ["Material 1", "Material 2", "Material 3", "Material 4"],
  "presentationRitual": "...",
  "surpriseIdea": "...",
  "cardEnvelopeIdea": "...",
  "budgetOptimizationAdvice": "..."
}
`

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
          const parsed = JSON.parse(text)
          return NextResponse.json(parsed)
        }
      } catch (geminiErr) {
        console.warn("Presentation Gemini synthesis failed, using concierge fallback:", geminiErr)
      }
    }

    // High-fidelity fallback styling
    const fallback = generateFallbackPresentation(body)
    return NextResponse.json(fallback)
  } catch (error) {
    console.error("Presentation API error:", error)
    return NextResponse.json(
      { error: "Failed to generate presentation ideas." },
      { status: 500 }
    )
  }
}

function generateFallbackPresentation(body: PresentationRequest) {
  const currency = body.currency || "₹"
  const currentTotal = body.items.reduce((sum, i) => sum + (i.price || 0), 0)
  const diff = body.targetBudget - currentTotal

  let optimizationAdvice = `Your bundle sits nicely balanced at ${currency}${currentTotal} against your ${currency}${body.targetBudget} target.`
  if (diff > 500) {
    optimizationAdvice = `You have a remaining surplus of ${currency}${diff}. Consider pairing an estate organic botanical tea flight or hand-poured beeswax candle to complete the bundle.`
  } else if (diff < -300) {
    optimizationAdvice = `The bundle currently stretches ${currency}${Math.abs(diff)} beyond your budget. You can substitute one artisanal piece with a lighter pocket edition without diminishing overall impact.`
  }

  return {
    wrappingSuggestion: `Wrap each piece in unbleached Belgian washed linen using traditional Japanese Furoshiki knotting, secured with a hand-tied botanical twine garland and custom brass wax seal stamp.`,
    wrappingMaterials: [
      "Natural stone-washed linen Furoshiki cloth",
      "Gilded botanical sealing wax (Champagne Gold)",
      "Pressed wild lavender and baby eucalyptus sprigs",
      "Letterpress handmade cotton paper identification tag",
    ],
    presentationRitual: `Stage a progressive reveal: place the smaller keepsake inside a nested cedar keepsake box, with the primary gift resting below a bed of natural shredded wood excelsior.`,
    surpriseIdea: `Tuck a handwritten coordinate note or an embossed envelope containing an intimate voice note QR code underneath the inner lid of the wooden presentation box.`,
    cardEnvelopeIdea: `Deckle-edged ivory cotton envelope sealed with an antique monogram signet stamp, calligraphed with archival sepia ink.`,
    budgetOptimizationAdvice: optimizationAdvice,
  }
}
