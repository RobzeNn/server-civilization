import { DiscordSDK } from '@discord/embedded-app-sdk';
import { useCallback, useEffect, useState } from 'react';
import { apiFetch, setAuthToken } from '../api/client.js';
import type { AuthResponse, CivilizationResponse } from '@server-civilization/shared';

interface MeState {
  user: {
    id: string;
    discordUserId: string;
    displayName: string;
    avatarUrl: string | null;
  };
}

export interface Session {
  me: MeState;
  civilization: CivilizationResponse;
}

type AuthStatus =
  | { type: 'loading' }
  | { type: 'ready'; session: Session }
  | { type: 'error'; message: string };

type DiscordScope = 'identify' | 'guilds';

const CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_DISCORD_OAUTH_REDIRECT_URI;

export function useDiscordAuth(): {
  status: AuthStatus;
  authenticate: () => Promise<void>;
} {
  const [status, setStatus] = useState<AuthStatus>({ type: 'loading' });

  const authenticate = useCallback(async () => {
    setStatus({ type: 'loading' });

    try {
      const discordSdk = new DiscordSDK(CLIENT_ID);
      await discordSdk.ready();

      const guildId = discordSdk.guildId;
      const channelId = discordSdk.channelId;

      const scope: DiscordScope[] = ['identify', 'guilds'];
      const { code } = await discordSdk.commands.authorize({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope,
        state: '',
      });

      const auth = (await apiFetch('/auth/discord', {
        method: 'POST',
        body: JSON.stringify({ code, redirectUri: REDIRECT_URI, guildId, channelId }),
      })) as AuthResponse & { user: MeState['user'] };

      setAuthToken(auth.token);

      const [me, civilization] = await Promise.all([
        apiFetch('/api/me') as Promise<MeState>,
        apiFetch('/api/civilization') as Promise<CivilizationResponse>,
      ]);

      setStatus({ type: 'ready', session: { me, civilization } });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setStatus({ type: 'error', message });
    }
  }, []);

  useEffect(() => {
    void authenticate();
  }, [authenticate]);

  return { status, authenticate };
}
