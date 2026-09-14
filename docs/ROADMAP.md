# Roadmap

## 0.1 Foundation

- [x] Monorepo with pnpm workspaces
- [x] Discord Activity frontend scaffold (React + Vite)
- [x] Discord Embedded App SDK integration
- [x] Discord OAuth flow with backend token exchange
- [x] JWT session handling
- [x] Fastify API with auth and civilization endpoints
- [x] PostgreSQL persistence via Drizzle ORM
- [x] One civilization per guild, one citizen per user per civilization
- [x] Initial resources
- [x] Simple village dashboard
- [x] discord.js bot login scaffold
- [x] Tests, linting, type checking, production builds
- [x] Docker Compose for PostgreSQL

## 0.2 Resource gathering

- Citizens can perform gather actions (food, wood, stone, gold)
- Action rate limiting / energy system (basic)
- Resource changes persisted and displayed on dashboard

## 0.3 Buildings

- Building types (farm, lumber mill, quarry, mine, house)
- Construction and upgrade costs
- Buildings affect resource generation and population cap

## 0.4 Citizen progression / jobs

- Citizens can choose jobs (farmer, lumberjack, miner, merchant)
- Jobs boost specific gathering or production
- Simple skill/progression tracking

## 0.5 World simulation

- Day advancement tick
- Resource production/consumption per day
- Population growth from food surplus

## 0.6 Discord bot announcements

- Bot announces major civilization events in a channel
- `/civilization` slash command shows civilization status
- Bot links to the Activity

## 0.7 Elections / government

- Citizens can vote for a leader
- Leader can set policies or tax rates
- Term limits and election cycles

## 0.8 Economy / businesses

- Citizens can create businesses
- Trade resources and goods
- Basic market prices

## 0.9 Exploration

- Map generation
- Citizens can explore tiles
- Discover resources, events, and other civilizations

## 0.10 Random events / disasters

- Fires, floods, plagues, bandit raids
- Events affect resources, buildings, and citizens
- Citizens can vote on responses

## 1.0 Persistent Civilization MVP

- Stable long-running game loop
- Balanced economy, progression, and politics
- Polished Discord Activity UX
- Bot fully integrated
- Ready for public alpha
