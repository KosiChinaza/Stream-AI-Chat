import {
  APICallError,
  RetryError,
  convertToModelMessages,
  createUIMessageStreamResponse,
  safeValidateUIMessages,
  streamText,
  toUIMessageStream,
} from "ai";
import {
  MAX_MESSAGES,
  MAX_OUTPUT_TOKENS,
  SYSTEM_PROMPT,
  getActiveProvider,
} from "@/lib/aiConfig";

function errorResponse(message, status) {
  return Response.json({ error: message }, { status });
}

// Formats schema issues as e.g. "messages[0].parts: Invalid input: expected array".
function describeValidationError(error) {
  const issues = error.cause?.issues;
  if (!Array.isArray(issues) || issues.length === 0) {
    return "Messages are not in the expected format.";
  }
  return issues
    .slice(0, 3)
    .map((issue) => {
      const path = issue.path
        .map((key) => (typeof key === "number" ? `[${key}]` : `.${key}`))
        .join("");
      return `messages${path}: ${issue.message}`;
    })
    .join("; ");
}

// Turns provider errors that happen mid-stream into short, safe messages for
// the client. Full details are logged on the server only.
// Status codes differ by provider: e.g. Gemini reports a bad key as 400
// (API_KEY_INVALID), Anthropic as 401; Anthropic uses 529 for overload.
function getStreamErrorMessage(rawError, providerName) {
  console.error(`[api/chat] ${providerName} stream error:`, rawError);

  // Retryable failures (429, 5xx) reach us wrapped in a RetryError once the
  // SDK gives up; the provider's actual error is its `lastError`.
  const error = RetryError.isInstance(rawError) ? rawError.lastError : rawError;

  if (APICallError.isInstance(error)) {
    const status = error.statusCode;
    const invalidKey =
      status === 401 || status === 403 || error.responseBody?.includes("API_KEY_INVALID");

    if (invalidKey) return `The server's ${providerName} API key is invalid or lacks access.`;
    if (status === 404) return `The configured ${providerName} model is not available.`;
    if (status === 429) return `${providerName} rate limit or quota reached. Please wait and try again.`;
    if (status === 503 || status === 529) {
      return `${providerName} is overloaded right now. Please try again shortly.`;
    }
  }
  return "Something went wrong while generating a response. Please try again.";
}

// POST /api/chat
// Body: { messages: UIMessage[] } (the format sent by useChat from @ai-sdk/react)
// Returns: a UI message stream that useChat reads as it arrives.
export async function POST(req) {
  const provider = getActiveProvider();

  if (!process.env[provider.apiKeyEnv]) {
    return errorResponse(
      `${provider.apiKeyEnv} is not set. Add it to .env.local and restart the dev server.`,
      500,
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Request body must be valid JSON.", 400);
  }

  const messages = body?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return errorResponse('Request body must include a non-empty "messages" array.', 400);
  }
  if (messages.length > MAX_MESSAGES) {
    return errorResponse(`Too many messages. The limit is ${MAX_MESSAGES}.`, 400);
  }

  // Check each message has the UIMessage shape (id, role, parts, ...).
  const validation = await safeValidateUIMessages({ messages });
  if (!validation.success) {
    return errorResponse(`Invalid messages: ${describeValidationError(validation.error)}`, 400);
  }
  if (validation.data.at(-1).role !== "user") {
    return errorResponse("The last message must come from the user.", 400);
  }

  const result = streamText({
    model: provider.createModel(provider.model),
    instructions: SYSTEM_PROMPT,
    messages: await convertToModelMessages(validation.data),
    maxOutputTokens: MAX_OUTPUT_TOKENS,
    // Stop generating (and billing) if the client disconnects.
    abortSignal: req.signal,
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      onError: (error) => getStreamErrorMessage(error, provider.name),
    }),
  });
}
