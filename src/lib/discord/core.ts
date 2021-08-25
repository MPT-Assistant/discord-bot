import Discord from "discord.js";

import messageMiddleware from "./middlewares/message";

const client = new Discord.Client({
	intents: [
		Discord.Intents.FLAGS.GUILDS,
		Discord.Intents.FLAGS.GUILD_MESSAGES,
		Discord.Intents.FLAGS.DIRECT_MESSAGES,
	],
});

client.on("messageCreate", messageMiddleware);

export default client;
