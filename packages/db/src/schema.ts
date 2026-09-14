import { relations, sql } from 'drizzle-orm';
import {
  integer,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const civilizations = pgTable(
  'civilizations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    discordGuildId: varchar('discord_guild_id', { length: 32 }).notNull().unique(),
    name: varchar('name', { length: 256 }).notNull(),
    currentDay: integer('current_day').notNull().default(1),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow()
      .$onUpdate(() => sql`now()`),
  },
  (table) => ({
    guildIdx: uniqueIndex('civ_guild_idx').on(table.discordGuildId),
  }),
);

export const civilizationsRelations = relations(civilizations, ({ one, many }) => ({
  resources: one(resources, {
    fields: [civilizations.id],
    references: [resources.civilizationId],
  }),
  citizens: many(citizens),
}));

export const citizens = pgTable(
  'citizens',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    civilizationId: uuid('civilization_id')
      .notNull()
      .references(() => civilizations.id, { onDelete: 'cascade' }),
    discordUserId: varchar('discord_user_id', { length: 32 }).notNull(),
    displayName: varchar('display_name', { length: 256 }).notNull(),
    avatarUrl: varchar('avatar_url', { length: 512 }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow()
      .$onUpdate(() => sql`now()`),
  },
  (table) => ({
    uniqueCivUser: uniqueIndex('citizen_civ_user_idx').on(
      table.civilizationId,
      table.discordUserId,
    ),
  }),
);

export const citizensRelations = relations(citizens, ({ one }) => ({
  civilization: one(civilizations, {
    fields: [citizens.civilizationId],
    references: [civilizations.id],
  }),
}));

export const resources = pgTable(
  'resources',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    civilizationId: uuid('civilization_id')
      .notNull()
      .references(() => civilizations.id, { onDelete: 'cascade' })
      .unique(),
    food: integer('food').notNull().default(100),
    wood: integer('wood').notNull().default(100),
    stone: integer('stone').notNull().default(50),
    gold: integer('gold').notNull().default(0),
    population: integer('population').notNull().default(1),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow()
      .$onUpdate(() => sql`now()`),
  },
  (table) => ({
    uniqueCiv: uniqueIndex('resources_civ_idx').on(table.civilizationId),
  }),
);

export const resourcesRelations = relations(resources, ({ one }) => ({
  civilization: one(civilizations, {
    fields: [resources.civilizationId],
    references: [civilizations.id],
  }),
}));

export type CivilizationRow = typeof civilizations.$inferSelect;
export type NewCivilization = typeof civilizations.$inferInsert;
export type CitizenRow = typeof citizens.$inferSelect;
export type NewCitizen = typeof citizens.$inferInsert;
export type ResourceRow = typeof resources.$inferSelect;
export type NewResource = typeof resources.$inferInsert;
