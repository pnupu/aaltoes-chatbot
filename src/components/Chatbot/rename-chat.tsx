"use client";

import { useState, useEffect, useRef } from "react";
import { Pencil, Check, X } from "lucide-react";
import { toast } from "../../components/ui/use-toast";
import { cn } from "@/lib/utils";

interface RenameChatProps {
  chatId: string;
  initialName?: string;
  className?: string;
}

export function RenameChat({ chatId, initialName = "New chat", className }: RenameChatProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [chatName, setChatName] = useState(initialName);
  const [originalName, setOriginalName] = useState(initialName);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch the chat name when the component mounts or chatId changes
  useEffect(() => {
    const fetchChatName = async () => {
      try {
        const response = await fetch(`/api/chat/${chatId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.topic) {
            setChatName(data.topic);
            setOriginalName(data.topic);
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

  // Focus the input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (!chatName.trim()) {
      setChatName(originalName);
      setIsEditing(false);
      return;
    }

    if (chatName === originalName) {
      setIsEditing(false);
      return;
    }

    try {
      const response = await fetch(`/api/chat/${chatId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: chatName }),
      });

      if (response.ok) {
        setOriginalName(chatName);
        toast({
          title: "Chat renamed",
          description: `Chat has been renamed to "${chatName}"`,
          duration: 3000,
        });
      } else {
        setChatName(originalName);
        toast({
          title: "Error",
          description: "Failed to rename chat",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error renaming chat:", error);
      setChatName(originalName);
      toast({
        title: "Error",
        description: "Failed to rename chat",
        variant: "destructive",
      });
    }

    setIsEditing(false);
  };

  const handleCancel = () => {
    setChatName(originalName);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {isEditing ? (
        <div className="flex items-center gap-1">
          <input
            ref={inputRef}
            type="text"
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full max-w-[200px] rounded-md border border-input bg-background px-3 py-1 text-sm"
            placeholder="Chat name"
            maxLength={50}
          />
          <button
            onClick={handleSave}
            className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            title="Save"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={handleCancel}
            className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            title="Cancel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <h2 className="text-sm font-medium text-foreground truncate max-w-[200px]" title={chatName}>
            {chatName}
          </h2>
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            title="Rename chat"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
} 