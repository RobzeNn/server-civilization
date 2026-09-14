import { describe, expect, it } from 'vitest';
import { makeAvatarUrl } from './discord.js';

describe('makeAvatarUrl', () => {
  it('returns a CDN avatar url when an avatar hash is present', () => {
    const url = makeAvatarUrl('123456789012345678', 'abcdef');
    expect(url).toBe('https://cdn.discordapp.com/avatars/123456789012345678/abcdef.png');
  });

  it('returns a default avatar url when no avatar hash is present', () => {
    const url = makeAvatarUrl('123456789012345678', null);
    expect(url).toMatch(/^https:\/\/cdn\.discordapp\.com\/embed\/avatars\/\d\.png$/);
  });
});
