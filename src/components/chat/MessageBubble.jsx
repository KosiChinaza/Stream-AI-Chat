import { memo } from "react";
import { Streamdown } from "streamdown";
import { ROLES } from "@/lib/messages";

// Renders one message. User messages sit on the right in a dark bubble;
// assistant messages sit on the left with an avatar and a light bubble.
// Assistant text is Markdown, rendered with Streamdown, which tolerates
// incomplete syntax (e.g. an unclosed ** or ``` fence) while streaming.
function MessageBubble({ message }) {
  const isUser = message.role === ROLES.USER;

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-neutral-900 px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap break-words text-white sm:max-w-[75%] dark:bg-neutral-100 dark:text-neutral-900">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    // Fades in when the first streamed text replaces the typing indicator.
    <div className="flex items-start gap-3 motion-safe:animate-fade-in">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white">
        AI
      </div>
      {/* min-w-0 lets wide code blocks and tables scroll inside the bubble;
          overflow-wrap breaks long URLs/words instead of widening it. */}
      <div className="min-w-0 max-w-[85%] rounded-2xl rounded-tl-sm border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-[15px] leading-relaxed break-words sm:max-w-[75%] dark:border-neutral-800 dark:bg-neutral-900">
        <Streamdown animated isAnimating={message.isStreaming}>
          {message.content}
        </Streamdown>
      </div>
    </div>
  );
}

// Message objects are rebuilt on every streamed chunk, so compare the fields
// that are shown: finished messages then skip re-rendering while a reply streams.
function isSameMessage(prev, next) {
  const a = prev.message;
  const b = next.message;
  return (
    a.id === b.id && a.role === b.role && a.content === b.content && a.isStreaming === b.isStreaming
  );
}

export default memo(MessageBubble, isSameMessage);
