"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { ROLES, getErrorMessage, toDisplayMessage } from "@/lib/messages";

// Created once: useChat sends every request through this transport.
const transport = new DefaultChatTransport({ api: "/api/chat" });

// Owns the conversation. All API communication goes through useChat here;
// the other chat components only receive props and callbacks.
export default function ChatContainer() {
  const { messages, sendMessage, status, error, regenerate, stop, setMessages, clearError } =
    useChat({ transport });

  // "submitted": waiting for the first chunk; "streaming": text is arriving.
  // stop() aborts the request, keeps any partial reply, and returns to "ready".
  const isBusy = status === "submitted" || status === "streaming";

  // Hide an assistant message until its first text arrives, so an empty
  // bubble never shows; the typing indicator covers that gap instead.
  const visibleMessages = messages
    .map(toDisplayMessage)
    .filter((message) => message.role === ROLES.USER || message.content !== "");

  const lastMessage = visibleMessages.at(-1);
  const isWaitingForText = isBusy && lastMessage?.role !== ROLES.ASSISTANT;

  // Flag the reply that is still receiving text, so its Markdown renderer
  // knows the content is incomplete and animates new words in.
  const displayMessages = visibleMessages.map((message) => ({
    ...message,
    isStreaming:
      status === "streaming" && message === lastMessage && message.role === ROLES.ASSISTANT,
  }));

  function handleSend(text) {
    if (isBusy) return;
    sendMessage({ text });
  }

  function handleNewChat() {
    stop();
    setMessages([]);
    clearError();
  }

  return (
    // Full-height column: header and input stay fixed in size,
    // the message area takes the remaining space and scrolls on its own.
    <div className="flex h-dvh flex-col overflow-hidden">
      <ChatHeader onNewChat={handleNewChat} />
      <MessageList
        messages={displayMessages}
        isLoading={isWaitingForText}
        error={error ? getErrorMessage(error) : ""}
        onRetry={() => regenerate()}
        onSelectPrompt={handleSend}
      />
      <ChatInput onSend={handleSend} onStop={stop} isGenerating={isBusy} />
    </div>
  );
}
