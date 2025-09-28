"use client";

import { useEffect, useState, useRef } from "react";
import AISpeakingBars from "./ai-speaking-bars";
import MicVisualizer from "./mic-visualizer";
import SegmentedToggle from "./segmented-toggle";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function InterviewControls({
  aiSpeaking,
  mode,
  listening,
  text,
  // setAiSpeaking,
  setMode,
  setListening,
  setText,
  handleSend,
}: {
  aiSpeaking: boolean;
  mode: "voice" | "text";
  listening: boolean;
  text: string;
  // setAiSpeaking: (speaking: boolean) => void;
  setMode: (mode: "voice" | "text") => void;
  setListening: (listening: boolean | ((prev: boolean) => boolean)) => void;
  setText: (text: string) => void;
  handleSend: (text: string) => void;
}) {
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Init speech recognition only once
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setText(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, [setText, setListening]);

  // Start / Stop mic listening
  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (listening) {
      recognition.start();
    } else {
      recognition.stop();
    }
  }, [listening]);

  useEffect(() => {
    if (!aiSpeaking) return;
    setListening(false);
  }, [aiSpeaking, setListening]);

  return (
    <div className="w-full">
      {aiSpeaking ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 p-3">
            <div className="h-8 w-8 rounded-full bg-muted" aria-hidden />
            <div className="text-sm text-muted-foreground">
              AI is responding...
            </div>
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
                {listening
                  ? "Listening... speak your answer"
                  : "Tap mic to start speaking"}
              </motion.div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setListening((s) => !s)}
                  className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow hover:opacity-90"
                >
                  {listening ? "Stop" : "Start"} Mic
                </button>
                {text && (
                  <button
                    onClick={() => {
                      setListening(false);
                      handleSend(text.trim());
                      setText(""); // clear after send
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
                  if (e.key === "Enter" && text.trim()) {
                    handleSend(text.trim());
                    setText("");
                  }
                }}
              />
              <button
                onClick={() => {
                  if (text.trim()) {
                    handleSend(text.trim());
                    setText("");
                  }
                }}
                className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow hover:opacity-90"
              >
                Send
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
