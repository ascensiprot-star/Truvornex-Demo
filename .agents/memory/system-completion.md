---
name: System completion architecture
description: How the Supabase-spec system completion was adapted to Express+PostgreSQL on Replit
---

## Core decision
The spec document (attached_assets/Pasted--TRUVORNEX-SYSTEM-COMPLETION-PROMPT…txt) assumes Supabase but the stack is Express + Replit PostgreSQL. All Supabase-specific patterns were adapted.

## What was built
- **server/db.js** — exports `pool`, `initNewTables()`, `writeAuditLog()`, `createNotification()`, `ensureWallet()`. Called from `initDb()` in server/index.js on startup.
- **server/financial.js** — wallet CRUD (GET balance, POST credit/debit via `wallet_mutate()` stored proc), BNPL check/create, loyalty ledger, payout request with tier guard.
- **server/notifications-routes.js** — notifications CRUD + SSE push via `broadcastNotification()` export.
- **server/simon.js** — hardened with Zod validation on all inputs, in-memory TTL cache (home-insights: 10min, zone-health: 5min, recommendations: 15min).

## Database tables (all created via initNewTables)
wallets, wallet_transactions, bnpl_agreements, provider_trust_scores, loyalty_ledger, audit_log, notifications, provider_vouches. Plus users extensions: phone, city, country, onboarding_complete.

## Stored procedures
- `wallet_mutate(user_id, type, amount, ref_type, ref_id, description)` — SELECT FOR UPDATE + atomic debit/credit, raises exception on insufficient balance or frozen wallet.
- `recompute_trust_score(provider_id)` — computes score 0-100 from completion_rate×40 + avg_rating×25 + job_volume×15 + avatar×10 + vouches×2, writes to provider_trust_scores.

## Adapted patterns
- Supabase RLS → Express `requireAuth` middleware + user_id from session (never from body)
- Supabase Realtime → polling hooks in `useRealtime.js` (5s interval) + SSE stream at `/api/notifications/stream`
- Supabase Edge Functions → Express routes in server/financial.js, server/notifications-routes.js
- Supabase KV cache → in-memory Map with TTL in server/simon.js

## Security headers applied in server/index.js
X-Content-Type-Options, X-Frame-Options DENY, X-XSS-Protection, Referrer-Policy, Permissions-Policy. Rate limiters: auth=10/15min, simon=20/min, api=120/min.

## New pages
- `src/pages/TrustPassport.jsx` — public route `/trust/:providerId`, animated score counter, QRCodeSVG (qrcode.react v4 named export), HMAC-SHA256 verification hash.
- `src/pages/admin/LabView.jsx` — route `/x7k9m2q4p8w1n5v3r6t0y/admin/lab`, pulls `/api/admin/lab-data`, recharts for trust distribution + zone health grid + BNPL risk + loyalty economy.

## Hard rules enforced
- Geolocation fallback: `[25.396, 68.374]` (Hyderabad, PK) — never New York.
- All wallet mutations go through `wallet_mutate()` stored proc only.
- DEEPSEEK_API_KEY lives in process.env server-side only.
- No VITE_ prefix for any API key.

**Why:** Spec demanded zero mocks, real DB transactions, and server-side security. Express+PG is the only available stack on this Replit instance.
