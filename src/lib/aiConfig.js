// AI settings used by the chat API route (server only).
// API keys are NOT stored here: each provider reads its key from the
// server environment (.env.local) using the variable named in `apiKeyEnv`.

import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";

export const PROVIDERS = {
  google: {
    name: "Google Gemini",
    model: "gemini-3.5-flash-lite",
    apiKeyEnv: "GOOGLE_GENERATIVE_AI_API_KEY",
    createModel: google,
  },
  anthropic: {
    name: "Anthropic",
    model: "claude-opus-5-5",
    apiKeyEnv: "ANTHROPIC_API_KEY",
    createModel: anthropic,
  },
};

// Which provider the chat uses. Change to "anthropic" to switch back to Claude.
export const ACTIVE_PROVIDER = "google";

export function getActiveProvider() {
  return PROVIDERS[ACTIVE_PROVIDER];
}

export const SYSTEM_PROMPT = `You are a helpful, friendly AI assistant in a chat app.
Answer clearly and concisely. Use short paragraphs and lists when they help readability.
If you are unsure about something, say so instead of guessing.`;

// Upper bound on response length. Generous because responses are streamed.
export const MAX_OUTPUT_TOKENS = 64000;

// Reject oversized requests before they reach the model.
export const MAX_MESSAGES = 100;

// Server-side time limits for one response, so a slow or stalled provider
// ends with an error instead of holding the request open until the hosting
// platform kills it (Vercel's limit is 300 s, set by `maxDuration` in the route).
export const TIMEOUTS = {
  firstOutputMs: 45_000, // no output yet (covers connecting, retries and model "thinking")
  chunkMs: 30_000, // output stopped arriving mid-reply
  totalMs: 240_000, // whole response, kept under the platform limit
};

// Retries for failed provider calls (e.g. 429/503) before giving up.
export const MAX_RETRIES = 2;
