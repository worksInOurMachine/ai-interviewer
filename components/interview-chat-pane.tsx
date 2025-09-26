"use client"

import { useEffect, useRef, useState } from "react"

type Message = { role: "ai" | "user"; content: string }

export default function InterviewChatPane() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Welcome! We'll start with a brief introduction. Tell me about yourself." },
  ])
  const ref = useRef<HTMLDivElement | null>(null)

  // Expose a basic event bus for demo purposes (UI-only)
  useEffect(() => {
    function onSend(e: CustomEvent<{ content: string }>) {
      setMessages((m) => [...m, { role: "user", content: e.detail.content }])
      setTimeout(() => {
        setMessages((m) => [
          ...m,
          { role: "ai", content: "Thanks. Let's dive deeper into your recent project and decisions." },
        ])
      }, 1400)
    }
    window.addEventListener("interview:send", onSend as EventListener)
    return () => window.removeEventListener("interview:send", onSend as EventListener)
  }, [])

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex h-full flex-col">
      <div ref={ref} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div key={i} className="flex">
            <div
              className={`max-w-[80%] rounded-lg border px-3 py-2 text-sm ${
                m.role === "ai" ? "bg-muted" : "ml-auto bg-primary text-primary-foreground"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
