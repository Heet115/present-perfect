import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"
import { RecommendationRequest, GiftRecommendation } from "@/lib/types/recommendation"

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RecommendationRequest
    const apiKey = process.env.GEMINI_API_KEY
    const currency = body.currency || "₹"
    let budget = body.budget || 3000
    if (body.refinementModifier === "cheaper") {
      budget = Math.round(budget * 0.7)
    }

    let refinementDirective = ""
    if (body.refinementModifier) {
      switch (body.refinementModifier) {
        case "cheaper":
          refinementDirective += `\n- REFINEMENT DIRECTIVE: Make the selections significantly cheaper and budget-conscious without losing charm or artisanal elegance. Target budget reduced to ${currency}${budget}.`
          break
        case "more_personal":
          refinementDirective += `\n- REFINEMENT DIRECTIVE: Prioritize ultra-personalized gifts with custom monograms, secret inscriptions, coordinates, or personalized memory craftsmanship.`
          break
        case "unique":
          refinementDirective += `\n- REFINEMENT DIRECTIVE: Prioritize extraordinarily rare, quirky, indie-studio, or unexpected treasures that cannot be found in conventional department stores.`
          break
        case "practical":
          refinementDirective += `\n- REFINEMENT DIRECTIVE: Focus strictly on highly functional, durable, everyday items that the recipient will integrate into their daily routines.`
          break
        case "romantic":
          refinementDirective += `\n- REFINEMENT DIRECTIVE: Elevate intimacy, poetry, candlelight ambiance, heartfelt romance, and timeless anniversary tokens.`
          break
        case "funny":
          refinementDirective += `\n- REFINEMENT DIRECTIVE: Infuse witty, clever, high-taste humor and playful charm while maintaining craftsmanship and genuine utility.`
          break
        case "change_category":
          refinementDirective += `\n- REFINEMENT DIRECTIVE: Switch category away from conventional items towards experiential vouchers, artisanal culinary tastings, or functional sculpture.`
          break
        case "exclude_category":
          if (body.excludedCategory) {
            refinementDirective += `\n- REFINEMENT DIRECTIVE: STRICTLY EXCLUDE any items belonging to the category: "${body.excludedCategory}".`
          }
          break
      }
    }

    if (body.targetCategory) {
      refinementDirective += `\n- TARGET CATEGORY PREFERENCE: Focus primarily on the category: "${body.targetCategory}".`
    }

    if (body.refinementInstruction) {
      refinementDirective += `\n- USER NATURAL LANGUAGE INSTRUCTION: "${body.refinementInstruction}". Adhere strictly to this user feedback.`
    }

    if (body.mode === "surprise_me") {
      refinementDirective += `\n- DISCOVERY MODE: "SURPRISE ME" — Generate delightful, serendipitous, unexpected, and eclectic treasures that astonish the senses.`
    } else if (body.mode === "no_idea") {
      refinementDirective += `\n- DISCOVERY MODE: "I HAVE NO IDEA" — Provide universally beloved, foolproof, high-reputation artisanal classics that guarantee admiration.`
    }

    const prompt = `
You are Present Perfect, an elite bespoke gifting concierge. Your purpose is to curate deeply thoughtful, high-affinity gifts that feel handcrafted, personal, and unforgettable. Avoid generic gadgets, plastic gimmicks, or lazy gift cards.

Recipient Profile:
- Name: ${body.recipientName || "Recipient"}
- Relationship: ${body.relationship || "Close Friend"}
- Age / Stage: ${body.age || "Adult"}
- Occasion: ${body.occasion || "Celebration"}
- Target Budget: ${currency}${budget}
- Passions & Interests: ${body.interests?.length ? body.interests.join(", ") : "Arts, culture, design, food"}
- Personality Traits: ${body.personalityTraits?.length ? body.personalityTraits.join(", ") : "Thoughtful, observant"}
- Things Strictly to Avoid: ${body.dislikes?.length ? body.dislikes.join(", ") : "Generic mugs, mass-produced plastic"}${refinementDirective}
- Context & Personal Notes: ${body.personalNotes || "None"}

Generate 5 distinct, structured gift recommendations representing each of these 5 recommendation types:
1. "Best Match": The most balanced, harmonious gift matching their core identity.
2. "Unique": An unexpected, artisanal or quirky gem they wouldn't expect but will cherish.
3. "Budget Friendly": Exceptional thoughtfulness at great value (significantly under budget).
4. "Premium": An elevated, luxury or heirloom tier (right at or slightly above the budget).
5. "Personalized": A deeply customized, monogrammed, engraved, or personal memory artifact.

Respond ONLY with a valid JSON array of 5 objects matching this exact structure:
[
  {
    "id": "rec-1",
    "name": "Exact Name of the Gift Item",
    "recommendationType": "Best Match",
    "matchScore": 98,
    "estimatedPrice": 2850,
    "currency": "${currency}",
    "category": "Keepsake / Functional Art / Gourmet / Wellness / Craft",
    "whyRecommended": "Detailed explanation of why this was curated for them",
    "budgetCompatibility": "Fits within budget with room for luxury wrapping",
    "recipientCompatibility": "Matches their enthusiasm for ... and their ... temperament",
    "alternativeSuggestions": [
      {
        "name": "Alternative Item Name 1",
        "estimatedPrice": 2400,
        "differenceReason": "More compact and portable option"
      },
      {
        "name": "Alternative Item Name 2",
        "estimatedPrice": 3200,
        "differenceReason": "Includes custom monogramming"
      }
    ],
    "tagline": "Poetic 4-6 word tagline",
    "description": "2-3 sentences describing the item and its craftsmanship",
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
          const raw = JSON.parse(text) as GiftRecommendation[]
          recommendations = raw.map((r, i) => ({
            ...r,
            id: r.id || `rec-${i + 1}`,
            compatibilityScore: r.matchScore || r.compatibilityScore || 90,
            whyItFits: r.whyRecommended || r.whyItFits || "",
          }))
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
  const trait = body.personalityTraits?.[0] || "discerning taste"
  const name = body.recipientName || "them"

  return [
    {
      id: "rec-best-match",
      name: `Handcrafted Solid Brass ${mainInterest} Artifact & Presentation Box`,
      recommendationType: "Best Match",
      matchScore: 98,
      compatibilityScore: 98,
      estimatedPrice: Math.round(budget * 0.9),
      currency,
      category: "Artisanal Keepsake",
      whyRecommended: `Directly honors ${name}'s passion for ${mainInterest} with heirloom-grade metalwork that patinas beautifully over years, making it an everlasting reminder of your ${body.relationship.toLowerCase()} connection.`,
      whyItFits: `Directly honors ${name}'s passion for ${mainInterest} with heirloom-grade metalwork that patinas beautifully over years.`,
      budgetCompatibility: `Comfortably within target (${currency}${Math.round(budget * 0.9)} vs ${currency}${budget} budget)`,
      recipientCompatibility: `Harmonizes with their ${trait} and deep interest in ${mainInterest}`,
      alternativeSuggestions: [
        {
          name: `Matte Black Forged Iron ${mainInterest} Stand`,
          estimatedPrice: Math.round(budget * 0.75),
          differenceReason: "More industrial aesthetic with a slightly lighter budget",
        },
        {
          name: `Hand-Engraved Silver-Plated ${mainInterest} Token`,
          estimatedPrice: Math.round(budget * 0.98),
          differenceReason: "Includes custom commemorative engraving",
        },
      ],
      tagline: "An enduring piece that ages gracefully",
      description: `A custom-turned solid brass piece designed for ${mainInterest}, accompanied by a curated provenance certificate and presentation pouch.`,
      pros: ["Handcrafted durability", "Becomes more beautiful with age", "Heirloom grade"],
      cons: ["Requires gentle occasional buffing"],
      searchQuery: `Artisanal brass ${mainInterest} gift`,
      sentimentTone: "Heartfelt & Enduring",
      handwrittenNote: `To the one who taught me that the best things in life are made with quiet patience. Happy ${body.occasion}, ${name}.`,
    },
    {
      id: "rec-unique",
      name: `Custom Studio Celadon Vessel with Rare Harvest Botanical Pairing`,
      recommendationType: "Unique",
      matchScore: 95,
      compatibilityScore: 95,
      estimatedPrice: Math.round(budget * 0.85),
      currency,
      category: "Functional Art & Sensory",
      whyRecommended: `An unexpected, sensory pairing that takes ${name}'s love for ${secondaryInterest} and elevates it into a tactile everyday ritual that cannot be bought off department store shelves.`,
      whyItFits: `An unexpected, sensory pairing that elevates ${name}'s daily rituals into moments of intentional peace.`,
      budgetCompatibility: `Excellent value — leaves 15% budget buffer for luxury wrapping`,
      recipientCompatibility: `Appeals to their observant, refined nature and appreciation for one-of-a-kind craft`,
      alternativeSuggestions: [
        {
          name: `Hand-blown Amber Glass Incense Vessel`,
          estimatedPrice: Math.round(budget * 0.7),
          differenceReason: "Warmer visual tone suited for nightstand display",
        },
        {
          name: `Japanese Raku Ceramic Chawan with Match Ceremonial Set`,
          estimatedPrice: Math.round(budget * 0.95),
          differenceReason: "Complete ceremonial experience bundle",
        },
      ],
      tagline: "Quiet serenity for their personal sanctuary",
      description: `Wheel-thrown ceramic with crackle glaze paired with single-origin estate botanical teas harvested at first dawn.`,
      pros: ["One-of-a-kind studio piece", "Sensory calming experience", "Conversational display item"],
      cons: ["Delicate ceramic care required"],
      searchQuery: `Studio ceramic celadon handmade gift`,
      sentimentTone: "Poetic & Peaceful",
      handwrittenNote: `May every quiet morning bring you the warmth, peace, and beauty you give so freely to those around you.`,
    },
    {
      id: "rec-budget-friendly",
      name: `Limited Edition Archival Letterpress Anthology & Custom Bookplate`,
      recommendationType: "Budget Friendly",
      matchScore: 92,
      compatibilityScore: 92,
      estimatedPrice: Math.round(budget * 0.58),
      currency,
      category: "Archival Literature & Art",
      whyRecommended: `Delivers museum-quality thoughtfulness at nearly half the designated budget, proving deep care through tactile typography rather than expenditure.`,
      whyItFits: `Delivers museum-quality thoughtfulness at nearly half the designated budget.`,
      budgetCompatibility: `High-value saver — saves 42% of budget (${currency}${Math.round(budget * 0.58)})`,
      recipientCompatibility: `Captures their thoughtful, introspective side and passion for curated knowledge`,
      alternativeSuggestions: [
        {
          name: `Hand-Bound Japanese Washi Paper Notebook`,
          estimatedPrice: Math.round(budget * 0.45),
          differenceReason: "Pocket-sized for daily journaling on the go",
        },
        {
          name: `Custom Ex Libris Wax Seal Stamp with Sealing Wax Flight`,
          estimatedPrice: Math.round(budget * 0.6),
          differenceReason: "Interactive personalization tool for their book collection",
        },
      ],
      tagline: "Timeless depth without the luxury markup",
      description: `Heavyweight cotton paper printed on a 19th-century Heidelberg press, featuring custom blind-embossed typography and an archival provenance seal.`,
      pros: ["Remarkable value for craftsmanship", "Permanent library fixture", "Artisan printed"],
      cons: ["Specific to readers and creative thinkers"],
      searchQuery: `Letterpress limited edition collector gift`,
      sentimentTone: "Literary & Reverent",
      handwrittenNote: `For the stories we've shared and all the unwritten chapters still waiting ahead. Wishing you the warmest ${body.occasion}.`,
    },
    {
      id: "rec-premium",
      name: `Master-Grade Tuscan Leather ${mainInterest} Case with Brass Fittings`,
      recommendationType: "Premium",
      matchScore: 96,
      compatibilityScore: 96,
      estimatedPrice: Math.round(budget * 1.08),
      currency,
      category: "Heritage Leathercraft",
      whyRecommended: `A showstopper luxury investment piece crafted from vegetable-tanned Italian leather with hand-burnished edges, designed to serve ${name} for three decades.`,
      whyItFits: `A showstopper luxury investment piece crafted from vegetable-tanned Italian leather.`,
      budgetCompatibility: `Slight luxury stretch (+8% over target budget, worthwhile heirloom)`,
      recipientCompatibility: `Flawlessly complements ${name}'s ${trait} and lifelong journey with ${mainInterest}`,
      alternativeSuggestions: [
        {
          name: `Canvas & Horween Leather Travel Carrier`,
          estimatedPrice: Math.round(budget * 0.98),
          differenceReason: "Lighter weight and sits directly on budget",
        },
        {
          name: `Bespoke Cordovan Leather Pocket Card Sleeve`,
          estimatedPrice: Math.round(budget * 0.92),
          differenceReason: "Compact daily carry alternative in rare Shell Cordovan",
        },
      ],
      tagline: "An heirloom crafted for the next 30 years",
      description: `Hand-cut from full-grain vegetable-tanned hide and hand-stitched with waxed linen thread. Ages into a rich, deep caramel patina over time.`,
      pros: ["Unrivaled durability and aroma", "Hand-stitched saddle seam", "Heirloom caliber"],
      cons: ["Small budget stretch"],
      searchQuery: `Full grain leather handcrafted bespoke case`,
      sentimentTone: "Warm & Celebratory",
      handwrittenNote: `Some things only grow more remarkable with time — just like our friendship. Celebrate this milestone in style, ${name}.`,
    },
    {
      id: "rec-personalized",
      name: `Custom Hand-Engraved Constellation & Memory Coordinate Token`,
      recommendationType: "Personalized",
      matchScore: 97,
      compatibilityScore: 97,
      estimatedPrice: Math.round(budget * 0.88),
      currency,
      category: "Custom Engraved Memorial",
      whyRecommended: `Deeply sentimental and personalized with the exact night-sky coordinates of your most memorable shared moment or this ${body.occasion} milestone.`,
      whyItFits: `Deeply sentimental and personalized with exact coordinates of your special milestone.`,
      budgetCompatibility: `Under budget with complimentary custom engraving included`,
      recipientCompatibility: `Maximum emotional resonance tailored specifically to the bond between you and ${name}`,
      alternativeSuggestions: [
        {
          name: `Embossed Coordinate Leather Keychain with Hidden Audio QR`,
          estimatedPrice: Math.round(budget * 0.65),
          differenceReason: "Includes a voice note link hidden inside the leather flap",
        },
        {
          name: `Framed Hand-Drawn Cartographic Map of Milestone Location`,
          estimatedPrice: Math.round(budget * 0.92),
          differenceReason: "Wall-hung visual art piece ready for framing",
        },
      ],
      tagline: "A memory frozen in solid metal",
      description: `Solid sterling silver or jeweler's brass coin custom engraved with precise astrological coordinates, longitude/latitude, and an intimate secret inscription.`,
      pros: ["100% unique to your relationship", "Secret engraving on reverse", "Pocket talisman"],
      cons: ["Production takes 3-5 days for custom engraving"],
      searchQuery: `Custom engraved coordinate coin talisman gift`,
      sentimentTone: "Intimate & Nostalgic",
      handwrittenNote: `A reminder of where we've been, how far you've come, and every milestone yet to unfold. With love, always.`,
    },
  ]
}

