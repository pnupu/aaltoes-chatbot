"use client";

import { cn } from "@/lib/utils";
import { Send, Square, RotateCw } from "lucide-react";
import { Textarea } from "../../ui/textarea";
import { SelectModel } from "../select-model";

interface InputMobileProps {
  input: string;
  isLoading: boolean;
  handleKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  stop: () => void;
  reload: () => void;
  disabled: boolean;
  chatId?: string;
}

export function InputMobile({
  input,
  isLoading,
  handleKeyDown,
  handleInputChange,
  stop,
  reload,
  disabled,
  chatId,
}: InputMobileProps) {
  return (
    <div className="relative flex-1">
      <div className="relative flex-1 border-t border-border bg-background/95 pt-3">
        <div className="flex items-center justify-between px-1 pb-2">
        <SelectModel chatId={chatId} />
          <div className="flex items-center gap-1.5">
            {isLoading ? (
              <button
                type="button"
                onClick={stop}
                className={cn(
                  "rounded-lg bg-muted/50 p-2",
                  "text-muted-foreground/70 transition-all duration-200",
                  "hover:bg-accent/80 hover:text-accent-foreground",
                  "active:scale-95",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                )}
                title="Stop generating"
              >
                <Square className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={reload}
                disabled={disabled}
                className={cn(
                  "rounded-lg bg-muted/50 p-2",
                  "text-muted-foreground/70 transition-all duration-200",
                  "hover:bg-accent/80 hover:text-accent-foreground",
                  "active:scale-95",
                  "disabled:cursor-not-allowed disabled:opacity-40",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                )}
                title="Regenerate response"
              >
                <RotateCw className="h-4 w-4" />
              </button>
            )}
          </div>
        
        </div>

        <div className="relative">
          <Textarea
            value={input}
            onKeyDown={handleKeyDown}
            onChange={handleInputChange}
            placeholder="Type your message here..."
            className={cn(
              "w-full resize-none rounded-lg border bg-background text-base text-foreground",
              "placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "min-h-[60px] max-h-[120px] py-2.5 px-3 pr-10",
              "shadow-sm transition-shadow duration-200",
              "focus:shadow-md"
            )}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2",
              "p-1.5 rounded-md",
              "text-muted-foreground/70 transition-all duration-200",
              "hover:text-foreground hover:bg-accent/50",
              "active:scale-95",
              "disabled:cursor-not-allowed disabled:opacity-40",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            )}
            title="Send message"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
} 