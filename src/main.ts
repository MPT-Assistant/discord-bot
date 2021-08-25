import moment from "moment";

import discord from "./lib/discord/core";
import DB from "./lib/DB/core";
import utils from "./lib/utils/core";
import "./lib/commands/loader";

(async function main() {
	moment.locale("ru");
	await utils.mpt.getLastDump();
	await discord.login(DB.config.discord.token);
	console.log(`Start at`, new Date());
})();
