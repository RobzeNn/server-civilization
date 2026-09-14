import { describe, expect, it } from 'vitest';
import { resources } from './schema.js';

describe('db schema', () => {
  it('resources table has the expected default starting values', () => {
    expect(resources.food.default).toBe(100);
    expect(resources.wood.default).toBe(100);
    expect(resources.stone.default).toBe(50);
    expect(resources.gold.default).toBe(0);
    expect(resources.population.default).toBe(1);
  });
});
