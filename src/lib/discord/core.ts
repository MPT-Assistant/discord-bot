import Discord from "discord.js";

import messageMiddleware from "./middlewares/message";

const client = new Discord.Client({
	intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES],
});

client.on("messageCreate", messageMiddleware);
client.on("interactionCreate", (interaction) => {
	console.log(interaction);
});

export default client;
