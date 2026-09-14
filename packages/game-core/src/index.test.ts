import { describe, expect, it } from 'vitest';
import {
  addCitizen,
  createCitizen,
  createCivilization,
  createInitialResources,
  civilizationNameFromGuild,
} from './index.js';

describe('game-core', () => {
  const now = new Date('2026-01-01T00:00:00.000Z');

  describe('createInitialResources', () => {
    it('returns the expected starting resources', () => {
      expect(createInitialResources()).toEqual({
        food: 100,
        wood: 100,
        stone: 50,
        gold: 0,
        population: 1,
      });
    });
  });

  describe('createCivilization', () => {
    it('creates a civilization with default resources and day 1', () => {
      const civ = createCivilization({
        discordGuildId: '123456789012345678',
        name: "Test Guild's Civilization",
        now,
      });

      expect(civ.discordGuildId).toBe('123456789012345678');
      expect(civ.name).toBe("Test Guild's Civilization");
      expect(civ.currentDay).toBe(1);
      expect(civ.resources).toEqual(createInitialResources());
      expect(civ.citizens).toEqual([]);
      expect(civ.createdAt).toEqual(now);
      expect(civ.updatedAt).toEqual(now);
    });

    it('accepts a provided id', () => {
      const civ = createCivilization({
        id: 'civ-id',
        discordGuildId: '123',
        name: 'Civ',
      });
      expect(civ.id).toBe('civ-id');
    });
  });

  describe('createCitizen', () => {
    it('creates a citizen linked to a civilization', () => {
      const citizen = createCitizen({
        civilizationId: 'civ-id',
        discordUserId: '987654321098765432',
        displayName: 'Alice',
        now,
      });

      expect(citizen.civilizationId).toBe('civ-id');
      expect(citizen.discordUserId).toBe('987654321098765432');
      expect(citizen.displayName).toBe('Alice');
      expect(citizen.createdAt).toEqual(now);
      expect(citizen.updatedAt).toEqual(now);
    });
  });

  describe('addCitizen', () => {
    it('adds a citizen and increments population', () => {
      const civ = createCivilization({
        discordGuildId: '123',
        name: 'Civ',
        now,
      });
      const citizen = createCitizen({
        civilizationId: civ.id,
        discordUserId: '987',
        displayName: 'Bob',
        now,
      });

      const updated = addCitizen(civ, citizen);

      expect(updated.citizens).toHaveLength(1);
      expect(updated.resources.population).toBe(2);
    });

    it('does not add the same discord user twice', () => {
      const civ = createCivilization({
        discordGuildId: '123',
        name: 'Civ',
        now,
      });
      const citizen = createCitizen({
        civilizationId: civ.id,
        discordUserId: '987',
        displayName: 'Bob',
        now,
      });

      const first = addCitizen(civ, citizen);
      const second = addCitizen(first, { ...citizen, displayName: 'Bobby' });

      expect(second.citizens).toHaveLength(1);
      expect(second.resources.population).toBe(2);
    });
  });

  describe('civilizationNameFromGuild', () => {
    it('builds a civilization name from a guild name', () => {
      expect(civilizationNameFromGuild('My Server')).toBe("My Server's Civilization");
    });

    it('falls back when the guild name is empty', () => {
      expect(civilizationNameFromGuild('   ')).toBe('Unnamed Civilization');
    });
  });
});
