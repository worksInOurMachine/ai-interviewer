import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast";

const MAX_MESSAGES = 100 // Limit to prevent localStorage from getting too large

export function useChat({messages=[],setMessages=()=>{},setAiSpeaking=()=>{}}:any) {
  const [isLoading, setIsLoading] = useState(false)


  const sendMessage = useCallback(
  async ({content,interviewDetails}:any): Promise<void> => {

    let userMessage:any

    if (!content) {
      return;
    }
      userMessage = Array.isArray(content) ? {
        id: crypto.randomUUID(),
        role: "user",
        content: [...content],
        timestamp: new Date(),
      } : {
      id: crypto.randomUUID(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    console.log("User Message:", userMessage);

    setMessages((prev:any) => [...prev, userMessage]);
    setIsLoading(true);

    const conversationHistory = [...messages, userMessage];
    const recentHistory = conversationHistory.slice(-20);

    const apiMessages = recentHistory.map(({ role, content }) => ({
      role,
      content,
    }));

      setAiSpeaking(true);


    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          stream: true,
          interviewDetails
        }),
      });

      if (!response.ok || !response.body) {
        toast("Something went wrong...");
        return;
      }

    const contentType = response.headers.get("Content-Type") || "";


    console.log("Response Content-Type:", contentType);

//  if (!contentType.includes("text/plain")) {

//         const data = await response.json();

//           const aiMessage: Message = {
//             id: crypto.randomUUID(),
//             role: "assistant",
//             content: data.message,
//             timestamp: new Date(),
//             isImage: true,
//             imageUrl: data.imageUrl,
//             imagePrompt: data.imagePrompt,
//           };

//           setMessages((prev) => [...prev, aiMessage]);

//         setIsLoading(false);
//         return;
//       }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let aiContent = "";

      const aiMessage: any = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };

      setMessages((prev:any) => [...prev, aiMessage]);

      let buffer = "";
      

while (true) {
  const { value, done } = await reader.read();
  if (done) break;

  buffer += decoder.decode(value, { stream: true });

  let lines = buffer.split("\n");

  buffer = lines.pop() || "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data:")) continue;

    const jsonStr = trimmed.replace("data:", "").trim();

    if (jsonStr === "[DONE]") {
      buffer = "";
      break;
    }

    try {
      const parsed = JSON.parse(jsonStr);
      const contentPiece = parsed.choices?.[0]?.delta?.content;

      if (contentPiece) {
        aiContent += contentPiece;

        setMessages((prev:any) => {
          const updated = [...prev];
          const lastIndex = updated.findLastIndex(
            (m) => m.role === "assistant"
          );
          if (lastIndex !== -1) {
            updated[lastIndex] = {
              ...updated[lastIndex],
              content: aiContent,
            };
          }
          return updated;
        });

         await new Promise((r) => setTimeout(r, 10));

      }
    } catch (err) {
      console.error("❌ Stream parse error:", jsonStr, err);
    }
  }
}
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Oops! Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
      setAiSpeaking(false);
    }
  },
  [messages, toast]
);

  return {
    messages,
    isLoading,
    sendMessage,
  }
}