"use client"

import { useEffect, useState } from "react"
import AISpeakingBars from "./ai-speaking-bars"
import MicVisualizer from "./mic-visualizer"
import SegmentedToggle from "./segmented-toggle"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

export default function InterviewControls() {
  const [aiSpeaking, setAiSpeaking] = useState(false)
  const [mode, setMode] = useState<"voice" | "text">("voice")
  const [listening, setListening] = useState(false)
  const [text, setText] = useState("")

  function simulateAIResponse() {
    setAiSpeaking(true)
    setTimeout(() => setAiSpeaking(false), 1600)
  }

  function handleSend(content: string) {
    window.dispatchEvent(new CustomEvent("interview:send", { detail: { content } }))
    simulateAIResponse()
    setText("")
  }

  useEffect(() => {
    if (!aiSpeaking) return
    setListening(false)
  }, [aiSpeaking])

  return (
    <div className="w-full">
      {aiSpeaking ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 p-3">
            <div className="h-8 w-8 rounded-full bg-muted" aria-hidden />
            <div className="text-sm text-muted-foreground">AI is responding...</div>
          </div>
          <AISpeakingBars />
        </div>
      ) : (
        <div className="p-4">
          <SegmentedToggle
            value={mode}
            onChange={(v) => setMode(v as "voice" | "text")}
            options={[
              { label: "Voice", value: "voice" },
              { label: "Text", value: "text" },
            ]}
          />

          {/* Voice */}
          {mode === "voice" && (
            <div className="mt-4 flex flex-col items-center gap-4">
              <MicVisualizer active={listening} />
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-muted-foreground"
              >
                {listening ? "Listening... speak your answer" : "Tap mic to start speaking"}
              </motion.div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setListening((s) => !s)}
                  className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow hover:opacity-90"
                >
                  {listening ? "Stop" : "Start"} Mic
                </button>
                {listening && (
                  <button
                    onClick={() => {
                      setListening(false)
                      handleSend("Spoken answer (transcript)")
                    }}
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    Send Answer
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Text */}
          {mode === "text" && (
            <div className="mt-4 flex items-center gap-2">
              <Input
                placeholder="Type your answer..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && text.trim()) handleSend(text.trim())
                }}
              />
              <button
                onClick={() => text.trim() && handleSend(text.trim())}
                className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow hover:opacity-90"
              >
                Send
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
