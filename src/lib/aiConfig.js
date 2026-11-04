// AI settings used by the chat API route (server only).
// API keys are NOT stored here: each provider reads its key from the
// server environment (.env.local) using the variable named in `apiKeyEnv`.

import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";

export const PROVIDERS = {
  google: {
    name: "Google Gemini",
    model: "gemini-3.8-flash",
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
