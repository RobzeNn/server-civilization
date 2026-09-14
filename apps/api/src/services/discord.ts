import type { DiscordGuild, DiscordToken, DiscordUser } from '../types/discord.js';

const DISCORD_API = 'https://discord.com/api/v10';

export async function exchangeCode(
  code: string,
  redirectUri: string,
  clientId: string,
  clientSecret: string,
): Promise<DiscordToken> {
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
  });

  const response = await fetch(`${DISCORD_API}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Discord token exchange failed: ${response.status} ${text}`);
  }

  return response.json() as Promise<DiscordToken>;
}

export async function fetchDiscordUser(accessToken: string): Promise<DiscordUser> {
  const response = await fetch(`${DISCORD_API}/users/@me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Discord user fetch failed: ${response.status} ${text}`);
  }

  return response.json() as Promise<DiscordUser>;
}

export async function fetchDiscordGuilds(accessToken: string): Promise<DiscordGuild[]> {
  const response = await fetch(`${DISCORD_API}/users/@me/guilds`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Discord guilds fetch failed: ${response.status} ${text}`);
  }

  return response.json() as Promise<DiscordGuild[]>;
}

export function makeAvatarUrl(userId: string, avatar: string | null): string {
  if (avatar) {
    return `https://cdn.discordapp.com/avatars/${userId}/${avatar}.png`;
  }
  // Default avatar index based on user discriminator (legacy) or user id (new system).
  const index = Number(BigInt(userId) >> 22n) % 5;
  return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
}
