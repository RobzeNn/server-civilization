# AGENTS.md

This file is for AI coding agents working on Server Civilization. Read it before making changes.

## Project mission

Build a persistent multiplayer civilization game that runs as a Discord Activity. Keep the architecture simple, modular, and monorepo-based. Avoid enterprise patterns, microservices, Redis, message queues, Kubernetes, Next.js, NestJS, and unnecessary abstractions.

## Architectural boundaries

Respect these boundaries. Do not let Discord-specific, database-specific, or HTTP-specific logic leak into the wrong layers.

### `apps/activity` — Discord Activity frontend

- **Allowed:** React components, CSS, Discord SDK integration, calls to the backend API, UI state.
- **Forbidden:** Direct database access, Discord bot logic, game-rule calculations, storing secrets.
- The Activity must not use the Discord client secret or bot token.
- Authentication happens through the Embedded App SDK `authorize` command; the resulting code is sent to `POST /auth/discord`.

### `apps/api` — Fastify backend

- **Allowed:** HTTP routing, request/response validation with Zod, auth (JWT), persistence via `packages/db`, calling pure functions from `packages/game-core`.
- **Forbidden:** Discord SDK frontend code, game-rule logic that should live in `game-core`, direct SQL outside `packages/db`.
- User identity is derived from the backend-verified Discord OAuth token, not from frontend-provided IDs.
- The guild ID from the frontend is cross-checked against the Discord API guild list before a civilization is created.

### `apps/bot` — discord.js bot

- **Allowed:** Discord bot events, slash commands, channel announcements, reading Discord state.
- **Forbidden:** Game rules, direct database access (use `apps/api` endpoints or a well-defined service layer if absolutely needed), frontend UI.
- For 0.1 the bot only logs in. Later milestones will add announcements and commands.

### `packages/db` — Database schema and connection

- **Allowed:** Drizzle schemas, migrations, connection pooling, exported table/row types.
- **Forbidden:** Game logic, Discord-specific logic, HTTP logic, importing from `apps/*`.
- Keep migrations under version control.

### `packages/game-core` — Pure game-domain logic

- **Allowed:** Plain TypeScript functions, data models, and rules for civilizations, citizens, resources, buildings, actions, and events.
- **Forbidden:** Any import from `discord.js`, `@discord/embedded-app-sdk`, `drizzle-orm`, `fastify`, database drivers, or `apps/*`.
- This package must remain testable with no external side effects.

### `packages/shared` — Shared contracts

- **Allowed:** Zod schemas, TypeScript types, DTOs used by both frontend and backend.
- **Forbidden:** Runtime logic, database-specific types, UI components, environment variables.
- Keep schemas minimal and versioned implicitly by usage.

## Common rules

- TypeScript everywhere. Use `pnpm` and the workspace structure.
- Do not commit secrets. Use `.env.example` files and add real values to `.env` files ignored by git.
- Keep changes minimal. Prefer editing existing files over creating new ones.
- Add or update tests when changing logic.
- Run `pnpm test`, `pnpm lint`, `pnpm typecheck`, and `pnpm build` before finishing.
- Update this file and other docs if you change architectural boundaries or developer workflow.

## Dependency direction

```
apps/activity  →  packages/shared
                →  apps/api

apps/api       →  packages/shared
                →  packages/db
                →  packages/game-core

apps/bot       →  discord.js
                →  (later) apps/api endpoints

packages/db    →  none (only drizzle + pg)
packages/game-core →  none
packages/shared →  zod only
```

## Environment and secrets

- Frontend env vars must be prefixed with `VITE_`.
- Backend secrets live in `apps/api/.env` and `apps/bot/.env`.
- Database env vars live in the root `.env` so migrations and the API can share them.

## Testing

- `packages/game-core` should have thorough pure-function tests.
- `packages/shared` should validate schemas.
- `apps/api` tests should mock external HTTP calls and, when possible, the database.
- `apps/activity` tests should focus on component rendering and pure helpers.
- `apps/bot` tests should validate configuration and utility logic.

## Questions?

If a requirement would break these boundaries, ask the user before proceeding.
