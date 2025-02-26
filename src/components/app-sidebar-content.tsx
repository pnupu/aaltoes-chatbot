"use client";

import {
  SidebarContent,
  SidebarGroup,
  useSidebar,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { ChatButton } from "./ui/chat-button";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { formatDistanceToNow, isToday, isYesterday, isWithinInterval, subDays } from "date-fns";
import { cn } from "@/lib/utils";

const chatSchema = z.object({
  id: z.string(),
  topic: z.string().nullable(),
  updated_at: z.string().or(z.date()),
});

const fetchChats = async ({ userId }: { userId: string }) => {
  try {
    const response = await fetch("/api/chat/select", {
      method: "GET",
      headers: {
        user_id: userId,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch chats");
    const chats = z.array(chatSchema).safeParse(await response.json());
    if (!chats.success) {
      console.error(chats.error.errors);
      return [];
    }
    return chats.data;
  } catch (error) {
    console.error("Error fetching chats:", error);
    return [];
  }
};

export function AppSidebarContent() {
  const { data: session } = useSession();

  return (
    
    <SidebarContent className="bg-card  border-border flex flex-col h-[calc(100vh-3.5rem)]">
      {session && session.user.id && <ChatsList userId={session.user.id} />}
      {!session ? <p className="p-4 text-muted-foreground text-center">Please login to view your chats</p> : null}
      <SidebarGroup />
    </SidebarContent>
  );
}

const ChatsList = ({ userId }: { userId: string }) => {
  const { data: session } = useSession();
  const { data: chats, status } = useQuery({
    queryKey: ["chats", { userId: userId }],
    queryFn: () => fetchChats({ userId: userId }),
    refetchInterval: 20000,
  });

  const router = useRouter();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredChats, setFilteredChats] = useState(chats ?? []);
  const { setOpenMobile } = useSidebar();

  useEffect(() => {
    const filtered = chats?.filter((chat) =>
      chat.topic?.toLowerCase().includes(searchTerm.toLowerCase())
    ) ?? [];
    setFilteredChats(filtered);
  }, [chats, searchTerm]);

  if (status === "pending") return <p className="p-4 text-muted-foreground text-center">Loading...</p>;
  if (status === "error") return <p className="p-4 text-destructive text-center">Error loading chats</p>;

  const now = new Date();
  const todayChats = filteredChats.filter(chat => 
    isToday(new Date(chat.updated_at))
  );
  
  const yesterdayChats = filteredChats.filter(chat => 
    isYesterday(new Date(chat.updated_at))
  );
  
  const weekChats = filteredChats.filter(chat => {
    const chatDate = new Date(chat.updated_at);
    return !isToday(chatDate) && 
           !isYesterday(chatDate) && 
           isWithinInterval(chatDate, {
             start: subDays(now, 7),
             end: now
           });
  });
  
  const renderChatGroup = (chats: typeof filteredChats, title: string) => (
    chats.length > 0 && (
      <div>
        <h2 className="px-4 text-sm font-medium text-muted-foreground mb-2">{title}</h2>
        <div className="space-y-1">
          {chats.map((chat) => (
            <ChatButton
              key={chat.id}
              id={chat.id}
              topic={chat.topic}
              onClick={() => setOpenMobile(false)}
              onDelete={(id) => {
                if (pathname === `/chat/${id}`) {
                  router.push("/");
                }
              }}
            />
          ))}
        </div>
      </div>
    )
  );

  return (
    <SidebarGroup className="flex flex-col h-full overflow-hidden">
      <div className="flex-none p-2">
        <div className="relative">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search chats"
            className={cn(
              "w-full resize-none rounded-lg border bg-background text-base text-foreground",
              "placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0",
              "disabled:cursor-not-allowed disabled:opacity-50", 
              "py-3.5 px-4 pl-10",
              "shadow-sm transition-shadow duration-200",
              "focus:shadow-md"
            )}
            disabled={!session?.user?.active}
          />
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
        </div>
      </div>
      
      <div className="flex-1 p-2 space-y-4 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <p className="p-4 text-muted-foreground text-center">No chats found</p>
        ) : (
          <>
            {renderChatGroup(todayChats, "Today")}
            {renderChatGroup(yesterdayChats, "Yesterday")}
            {renderChatGroup(weekChats, "Previous 7 Days")}
          </>
        )}
      </div>
    </SidebarGroup>
  );
};
