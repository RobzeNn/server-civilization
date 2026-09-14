# Architecture

Server Civilization is a modular pnpm monorepo. This document describes the high-level architecture for milestone 0.1.

## Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     Discord Client                           │
│  (iframe running apps/activity)                              │
└──────────────────┬──────────────────────────────────────────┘
                   │ Embedded App SDK authorize()
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                     apps/activity                            │
│  React + Vite. Discord SDK integration. UI. API client.      │
└──────────────────┬──────────────────────────────────────────┘
                   │ HTTPS / JSON
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                      apps/api                                │
│  Fastify. Auth. Validation. Persistence. Game-core calls.    │
└──────┬───────────────────────┬───────────────────────────────┘
       │                       │
       ▼                       ▼
┌──────────────┐      ┌─────────────────┐
│ packages/db  │      │ packages/shared │
│ Drizzle + PG │      │ Zod schemas     │
└──────────────┘      └─────────────────┘
       ▲
       │
┌─────────────────┐
│ packages/game-core │
│ Pure functions  │
└─────────────────┘
```

## Authentication flow

1. The Activity opens and calls `discordSdk.ready()`.
2. The Activity calls `discordSdk.commands.authorize()` with scopes `identify` and `guilds`.
3. Discord returns an authorization `code`.
4. The Activity sends `{ code, redirectUri, guildId, channelId }` to `POST /auth/discord`.
5. The API exchanges the code for an access token with Discord using the client secret.
6. The API fetches the user's profile and guild list from the Discord API.
7. The API verifies that the requested `guildId` is in the user's guild list.
8. The API finds or creates the `Civilization` for that guild and the `Citizen` for that user.
9. The API signs a JWT containing `citizenId`, `civilizationId`, and `discordUserId`.
10. The Activity stores the JWT and uses it on subsequent requests.

User identity is always derived from the Discord-verified token and guild list, never from frontend-provided IDs.

## API routes

| Route | Auth | Purpose |
|-------|------|---------|
| `GET /health` | Public | Health check |
| `POST /auth/discord` | Public | Exchange Discord OAuth code for JWT |
| `GET /api/me` | JWT | Current citizen and user info |
| `GET /api/civilization` | JWT | Civilization with resources |
| `GET /api/civilization/citizens` | JWT | List citizens |

## Data model

### `civilizations`

- `id` UUID primary key
- `discordGuildId` unique string
- `name`
- `currentDay` default 1
- `createdAt`, `updatedAt`

### `citizens`

- `id` UUID primary key
- `civilizationId` foreign key
- `discordUserId`
- `displayName`
- `avatarUrl`
- `createdAt`, `updatedAt`
- Unique index on `(civilizationId, discordUserId)`

### `resources`

- `id` UUID primary key
- `civilizationId` unique foreign key (one-to-one)
- `food`, `wood`, `stone`, `gold`, `population`
- Defaults: food 100, wood 100, stone 50, gold 0, population 1

## Game core

`packages/game-core` contains pure functions such as:

- `createCivilization(...)` — creates a new civilization with initial resources.
- `createCitizen(...)` — creates a citizen record.
- `addCitizen(...)` — adds a citizen to a civilization and updates population.
- `createInitialResources()` — returns the starting resource values.
- `civilizationNameFromGuild(...)` — derives a civilization name from a guild name.

No Discord, database, HTTP, or environment logic is allowed in this package.

## Shared contracts

`packages/shared` defines Zod schemas and inferred TypeScript types for:

- Auth requests and responses
- Civilization and citizen responses
- Resources
- Health check

Both frontend and backend use these schemas for validation and typing.

## Bot

`apps/bot` is a minimal discord.js client. In 0.1 it only logs in. Later milestones will use it to announce civilization events and provide slash commands.

## Networking for Discord Activities

Discord Activities run inside an iframe behind the Discord proxy. During development, a Cloudflare Tunnel exposes the local Vite dev server to Discord. The Vite dev server proxies `/api` to the local Fastify API.

In production, the Activity URL should be configured in the Discord Developer Portal. The Activity can call the API either through a shared domain (using `/.proxy/...`) or a separate public API URL configured in `VITE_API_BASE_URL`.
