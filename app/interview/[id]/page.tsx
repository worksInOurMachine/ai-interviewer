"use client";
import VideoPreview from "@/components/video-preview";
import InterviewChatPane from "@/components/interview-chat-pane";
import InterviewControls from "@/components/interview-controls";
import { Card } from "@/components/ui/card";
import { useStrapi } from "@/lib/api/useStrapi";
import { useEffect, useState } from "react";
import { useChat } from "./useChat";

type Message = { role: "assistant" | "user"; content: string };

export default function InterviewPage({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState<Message[]>([]);

  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [mode, setMode] = useState<"voice" | "text">("voice");
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const { sendMessage, isLoading: isChatLoading } = useChat({
    messages,
    setMessages,
    setAiSpeaking,
  });

  const { data, error, isLoading } = useStrapi("interviews", {
    populate: "*",
    filters: { documentId: params.id },
  });

  const interviewData: any = data?.data;
  const interviewDetails = {
    topic: interviewData?.[0]?.details || "",
    difficulty: interviewData?.[0]?.difficulty || "medium",
    mode: interviewData?.[0]?.mode || "text",
    numOfQuestions: interviewData?.[0]?.numberOfQuestions,
    skills: interviewData?.[0]?.skills || [],
  };
  const resumeUrl = `${interviewData?.[0]?.resume[0]?.url}`;

  console.log(resumeUrl)

  const initialGreetings = async () => {
    try {
      const content = [
        {
          type: "image_url",
          image_url: {
            url: resumeUrl
          },
        },
        { type: "text", text: "" },
      ];
      console.log("Initial Greetings with resume:", content);
      await sendMessage({ content, interviewDetails });
    } catch (error) { }
  };

  useEffect(() => {
    if (
      messages.length === 0 &&
      resumeUrl &&
      interviewData &&
      interviewDetails
    ) {
      initialGreetings();
    }
  }, [resumeUrl, messages, interviewData, interviewDetails]);

  async function handleSend(content: string) {
    console.log(content);
    if (!content) return;

    await sendMessage({ content, interviewDetails });
    setText("");
  }

  if (isLoading) {
    return <div>Loading interview...</div>;
  }

  return (
    <main className="grid min-h-[80vh]  scroll-smooth grid-rows-[auto_1fr]">
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold">Interview Session</h1>
          <div className="text-sm text-muted-foreground">ID: {params.id}</div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-15">
        {/* Left: Full-height user video */}
        <section className="order-2 md:order-1 md:col-span-7">
          <Card className="m-4 h-[calc(100vh-120px)] overflow-hidden p-0 md:m-6">
            <VideoPreview />
          </Card>
        </section>

        {/* Right: AI text panel and controls */}
        <aside className="order-1 md:order-2 md:col-span-8">
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
