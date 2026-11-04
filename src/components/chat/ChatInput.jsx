"use client";

import { useRef, useState } from "react";

const MAX_TEXTAREA_HEIGHT = 200;

// Message composer. Enter sends, Shift+Enter adds a new line.
// While a reply is generating, the Send button becomes a Stop button.
// The textarea stays editable so the next message can be typed meanwhile.
export default function ChatInput({ onSend, onStop, isGenerating = false }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  const canSend = value.trim().length > 0 && !isGenerating;

  function resizeTextarea() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }

  function handleChange(event) {
    setValue(event.target.value);
    resizeTextarea();
  }

  function submit() {
    if (!canSend) return;
    onSend(value.trim());
    setValue("");
    // Reset height after the cleared value renders.
    requestAnimationFrame(resizeTextarea);
  }

  function handleStop() {
    onStop();
    // Ready for the next message right away.
    textareaRef.current?.focus();
  }

  function handleSubmit(event) {
    event.preventDefault();
    submit();
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <footer className="shrink-0 border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl px-4 py-3">
        <div className="flex items-end gap-2 rounded-2xl border border-neutral-300 bg-white p-2 focus-within:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:focus-within:border-neutral-500">
          <label htmlFor="chat-input" className="sr-only">
            Message
          </label>
          <textarea
            id="chat-input"
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Send a message..."
            className="max-h-[200px] min-w-0 flex-1 resize-none bg-transparent px-2 py-1.5 text-base outline-none sm:text-[15px] placeholder:text-neutral-400"
          />
          {isGenerating ? (
            <button
              type="button"
              onClick={handleStop}
              aria-label="Stop generating"
              title="Stop generating"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-neutral-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-3.5 w-3.5"
                aria-hidden="true"
              >
                <rect x="5" y="5" width="14" height="14" rx="2" />
              </svg>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!canSend}
              aria-label="Send message"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30 dark:bg-white dark:text-neutral-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M12 19V5" />
                <path d="m5 12 7-7 7 7" />
              </svg>
            </button>
          )}
        </div>
        <p className="mt-2 hidden text-center text-xs text-neutral-400 sm:block">
          Press Enter to send, Shift+Enter for a new line.
        </p>
      </form>
    </footer>
  );
}
