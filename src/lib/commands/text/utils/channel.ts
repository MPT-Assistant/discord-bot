import { MessageButton, MessageActionRow } from "discord.js";
import TextCommand from "../../../utils/textCommand";

new TextCommand(/^(?:канал)$/i, async (message) => {
	const row = new MessageActionRow().addComponents(
		new MessageButton()
			.setCustomId(
				`${message.state.channel.inform ? "disable" : "enable"}_channel_notify`,
			)
			.setLabel(
				`${
					message.state.channel.inform ? "Отключить" : "Включить"
				} уведомления`,
			)
			.setStyle(message.state.channel.inform ? "DANGER" : "SUCCESS"),
	);
	return await message.reply({
		content: `${message.author.username}, профиль канала:
ID: ${message.state.channel.id}
Группа: ${message.state.channel.group || "Не установлена"}
Информирование о заменах: ${
			message.state.channel.inform ? "Включено" : "Отключено"
		}`,
		components: [row],
	});
});
