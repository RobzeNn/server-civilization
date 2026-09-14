import 'dotenv/config';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import { env } from './env.js';

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Bot logged in as ${readyClient.user.tag}`);
});

client.login(env.DISCORD_BOT_TOKEN).catch((err) => {
  console.error('Bot failed to log in', err);
  process.exit(1);
});
