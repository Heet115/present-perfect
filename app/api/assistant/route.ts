import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

export async function POST(req: Request) {
  try {
    const { messages, recipientContext } = await req.json()
    const apiKey = process.env.GEMINI_API_KEY

    const systemInstruction = `
You are the Present Perfect AI Gift Concierge. You speak with warm, understated luxury, refined editorial taste, and deep empathy.
Your goal is to converse with the user to help them discover, brainstorm, and refine the perfect gift for someone special.
Keep responses thoughtful, engaging, and concise (2-4 paragraphs max). Do not offer generic retail links or plastic novelties.

Current Recipient Context:
- Name: ${recipientContext?.name || "The Recipient"}
- Relationship: ${recipientContext?.relationship || "Unspecified"}
- Occasion: ${recipientContext?.occasion || "Celebration"}
- Budget: ${recipientContext?.currency || "₹"}${recipientContext?.budget || "Flexible"}
- Interests: ${recipientContext?.interests?.join(", ") || "General arts, lifestyle, design"}
- Traits: ${recipientContext?.personalityTraits?.join(", ") || "Thoughtful"}
`

    if (apiKey && !apiKey.startsWith("AQ.placeholder")) {
      try {
        const ai = new GoogleGenAI({ apiKey })
        const formattedHistory = (messages || []).map((m: { role: string; content: string }) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        }))

        const chat = ai.chats.create({
          model: "gemini-2.5-flash",
          config: {
            systemInstruction,
          },
          history: formattedHistory.slice(0, -1),
        })

        const lastMsg = messages[messages.length - 1]?.content || "Hello"
        const result = await chat.sendMessage({ message: lastMsg })
        const reply = result.text?.trim()

        if (reply) {
          return NextResponse.json({ reply })
        }
      } catch (geminiErr) {
        console.warn("Assistant Gemini call failed, using concierge fallback:", geminiErr)
      }
    }

    // High-touch conversational fallback
    const lastUserMsg = messages[messages.length - 1]?.content?.toLowerCase() || ""
    let fallbackReply = `I'd be delighted to help you find something truly unforgettable for ${
      recipientContext?.name || "your recipient"
    }. `

    if (lastUserMsg.includes("cheaper") || lastUserMsg.includes("budget")) {
      fallbackReply += `Thoughtfulness never relies on high expenditure. For ${
        recipientContext?.name || "them"
      }, I suggest focusing on bespoke letterpress, custom hand-poured botanical candles, or single-origin estate harvests. These feel profoundly luxurious while respecting a modest budget.`
    } else if (lastUserMsg.includes("unique") || lastUserMsg.includes("different")) {
      fallbackReply += `If you're seeking the unexpected, look toward studio ceramists, limited-run independent press editions, or custom coordinate artifacts. Pieces with tactile provenance stand far apart from mainstream gifts.`
    } else if (lastUserMsg.includes("practical") || lastUserMsg.includes("useful")) {
      fallbackReply += `For practical refinement, we focus on elevated everyday rituals: full-grain Italian leather desk folios, hand-turned solid brass bookmarks, or heirloom coffee pour-over carafes that they will cherish every morning.`
    } else if (lastUserMsg.includes("romantic") || lastUserMsg.includes("partner")) {
      fallbackReply += `For romantic milestones, prioritize intimate memory keepsakes: solid sterling tokens with the exact constellation of your anniversary, or a hand-bound linen album embossed with an intimate inscription.`
    } else {
      fallbackReply += `Tell me a little more about their daily rituals, what they reach for on Sunday mornings, or an inside joke you share, and I'll curate an exquisite bespoke recommendation.`
    }

    return NextResponse.json({ reply: fallbackReply })
  } catch (error) {
    console.error("Assistant API error:", error)
    return NextResponse.json(
      { error: "Concierge assistant is currently resting. Please try again shortly." },
      { status: 500 }
    )
  }
}
