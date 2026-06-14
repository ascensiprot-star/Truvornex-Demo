# Truvornex — Neighborhood Service Platform

## Overview
Truvornex is a hyperlocal service marketplace where customers can find and book trusted providers in their neighborhood. Features include service browsing, booking, AI assistant (Simon AI), group buys, skill swaps, community events, disputes, and a neighborhood OS with trust graphs.

## Tech Stack
- **Frontend**: React 18 + Vite, Tailwind CSS, Radix UI (shadcn/ui), React Router v6, TanStack Query, Framer Motion
- **Backend**: Express 5 (Node.js), sessions via express-session + PostgreSQL
- **Database**: PostgreSQL (Replit built-in), accessed via `pg` pool in `server/index.js`
- **AI**: DeepSeek API proxied through `/api/ai/chat` (key stored in `DEEPSEEK_API_KEY` secret)

## Architecture
- `server/index.js` — Express server: auth routes, AI proxy, serves Vite in dev / static dist in prod
- `src/` — React frontend
- `src/lib/AuthContext.jsx` — Auth state (session-based, /api/auth/* endpoints)
- `src/api/supabaseClient.js` — Stub client (Supabase not actively used; real DB is Replit PostgreSQL)
- `supabase/migrations/` — Reference schema (tables created by `initDb` in server on startup)

## Development
- Run: `npm run dev` (starts Express + Vite middleware on port 5000)
- Build: `npm run build` (Vite build to /dist)
- Production: `npm start` (serves /dist statically)

## Environment Variables
- `DATABASE_URL` — Replit PostgreSQL connection string (auto-set)
- `SESSION_SECRET` — Express session secret (set in Replit Secrets)
- `DEEPSEEK_API_KEY` — DeepSeek AI key (set in Replit Secrets)

## User Preferences
- Keep custom email/password auth as-is (not Supabase Auth, not Replit Auth)
