import { SUGGESTED_PROMPTS } from "@/lib/messages";

// Shown when the conversation is empty. Offers quick-start prompts.
export default function EmptyState({ onSelectPrompt }) {
  return (
    // `m-auto` centers the content but, unlike `items-center`, keeps the top
    // reachable by scrolling when the screen is too short to fit it.
    <main className="flex min-h-0 flex-1 overflow-y-auto px-4 py-6">
      <div className="m-auto w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold">How can I help you today?</h2>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          Ask a question or pick a suggestion to get started.
        </p>

        <ul className="mt-6 flex flex-col gap-2">
          {SUGGESTED_PROMPTS.map((prompt) => (
            <li key={prompt}>
              <button
                type="button"
                onClick={() => onSelectPrompt(prompt)}
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900"
              >
                {prompt}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
