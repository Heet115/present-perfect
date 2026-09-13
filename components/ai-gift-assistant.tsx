"use client"

import * as React from "react"
import {
  MessageSquare,
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Loader2,
  RefreshCw,
  Lightbulb,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AssistantMessage } from "@/lib/types/recommendation"

interface AiGiftAssistantProps {
  recipientContext?: {
    name?: string
    relationship?: string
    occasion?: string
    budget?: number
    currency?: string
    interests?: string[]
    personalityTraits?: string[]
  }
  onApplyPrompt?: (promptText: string) => void
}

const suggestedPrompts = [
  "How can I make a modest budget feel like bespoke luxury?",
  "What are subtle cues that someone appreciates functional art?",
  "Suggest unexpected anniversary ideas beyond generic jewelry.",
  "What is an unforgettable keepsake for an avid coffee lover?",
]

export function AiGiftAssistant({
  recipientContext,
  onApplyPrompt,
}: AiGiftAssistantProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<AssistantMessage[]>([
    {
      id: "initial-1",
      role: "assistant",
      content: `Welcome to Present Perfect's Atelier Concierge. I am here to help you uncover the subtle nuances that turn a simple present into a cherished memory. Who are you looking to delight today?`,
      timestamp: Date.now(),
    },
  ])
  const [inputText, setInputText] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim()
    if (!query || isLoading) return

    const userMsg: AssistantMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInputText("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          recipientContext,
        }),
      })

      const data = await res.json()
      const botMsg: AssistantMessage = {
        id: `ast-${Date.now()}`,
        role: "assistant",
        content: data.reply || "I am reflecting on your request. Let us continue exploring.",
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, botMsg])
    } catch (err) {
      console.error("Chat error:", err)
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "I apologize, my atelier connection was interrupted. Please try again.",
          timestamp: Date.now(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Floating Concierge Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-12 px-5 rounded-full shadow-xl bg-warm-mocha text-warm-ivory hover:bg-warm-mocha/90 border border-warm-sand/40 gap-2 font-serif text-sm cursor-pointer transition-all duration-300"
        >
          <Sparkles className="size-4 text-warm-parchment animate-pulse" />
          <span>{isOpen ? "Close Concierge" : "AI Gift Assistant"}</span>
        </Button>
      </div>

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-22 right-6 z-40 w-full max-w-sm sm:max-w-md h-[540px] max-h-[80vh] flex flex-col rounded-3xl border border-border/80 bg-card/95 backdrop-blur-md shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="p-4 bg-linear-to-r from-warm-mocha via-warm-sand to-warm-parchment text-warm-ivory flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-full bg-warm-ivory/20 flex items-center justify-center">
                <Sparkles className="size-4 text-warm-ivory" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base leading-none">
                  Atelier Concierge
                </h3>
                <span className="text-[10px] text-warm-ivory/80">
                  {recipientContext?.name
                    ? `Advising for ${recipientContext.name}`
                    : "Bespoke Gifting Advisor"}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="size-7 rounded-full hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 text-xs"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${
                  m.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`size-6 rounded-full shrink-0 flex items-center justify-center text-[10px] ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground font-bold"
                      : "bg-secondary text-primary border border-border/60"
                  }`}
                >
                  {m.role === "user" ? <User className="size-3.5" /> : <Bot className="size-3.5" />}
                </div>

                <div
                  className={`p-3 rounded-2xl max-w-[82%] leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-xs"
                      : "bg-secondary/40 text-foreground border border-border/50 rounded-tl-xs"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground italic text-xs pl-8">
                <Loader2 className="size-3 animate-spin" />
                <span>Concierge is meditating on ideas...</span>
              </div>
            )}
          </div>

          {/* Suggested Quick Prompts */}
          <div className="px-3 py-2 border-t border-border/40 bg-secondary/20 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <Lightbulb className="size-3 text-primary shrink-0 ml-1" />
            {suggestedPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className="shrink-0 text-[10px] px-2.5 py-1 rounded-full bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all cursor-pointer whitespace-nowrap"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="p-3 border-t border-border/60 bg-card flex items-center gap-2"
          >
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask for advice, vibes, or refinement..."
              className="h-9 text-xs bg-background/70 rounded-xl"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !inputText.trim()}
              className="size-9 rounded-xl shrink-0 cursor-pointer"
            >
              <Send className="size-3.5" />
            </Button>
          </form>
        </div>
      )}
    </>
  )
}
