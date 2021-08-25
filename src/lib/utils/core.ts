import discord from "../discord/core";
import DB from "../DB/core";

import TextCommand from "./textCommand";
import InteractionCommand from "./interactionCommand";
import ButtonCommand from "./buttonCommand";

import MPT from "./lib/mpt";

class Utils {
	public textCommands: TextCommand[] = [];
	public buttonCommands: ButtonCommand[] = [];
	public interactionCommands: InteractionCommand[] = [];

	public mpt = new MPT();

	public async getUserInfo(id: string) {
		let data = await DB.bot.models.user.findOne({
			id,
		});
		if (!data) {
			data = new DB.bot.models.user({
				id,
				ban: false,
				group: "",
				inform: true,
				reported_replacements: [],
				reg_date: new Date(),
			});
			await data.save();
			this.sendLog(
				`Зарегистрирован новый пользователь\nhttps://discordapp.com/users/${id}`,
			);
		}
		return data;
	}

	public async getChannelInfo(id: string) {
		let data = await DB.bot.models.channel.findOne({
			id,
		});
		if (!data) {
			data = new DB.bot.models.channel({
				id,
				group: "",
				inform: true,
				reported_replacements: [],
			});
			await data.save();
			this.sendLog(`Зарегистрирован новый канал\nID: ${id}`);
		}
		return data;
	}

	public async sendLog(text: string) {
		const channel = await discord.channels.fetch("879876747858948189");
		if (channel?.isText()) {
			channel.send(text);
		}
	}
}

export default new Utils();
