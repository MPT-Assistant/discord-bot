import { MessageButton, MessageActionRow } from "discord.js";
import TextCommand from "../../../utils/textCommand";

new TextCommand(/^(?:профиль|проф)$/i, async (message) => {
	const row = new MessageActionRow().addComponents(
		new MessageButton()
			.setCustomId(`${message.state.user.inform ? "disable" : "enable"}_notify`)
			.setLabel(
				`${message.state.user.inform ? "Отключить" : "Включить"} уведомления`,
			)
			.setStyle(message.state.user.inform ? "DANGER" : "SUCCESS"),
	);
	return await message.reply({
		content: `Ваш профиль:
ID: ${message.state.user.id}
Группа: ${message.state.user.group || "Не установлена"}
Информирование о заменах: ${
			message.state.user.inform ? "Включено" : "Отключено"
		}`,
		components: [row],
	});
});
