# Server Civilization

A persistent multiplayer civilization game that runs as a Discord Activity.

Each Discord guild owns one persistent civilization. Discord members become citizens of that civilization. Over time players will gather resources, build structures, explore, vote in elections, create businesses, experience disasters, wars, crime, politics, and more.

This repository contains **Milestone 0.1: Foundation**.

## What works in 0.1

- Monorepo with pnpm workspaces
- Discord Activity frontend (React + Vite)
- Discord Embedded App SDK initialization and OAuth flow
- Fastify backend with Discord OAuth token exchange and identity verification
- JWT session handling
- PostgreSQL persistence via Drizzle ORM
- One persistent `Civilization` per Discord guild
- One persistent `Citizen` per Discord user per civilization
- Initial resources (food, wood, stone, gold, population)
- Simple village dashboard
- discord.js bot scaffolding
- Tests, linting, type checking, and production builds

## Tech stack

- TypeScript everywhere
- Node.js 22+
- pnpm workspaces
- React + Vite
- `@discord/embedded-app-sdk`
- Fastify
- PostgreSQL
- Drizzle ORM
- Zod
- discord.js
- Vitest
- ESLint + Prettier

## Repository layout

```
/
  apps/
    activity/   Discord Activity frontend
    api/        Fastify backend
    bot/        discord.js bot
  packages/
    db/         Drizzle schemas, connection, migrations
    game-core/  Pure game-domain logic
    shared/     Shared Zod schemas and TypeScript types
  docs/
    ARCHITECTURE.md
    ROADMAP.md
  AGENTS.md
  README.md
```

## Quick start

Prerequisites:

- Node.js 22+
- pnpm (`corepack enable && corepack prepare pnpm@10.4.1 --activate`)
- Docker Compose (for PostgreSQL)

Commands:

```bash
# 1. Install dependencies
pnpm install

# 2. Start PostgreSQL
docker compose up -d

# 3. Configure environment variables (see below)
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/bot/.env.example apps/bot/.env
cp apps/activity/.env.example apps/activity/.env

# 4. Run database migrations
pnpm db:migrate

# 5. Start everything in development mode
pnpm dev
```

The activity dev server runs on `http://localhost:5173` and proxies `/api` to the API at `http://localhost:3001`.

## Environment variables

Create `.env` files from the `.env.example` files.

### Root `.env`

Used by `packages/db` migrations and by the API.

| Variable | Purpose |
|----------|---------|
| `DB_HOST` | PostgreSQL host |
| `DB_PORT` | PostgreSQL port |
| `DB_USER` | PostgreSQL user |
| `DB_PASSWORD` | PostgreSQL password |
| `DB_NAME` | PostgreSQL database name |

### `apps/api/.env`

| Variable | Purpose |
|----------|---------|
| `NODE_ENV` | `development` or `production` |
| `PORT` | API port (default `3001`) |
| `DB_*` | Same database settings as root |
| `DISCORD_CLIENT_ID` | Discord application client ID |
| `DISCORD_CLIENT_SECRET` | Discord application client secret |
| `DISCORD_OAUTH_REDIRECT_URI` | Registered OAuth redirect URI |
| `SESSION_SECRET` | Random string for JWT signing (min 32 chars) |
| `ACTIVITY_ALLOWED_ORIGINS` | Comma-separated allowed CORS origins |

### `apps/activity/.env`

| Variable | Purpose |
|----------|---------|
| `VITE_DISCORD_CLIENT_ID` | Same Discord client ID |
| `VITE_API_BASE_URL` | API base URL (`/api` in dev) |
| `VITE_DISCORD_OAUTH_REDIRECT_URI` | Same redirect URI used by the API |

### `apps/bot/.env`

| Variable | Purpose |
|----------|---------|
| `DISCORD_BOT_TOKEN` | Discord bot token |

## Discord Developer Portal setup

1. Create a new Discord application at https://discord.com/developers/applications.
2. In **OAuth2 → General**:
   - Add a redirect URI matching `DISCORD_OAUTH_REDIRECT_URI` / `VITE_DISCORD_OAUTH_REDIRECT_URI`. For Discord Activities this is typically `https://<your-app-id>.discordsays.com/.proxy/auth/callback`.
   - Copy the **Client ID** and **Client Secret** into `apps/api/.env`.
3. In **Bot**:
   - Create a bot user and copy the token into `apps/bot/.env`.
4. In **Activities → Getting Started**:
   - Enable the Activity.
   - Set the **Activity URL** to your publicly reachable URL. During local development this will be a Cloudflare Tunnel URL.
   - Copy the client ID into `apps/activity/.env` as `VITE_DISCORD_CLIENT_ID`.
5. Install the bot / activity into a test Discord server.

## Useful commands

```bash
pnpm dev          # Start API, activity, and bot in watch mode
pnpm test         # Run all tests
pnpm lint         # Run ESLint everywhere
pnpm typecheck    # Run TypeScript checks everywhere
pnpm build        # Build all packages and apps
pnpm db:migrate   # Run database migrations
pnpm db:generate  # Generate a new Drizzle migration
```

## Security notes

- Discord client data (including the guild ID sent by the frontend) is not trusted as authoritative.
- The backend exchanges the OAuth code directly with Discord using the client secret.
- User identity is verified by fetching the user profile and guild list from the Discord API.
- Secrets (client secret, bot token, database password, session secret) must never be committed or exposed to the frontend.

## Documentation

- [AGENTS.md](./AGENTS.md) — architectural boundaries for AI coding agents
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — system architecture
- [docs/ROADMAP.md](./docs/ROADMAP.md) — planned milestones

## Known limitations

- The bot only logs in; it does not yet announce events or provide commands.
- Game mechanics beyond initial resources are not implemented.
- The Activity must be launched through Discord; opening `http://localhost:5173` directly will fail Discord SDK initialization.
- Cloudflare Tunnel is required to expose the Activity to Discord during development.
- Windows: the stack runs on Windows, but Docker Compose and pnpm are required.

## Suggested next tasks

These are suitable for parallel agents:

1. **Resource gathering** — add game actions and endpoints so citizens can gather food, wood, stone, and gold.
2. **Buildings** — define building types and an endpoint to construct/upgrade them; deduct resources via game-core logic.
3. **Bot announcements** — add a `/civilization` slash command and event announcements to Discord channels.
4. **Day advancement** — implement a scheduled or admin-triggered day tick that updates resources and population.
5. **Activity polish** — add loading states, error boundaries, and responsive improvements to the dashboard.
