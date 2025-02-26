"use client";

import { cn } from "@/lib/utils";
import { Send, Square, RotateCw } from "@geist-ui/icons";
import { Textarea } from "../../ui/textarea";

interface InputComputerProps {
  input: string;
  isLoading: boolean;
  handleKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  stop: () => void;
  reload: () => void;
  disabled: boolean;
  chatId?: string;
}

export function InputComputer({
  input,
  isLoading,
  handleKeyDown,
  handleInputChange,
  stop,
  reload,
  disabled,
  chatId,
}: InputComputerProps) {
  return (
    <div className="flex w-full gap-2">
      <div className="relative flex-1 group/input">
        <Textarea
          value={input}
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
          placeholder="Type your message here... (Press Enter to send, Shift + Enter for new line)"
          className={cn(
            "w-full resize-none rounded-lg border-2 bg-background text-base text-foreground",
            "placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "min-h-[100px] py-3.5 px-4 pr-12",
            "shadow-sm transition-shadow duration-200",
            "focus:shadow-md"
          )}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2",
            "p-2 rounded-md",
            "text-muted-foreground/60 transition-all duration-200",
            "hover:text-foreground hover:bg-accent/50",
            "group-hover/input:text-muted-foreground/80",
            "active:scale-95",
            "disabled:cursor-not-allowed disabled:opacity-40",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          )}
          title="Send message (Enter)"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>

      <div className="flex gap-1.5">
        {isLoading ? (
          <button
            type="button"
            onClick={stop}
            className={cn(
              "rounded-lg bg-muted/50 p-3",
              "text-muted-foreground/70 transition-all duration-200",
              "hover:bg-accent/80 hover:text-accent-foreground",
              "active:scale-95",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            )}
            title="Stop generating (Esc)"
          >
            <Square className="h-5 w-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => reload()}
            disabled={disabled}
            className={cn(
              "rounded-lg bg-muted/50 p-3",
              "text-muted-foreground/70 transition-all duration-200",
              "hover:bg-accent/80 hover:text-accent-foreground",
              "active:scale-95",
              "disabled:cursor-not-allowed disabled:opacity-40",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            )}
            title="Regenerate response (Ctrl + R)"
          >
            <RotateCw className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
} 