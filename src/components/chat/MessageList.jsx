"use client";

import { useEffect } from "react";
import MessageBubble from "./MessageBubble";
import EmptyState from "./EmptyState";
import TypingIndicator from "./TypingIndicator";
import ChatError from "./ChatError";
import JumpToLatestButton from "./JumpToLatestButton";
import useStickToBottom from "@/hooks/useStickToBottom";
import { ROLES } from "@/lib/messages";

// Scrollable list of messages. Follows new content (messages and streamed
// text) while the user is at the bottom; stops when they scroll up and
// offers a "Jump to latest" button instead.
export default function MessageList({ messages, isLoading, error, onRetry, onSelectPrompt }) {
  const hasMessages = messages.length > 0;
  const { scrollRef, contentRef, isAtBottom, scrollToBottom } = useStickToBottom(hasMessages);

  // Sending a message always brings the view back down to it.
  const userMessageCount = messages.filter((m) => m.role === ROLES.USER).length;
  useEffect(() => {
    if (userMessageCount > 0) scrollToBottom("auto");
  }, [userMessageCount, scrollToBottom]);

  if (!hasMessages) {
    return <EmptyState onSelectPrompt={onSelectPrompt} />;
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <main ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <div ref={contentRef} className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isLoading && <TypingIndicator />}
          {error && <ChatError message={error} onRetry={onRetry} />}
        </div>
      </main>
      {!isAtBottom && <JumpToLatestButton onClick={() => scrollToBottom()} />}
    </div>
  );
}
