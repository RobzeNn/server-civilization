import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Dashboard } from './Dashboard.js';
import type { CivilizationResponse } from '@server-civilization/shared';

const mockCivilization: CivilizationResponse = {
  id: 'civ-1',
  discordGuildId: '123456789012345678',
  name: "Test Server's Civilization",
  currentDay: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  resources: {
    food: 100,
    wood: 100,
    stone: 50,
    gold: 0,
    population: 1,
  },
};

describe('Dashboard', () => {
  it('renders civilization name, day and resources', () => {
    const { container } = render(
      <Dashboard
        civilization={mockCivilization}
        displayName="Alice"
        avatarUrl={null}
      />,
    );

    const text = container.textContent ?? '';
    expect(text).toContain("Test Server's Civilization");
    expect(text).toContain('Day 1');
    expect(text).toContain('Food');
    expect(text).toContain('100');
    expect(text).toContain('Alice');
  });
});
