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
    <div className="flex h-full flex-col ">
      <div
        ref={ref}
        className="flex-1 space-y-3 no-scrollbar overflow-y-auto p-4"
      >
        {messages.slice(1).map((m: any, i: any) => (
          <div key={i} className="flex">
            <div
              className={`max-w-[80%] rounded-lg border break-words whitespace-pre-wrap px-3 py-2 text-sm ${
                m.role === "assistant"
                  ? "bg-muted"
                  : "ml-auto bg-primary text-primary-foreground"
              }`}
            >
              {Array.isArray(m.content)
                ? m.content?.map((cont: any, i: any) => {
                    return (
                      <div key={i} className="">
                        {cont.type == "image_url" ? (
                          <img
                            className="my-2 max-h-96 w-auto rounded-md border"
                            alt="Generated"
                            src={cont.image_url.url}
                          />
                        ) : (
                          cont.text
                        )}
                      </div>
                    );
                  })
                : m.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
