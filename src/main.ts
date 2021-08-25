import moment from "moment";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

import discord from "./lib/discord/core";
import DB from "./lib/DB/core";
import internalUtils from "./lib/utils/core";
import "./lib/commands/loader";

const rest = new REST({ version: "9" }).setToken(DB.config.discord.token);

(async function main() {
	await rest.put(Routes.applicationCommands(DB.config.discord.applicationId), {
		body: internalUtils.interactionCommands.map((x) => x.hint.toJSON()),
	});
	console.log("Successfully registered application commands.");
	moment.locale("ru");
	await internalUtils.mpt.getLastDump();
	await discord.login(DB.config.discord.token);
	console.log(`Start at`, new Date());
})();
