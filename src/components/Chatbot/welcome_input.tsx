"use client";

import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { Send, MessageCircle } from "@geist-ui/icons";
import { useSession } from "next-auth/react";
import { useChat } from "ai/react";
import cuid from "cuid";
import { useQueryClient } from "@tanstack/react-query";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { useModel } from "@/hooks/use-model";

export default function WelcomeInput() {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const router = useRouter();

  const [id, setId] = useState(() => cuid());
  useEffect(() => {
    setId(cuid());
  }, []);

  const model = useModel(); 

  const queryClient = useQueryClient();

  const { append } = useChat({
    id: id,
    api: "/api/chat",
    headers: {
      model: model,
      num_messages: "0",
    },
    body: {
      id: id,
    },
    initialMessages: [],
    onError: (error) => {
      console.error("Welcome input error:", error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user) {
      router.push("/api/auth/signin");
    } else {
      if (!content.trim()) return;
      try {
        const response = await fetch("/api/chat/create", {
          method: "POST",
          body: JSON.stringify({ 
            chatId: id, 
            content: content,
            model: model 
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to create chat");

        append({
          role: "user",
          content: content,
          id: id,
        });
        queryClient.refetchQueries({
          queryKey: ["chats", { userId: session.user.id }],
        });
        router.push(`/chat/${id}`);
      } catch (error) {
        console.error("Error creating chat:", error);
      }
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-2">
      <div className="relative rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="mb-6 flex items-center justify-center">
          <div className="rounded-full bg-primary/10 p-3">
            <MessageCircle className="h-6 w-6 text-primary" />
          </div>
        </div>

        <h1 className="mb-2 text-center text-2xl font-semibold text-foreground">
          How can I help you today?
        </h1>

        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your message here..."
            className={cn(
              "w-full resize-none rounded-lg border bg-background text-base text-foreground",
              "placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "min-h-[100px] py-3.5 px-4 pr-12",
              "shadow-sm transition-shadow duration-200",
              "focus:shadow-md"
            )}
            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={!content.trim()}
            className="absolute bottom-3 right-3 rounded-lg p-2 text-muted-foreground transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
            title="Send message"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-muted-foreground">
          Press Enter to send • Shift + Enter for new line
        </div>
      </div>
    </div>
  );
}
