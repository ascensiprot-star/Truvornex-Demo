---
name: DeepSeek AI wiring
description: How Simon AI is wired to DeepSeek — key required by VITE_ prefix, streaming via SSE, guard function before every call
---

## Rule
All AI calls go through `src/lib/deepseek.js` → `chatDeepSeek()`. Always call `isConfigured()` first and show a helpful message if the key is missing.

## How to apply
- API key: `VITE_DEEPSEEK_API_KEY` secret in Replit (VITE_ prefix required for Vite client-side access)
- Base URL: `https://api.deepseek.com/v1`
- Model: `deepseek-chat`
- Streaming: pass `onChunk: (delta, fullAccum) => setState(fullAccum)` for real-time token streaming
- `quickInsight(prompt, context)` helper for one-shot non-streaming calls

**Why:** Key is stored client-side (VITE_ prefix); acceptable for personal/demo project but not for production — move to a backend proxy if exposing to public users.
