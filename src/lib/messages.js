// Message helpers and shared constants for the chat UI.
// useChat stores messages as { id, role, parts }; the UI components
// receive a simpler { id, role, content } shape built by toDisplayMessage.

export const ROLES = {
  USER: "user",
  ASSISTANT: "assistant",
};

// Joins the text parts of a useChat message. Other part types (e.g. model
// reasoning) are not shown in the chat.
export function getMessageText(message) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

export function toDisplayMessage(message) {
  return {
    id: message.id,
    role: message.role,
    content: getMessageText(message),
  };
}

// Turns a useChat error into a sentence for the user.
// - Errors sent inside the stream already carry a readable message.
// - HTTP errors from /api/chat carry the raw body: {"error": "..."}.
// - Network failures (server down, offline) surface as "Failed to fetch".
export function getErrorMessage(error) {
  if (!error) return "";

  try {
    const body = JSON.parse(error.message);
    if (typeof body?.error === "string") return body.error;
  } catch {
    // Not JSON: use the message as-is below.
  }

  if (error.message === "Failed to fetch") {
    return "Could not reach the server. Check your connection and try again.";
  }
  return error.message || "Something went wrong. Please try again.";
}

export const SUGGESTED_PROMPTS = [
  "Explain how streaming responses work",
  "Write a short poem about the ocean",
  "Give me three tips for writing clean React code",
];
