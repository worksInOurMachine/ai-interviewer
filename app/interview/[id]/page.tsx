"use client";
import VideoPreview from "@/components/video-preview";
import InterviewChatPane from "@/components/interview-chat-pane";
import InterviewControls from "@/components/interview-controls";
import { Card } from "@/components/ui/card";
import { useStrapi } from "@/lib/api/useStrapi";
import { useState } from "react";

type Message = { role: "assistant" | "user"; content: string };

export default function InterviewPage({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Welcome! We'll start with a brief introduction. Tell me about yourself.",
    },
  ]);

  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [mode, setMode] = useState<"voice" | "text">("voice");
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");

  function handleSend(content: string) {
    console.log(content);
    setText("");
    setMessages((prev) => [...prev, { role: "user", content }]);
    setAiSpeaking(true);
  }

  const { data, error, isLoading } = useStrapi("interviews", {
    documentId: params.id,
    populate: "*",
  });

  return (
    <main className="grid min-h-screen grid-rows-[auto_1fr]">
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold">Interview Session</h1>
          <div className="text-sm text-muted-foreground">ID: {params.id}</div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        {/* Left: Full-height user video */}
        <section className="order-2 md:order-1 md:col-span-7">
          <Card className="m-4 h-[calc(100vh-120px)] overflow-hidden p-0 md:m-6">
            <VideoPreview />
          </Card>
        </section>

        {/* Right: AI text panel and controls */}
        <aside className="order-1 md:order-2 md:col-span-5">
          <div className="m-4 flex h-[calc(100vh-120px)] flex-col gap-4 md:m-6">
            <Card className="flex-1 overflow-hidden">
              <InterviewChatPane
                messages={messages}
                setMessages={setMessages}
              />
            </Card>
            <Card className="p-0">
              <InterviewControls
                aiSpeaking={aiSpeaking}
                mode={mode}
                listening={listening}
                text={text}
                setAiSpeaking={setAiSpeaking}
                setMode={setMode}
                setListening={setListening}
                setText={setText}
                handleSend={handleSend}
              />
            </Card>
          </div>
        </aside>
      </div>
    </main>
  );
}
