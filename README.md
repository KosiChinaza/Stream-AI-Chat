# Streaming AI Chat Interface

A responsive AI chat app that streams replies as they are generated, rendering Markdown live. Built for the FlyRank Week 4 Frontend AI Engineering assignment with Next.js, React, JavaScript, Tailwind CSS, and the Vercel AI SDK.

**Live demo:** https://stream-ai-chat-kosisochukwu-chinaza-ugwus-projects.vercel.app

## Features

- **Streaming replies:** text appears as the model generates it.
- **Multi-turn conversations:** the full message history is sent with each request, so the assistant keeps context.
- **Markdown rendering:** headings, lists, bold text, tables, and code blocks render during streaming, even while the syntax is still incomplete.
- **Thinking indicator:** shown until the first text arrives.
- **Stop button:** ends generation, keeps the partial reply, and lets you send again straight away.
- **Smart auto-scroll:** follows new text while you are at the bottom and stops when you scroll up. A "Jump to latest" button takes you back.
- **Readable errors:** failures appear in the chat with a "Try again" button.
- **Server-side timeouts:** a slow or stalled provider ends with an error instead of leaving the request hanging.
- **Message input:** Enter sends, Shift+Enter adds a new line, and the box grows as you type.
- **Empty state and reset:** suggested prompts to get started, and a "New chat" button to clear the conversation.
- **Responsive layout:** works on mobile, tablet, and desktop, and follows the system light or dark theme.

Conversations are kept in the browser's memory only, so they are lost on refresh. The app has no user accounts or database.

## Technologies

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19 |
| Language | JavaScript (JSX) |
| Styling | Tailwind CSS 4 |
| AI | Vercel AI SDK 7 (`ai`, `@ai-sdk/react`) |
| Providers | Google Gemini (`@ai-sdk/google`), Anthropic (`@ai-sdk/anthropic`) |
| Markdown | Streamdown |
| Hosting | Vercel |

The default model is `gemini-3.5-flash-lite`. Anthropic is configured as an alternative.

## Getting started

You need Node.js 20.9 or later and a Google Gemini API key.

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/KosiChinaza/Stream-AI-Chat.git
   cd Stream-AI-Chat
   npm install
   ```

2. Create a `.env.local` file in the project root:

   ```bash
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open http://localhost:3000.

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Run the production build |
| `npm run lint` | Run ESLint |

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Yes, for the default provider | Google Gemini API key |
| `ANTHROPIC_API_KEY` | Only if the active provider is Anthropic | Anthropic API key |

These keys are read on the server only and never reach the browser. `.env*` files are ignored by Git, so never commit real keys.

## Project structure

```
src/
├── app/
│   ├── api/chat/route.js          # POST /api/chat: validates messages, streams the reply
│   ├── globals.css                # Tailwind setup, theme colors, animations
│   ├── layout.js                  # Root HTML shell, fonts, metadata
│   └── page.js                    # Home route, renders the chat
├── components/chat/
│   ├── ChatContainer.jsx          # Connects useChat to the UI
│   ├── ChatError.jsx              # Error message with "Try again"
│   ├── ChatHeader.jsx             # Top bar with title and "New chat"
│   ├── ChatInput.jsx              # Auto-growing textarea with Send and Stop
│   ├── EmptyState.jsx             # Welcome screen with suggested prompts
│   ├── JumpToLatestButton.jsx     # Appears when scrolled away from the latest text
│   ├── MessageBubble.jsx          # One user or assistant message, with Markdown
│   ├── MessageList.jsx            # Scrollable conversation
│   └── TypingIndicator.jsx        # Thinking indicator
├── hooks/
│   └── useStickToBottom.js        # Smart auto-scroll logic
└── lib/
    ├── aiConfig.js                # Providers, models, system prompt, limits, timeouts
    └── messages.js                # Message helpers, error text, suggested prompts
```

## How it works

1. `ChatContainer` uses `useChat` to send the conversation to `POST /api/chat`.
2. The route handler checks the API key and the messages, then calls `streamText` with the active provider.
3. The reply streams back to the browser, and `MessageBubble` renders it with Streamdown.

Timeouts and retries are set in `src/lib/aiConfig.js`:

| Setting | Value |
| --- | --- |
| Waiting for the first output | 45 seconds |
| Silence in the middle of a reply | 30 seconds |
| Whole response | 240 seconds |
| Retries after a failed provider call | 2 |

To change the model or provider, edit `PROVIDERS` or `ACTIVE_PROVIDER` in the same file.

## Deployment

The app is deployed on [Vercel](https://stream-ai-chat-kosisochukwu-chinaza-ugwus-projects.vercel.app). To deploy your own copy:

1. Import the repository into Vercel.
2. Add `GOOGLE_GENERATIVE_AI_API_KEY` under **Settings → Environment Variables**.
3. Deploy. Redeploy after changing an environment variable, because changes only apply to new deployments.

The chat route sets `maxDuration` to 300 seconds, and the 240-second response limit ends requests before Vercel would stop them.
