"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ChatNameProps {
  chatId: string;
  className?: string;
}

export function ChatName({ chatId, className }: ChatNameProps) {
  const [chatName, setChatName] = useState("New chat");

  // Fetch the chat name when the component mounts or chatId changes
  useEffect(() => {
    const fetchChatName = async () => {
      try {
        const response = await fetch(`/api/chat/${chatId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.topic) {
            setChatName(data.topic);
          }
        }
      } catch (error) {
        console.error("Error fetching chat name:", error);
      }
    };

    if (chatId) {
      fetchChatName();
    }
  }, [chatId]);

  return (
    <div className={cn("px-4", className)}>
      <h2 
        className="text-base font-semibold text-foreground truncate max-w-[300px] text-center" 
        title={chatName}
      >
        {chatName}
      </h2>
    </div>
  );
} 