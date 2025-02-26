"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import UserButton from "./UserButton";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import { NewChatButton } from "./ui/chat-button";
import { SelectModel } from "./Chatbot/select-model";
import { ChatName } from "./Chatbot/chat-name";

export default function NavBar() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const pathname = usePathname();

  const isChatPage = pathname.startsWith("/chat/") || pathname === "/";
  // Extract chatId from pathname if it's a chat page
  const chatId = isChatPage && pathname !== "/" ? pathname.split("/")[2] : undefined;

  const { open, openMobile, isMobile } = useSidebar();

  return (
    <header className="sticky left-0 right-0 top-0 z-50 h-14 border-b border-border bg-card/80 backdrop-blur">
      <nav className="max-w-8xl mx-auto h-full w-full flex items-center justify-between px-4">
        {/* Left section */}
        <div className="flex items-center">
          {(isMobile && !openMobile) || (!isMobile && !open) ? (
            <div className="flex items-center">
              <SidebarTrigger />
              <NewChatButton />
            </div>
          ) : null}
          {(!isMobile && !open) || isMobile ? (
            <Link
              href="/"
              className="text-center font-bold text-foreground">
              Aaltoes ChatBot
            </Link>
          ) : null}
          
          <div className="ml-2">
            {isChatPage && !isMobile ? <SelectModel chatId={chatId} /> : null}
          </div>
        </div>
        
        {/* Center section - Chat name */}
        <div className="flex-1 flex justify-center">
          {chatId && <ChatName chatId={chatId} />}
        </div>

        {/* Right section */}
        <div className="flex items-center">
          {user && <UserButton user={user} />}
          {!user && status !== "loading" && (
            <Button onClick={() => signIn()}>Sign in</Button>
          )}
        </div>
      </nav>
    </header>
  );
}
