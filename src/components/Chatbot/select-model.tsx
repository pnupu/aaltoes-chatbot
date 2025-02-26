"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useModel } from "@/hooks/use-model";
import { toast } from "../ui/use-toast";
import { MODELS } from "@/lib/constants";

export function SelectModel({ chatId }: { chatId?: string }) {
  const defaultModel = useModel();
  const [model, setModel] = useState<string>(defaultModel);

  // Fetch the chat model when the component mounts or chatId changes
  useEffect(() => {
    if (!chatId) return;

    const fetchChatModel = async () => {
      try {
        const response = await fetch(`/api/chat/${chatId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.model) {
            setModel(data.model);
          }
        }
      } catch (error) {
        console.error("Error fetching chat model:", error);
      }
    };

    fetchChatModel();
  }, [chatId]);

  const handleModelChange = async (value: string) => {
    setModel(value);
    
    // If we have a chatId, update the model for this chat
    if (chatId) {
      try {
        const response = await fetch(`/api/chat/${chatId}/model`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ model: value }),
        });

        if (response.ok) {
          toast({
            title: "Model changed",
            description: `Chat is now using ${value}`,
            duration: 3000,
          });
          
          // Trigger a storage event to notify other components
          // Use a custom event instead of localStorage to avoid page reload
          const modelChangeEvent = new CustomEvent('modelChange', { 
            detail: { model: value, chatId } 
          });
          window.dispatchEvent(modelChangeEvent);
        } else {
          console.error("Failed to update model");
          toast({
            title: "Error",
            description: "Failed to update model",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error updating model:", error);
        toast({
          title: "Error",
          description: "Error updating model",
          variant: "destructive",
        });
      }
    } else {
      // If no chatId, just update the default model in localStorage
      localStorage.setItem("model", value);
      toast({
        title: "Default model changed",
        description: `Default model is now ${value}`,
        duration: 3000,
      });
      
      // Dispatch event for default model change
      const modelChangeEvent = new CustomEvent('defaultModelChange', { 
        detail: { model: value } 
      });
      window.dispatchEvent(modelChangeEvent);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={model} onValueChange={handleModelChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select model" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(MODELS).map((modelId) => (
            <SelectItem key={modelId} value={modelId}>
              {getModelDisplayName(modelId)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// Function to get a display name for the model
function getModelDisplayName(modelId: string) {
  switch (modelId) {
    case "gpt-4o-mini":
      return "GPT-4o Mini";
    case "gpt-4o":
      return "GPT-4o";
    case "gpt-4":
      return "GPT-4";
    case "deepseek-chat":
      return "DeepSeek Chat";
    case "deepseek-reasoner":
      return "DeepSeek Reasoner";
    case "claude-3-opus-20240229":
      return "Claude 3 Opus";
    case "claude-3-5-sonnet-20241022":
      return "Claude 3.5 Sonnet";
    case "claude-3-7-sonnet-20250219":
      return "Claude 3.7 Sonnet";
    default:
      return modelId;
  }
}