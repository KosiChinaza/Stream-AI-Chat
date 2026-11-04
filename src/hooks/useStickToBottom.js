"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Within this distance (px) of the bottom counts as "at the bottom".
const BOTTOM_THRESHOLD = 48;

const UP_KEYS = new Set(["ArrowUp", "PageUp", "Home"]);

// Keeps a scroll container pinned to the bottom while its content grows
// (new messages, streamed text), until the user scrolls up.
//
// - `scrollRef`: the scrolling element. `contentRef`: the element inside it
//   whose height grows. Pass `active` = true once both are mounted.
// - Pinned state lives in a ref, so scrolling never re-renders anything;
//   `isAtBottom` (React state) only changes when it actually flips, for the
//   "Jump to latest" button.
export default function useStickToBottom(active) {
  const scrollRef = useRef(null);
  const contentRef = useRef(null);
  const pinnedRef = useRef(true);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const setPinned = useCallback((pinned) => {
    pinnedRef.current = pinned;
    setIsAtBottom(pinned); // No re-render when the value is unchanged.
  }, []);

  // Instant jump while streaming: smooth scrolling restarted on every chunk
  // lags behind and jitters.
  const pinToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  const scrollToBottom = useCallback(
    (behavior = "smooth") => {
      setPinned(true);
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior });
    },
    [setPinned],
  );

  useEffect(() => {
    const el = scrollRef.current;
    const content = contentRef.current;
    if (!active || !el || !content) return;

    // Content or viewport size changed: follow it if pinned.
    const resizeObserver = new ResizeObserver(() => {
      if (pinnedRef.current) pinToBottom();
    });
    resizeObserver.observe(content);
    resizeObserver.observe(el);

    // Any scroll (wheel, scrollbar drag, smooth scroll): re-pin when back
    // near the bottom; unpin only if the position moved UP. Distance alone
    // can't be trusted: streamed text can grow the content between our pin
    // and this event, which looks like being far from the bottom.
    let lastScrollTop = el.scrollTop;
    function handleScroll() {
      const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
      if (distance <= BOTTOM_THRESHOLD) setPinned(true);
      else if (el.scrollTop < lastScrollTop - 1) setPinned(false);
      lastScrollTop = el.scrollTop;
    }

    // Explicit upward intent unpins immediately, before the next chunk can
    // pull the view back down.
    function handleWheel(event) {
      if (event.deltaY < 0) setPinned(false);
    }
    let touchY = null;
    function handleTouchStart(event) {
      touchY = event.touches[0].clientY;
    }
    function handleTouchMove(event) {
      const y = event.touches[0].clientY;
      if (touchY !== null && y > touchY) setPinned(false); // finger down = scroll up
      touchY = y;
    }
    function handleKeyDown(event) {
      if (UP_KEYS.has(event.key)) setPinned(false);
    }

    el.addEventListener("scroll", handleScroll, { passive: true });
    el.addEventListener("wheel", handleWheel, { passive: true });
    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: true });
    el.addEventListener("keydown", handleKeyDown);
    pinToBottom();

    return () => {
      resizeObserver.disconnect();
      el.removeEventListener("scroll", handleScroll);
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("keydown", handleKeyDown);
    };
  }, [active, pinToBottom, setPinned]);

  return { scrollRef, contentRef, isAtBottom, scrollToBottom };
}
