"use client";

import { useEffect, useRef, useState } from "react";

export default function InterviewChatPane({ messages, setMessages }: any) {
  const ref = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {

  //   return () =>
  // }, []);

  useEffect(() => {
    ref.current?.scrollTo({
      top: ref.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex h-full flex-col">
      <div ref={ref} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m: any, i: any) => (
          <div key={i} className="flex">
            <div
              className={`max-w-[80%] rounded-lg border px-3 py-2 text-sm ${
                m.role === "assistant"
                  ? "bg-muted"
                  : "ml-auto bg-primary text-primary-foreground"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
