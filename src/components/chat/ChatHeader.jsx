export default function ChatHeader({ onNewChat }) {
  return (
    <header className="shrink-0 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-neutral-900 text-xs font-semibold text-white dark:bg-white dark:text-neutral-900">
            AI
          </span>
          <h1 className="text-sm font-semibold">AI Chat</h1>
        </div>

        <button
          type="button"
          onClick={onNewChat}
          className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900"
        >
          New chat
        </button>
      </div>
    </header>
  );
}
