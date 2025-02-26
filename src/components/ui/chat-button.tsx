import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, ButtonLink, buttonVariants } from "./button";
import * as Icon from '@geist-ui/icons'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar";
import { useState, useRef, useEffect } from "react";
import { toast } from "../ui/use-toast";

interface ChatButtonProps {
  id: string;
  topic: string | null;
  onDelete?: (id: string) => void;
  onClick?: () => void;
  isMobile?: boolean;
}

const deleteChat = async (chatId: string) => {
  const response = await fetch("/api/chat/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chat_id: chatId }),
  });
  if (!response.ok) throw new Error("Failed to delete chat");
};

export function ChatButton({ id, topic, onDelete, onClick, isMobile = false }: ChatButtonProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [chatName, setChatName] = useState(topic || "New Chat");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const deleteChatMutation = useMutation({
    mutationFn: async (chatId: string) => {
      const response = await fetch("/api/chat/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId: chatId }),
      });
      if (!response.ok) throw new Error("Failed to delete chat");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      onDelete?.(id);
    },
  });

  const renameChatMutation = useMutation({
    mutationFn: async ({ chatId, newName }: { chatId: string; newName: string }) => {
      const response = await fetch(`/api/chat/${chatId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: newName }),
      });
      if (!response.ok) throw new Error("Failed to rename chat");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      toast({
        title: "Chat renamed",
        description: `Chat has been renamed to "${chatName}"`,
        duration: 3000,
      });
      setIsEditing(false);
    },
    onError: () => {
      setChatName(topic || "New Chat");
      toast({
        title: "Error",
        description: "Failed to rename chat",
        variant: "destructive",
      });
      setIsEditing(false);
    },
  });

  const handleSave = () => {
    if (!chatName.trim()) {
      setChatName(topic || "New Chat");
      setIsEditing(false);
      return;
    }

    if (chatName === topic) {
      setIsEditing(false);
      return;
    }

    renameChatMutation.mutate({ chatId: id, newName: chatName });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      setChatName(topic || "New Chat");
      setIsEditing(false);
    }
    e.stopPropagation();
  };

  if (isEditing) {
    return (
      <div className={cn("group relative flex items-center w-full p-2", buttonVariants({ variant: "ghost" }))}>
        <input
          ref={inputRef}
          type="text"
          value={chatName}
          onChange={(e) => setChatName(e.target.value)}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 bg-transparent border-none focus:outline-none text-sm"
          maxLength={50}
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSave();
          }}
          className="z-10 p-1 shrink-0 text-muted-foreground hover:text-foreground"
          title="Save"
        >
          <Icon.Check size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setChatName(topic || "New Chat");
            setIsEditing(false);
          }}
          className="z-10 p-1 shrink-0 text-muted-foreground hover:text-destructive"
          title="Cancel"
        >
          <Icon.X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className={cn("group relative flex items-center w-full", buttonVariants({ variant: "ghost" }))}>
      <Icon.MessageCircle className="!h-4 !w-4 shrink-0 text-muted-foreground" />
      <Link
        href={`/chat/${id}`}
        onClick={onClick}
        className="flex-1 ml-1 text-sm text-muted-foreground group-hover:text-foreground truncate ..."
        title={topic ?? "New Chat"}
      >
        <div className="truncate ">{topic || "New Chat"}</div>
        <span className="absolute inset-0"></span>
      </Link>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
        }}
        className="z-10 p-1 shrink-0 text-muted-foreground opacity-0 transition-all hover:text-foreground group-hover:opacity-100"
        title="Rename chat"
      >
        <Icon.Edit size={16} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteChatMutation.mutate(id);
        }}
        className="z-10 p-1 shrink-0 text-muted-foreground opacity-0 transition-all hover:text-destructive group-hover:opacity-100"
        title="Delete chat"
      >
        <Icon.Trash2 size={16} />
      </button>
    </div>
  );
}

export function NewChatButton() {
  const { setOpenMobile } = useSidebar();

  return (
    <ButtonLink 
      title="Create New Chat" 
      size="icon" 
      variant="ghost" 
      href="/" 
      className="h-8 w-8"
      onClick={() => setOpenMobile(false)}
    >
      <Icon.PlusSquare aria-hidden className="!h-5 !w-5 text-muted-foreground hover:text-foreground" />
      <span className="sr-only">New Chat</span>
    </ButtonLink>
  );
}
