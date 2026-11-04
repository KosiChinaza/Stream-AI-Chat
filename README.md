# Streaming AI Chat Interface

FlyRank Week 4 Frontend AI Engineering assignment, built with Next.js (App Router), React, JavaScript, and Tailwind CSS.

## Current status

- Responsive chat layout with separate styles for user and assistant messages
- Message composer: Enter sends, Shift+Enter adds a new line, the box grows as you type
- Empty state with suggested prompts, plus a "New chat" reset
- No AI API, streaming, auth, or database yet

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Project structure

```
src/
├── app/
│   ├── layout.js        # Root HTML shell, fonts, metadata
│   ├── page.js          # Home route, renders the chat
│   └── globals.css      # Tailwind import and theme variables
├── components/
│   └── chat/
│       ├── ChatContainer.jsx  # Holds message state, connects the pieces
│       ├── ChatHeader.jsx     # Top bar with title and "New chat"
│       ├── MessageList.jsx    # Scrollable list, auto-scrolls to latest
│       ├── MessageBubble.jsx  # A single user or assistant message
│       ├── EmptyState.jsx     # Welcome screen with suggested prompts
│       └── ChatInput.jsx      # Auto-growing textarea and send button
└── lib/
    └── messages.js      # Message shape, roles, suggested prompts
```
