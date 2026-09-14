export interface DiscordToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export interface DiscordUser {
  id: string;
  username: string;
  global_name?: string | null;
  avatar: string | null;
  discriminator: string;
}

export interface DiscordGuild {
  id: string;
  name: string;
}
