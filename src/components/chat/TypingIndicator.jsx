// Shown in place of the assistant's reply until its first text arrives.
// Matches the assistant bubble in MessageBubble.
export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 motion-safe:animate-fade-in" role="status" aria-label="Assistant is typing">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white">
        AI
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-neutral-200 bg-neutral-50 px-4 py-3.5 dark:border-neutral-800 dark:bg-neutral-900">
        <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-neutral-400" />
      </div>
    </div>
  );
}
