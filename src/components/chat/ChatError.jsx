// Readable error shown at the end of the conversation, with a retry action.
export default function ChatError({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
    >
      <p>{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="shrink-0 self-start rounded-md border border-red-300 px-3 py-1 font-medium transition-colors hover:bg-red-100 sm:self-auto dark:border-red-800 dark:hover:bg-red-900/40"
      >
        Try again
      </button>
    </div>
  );
}
