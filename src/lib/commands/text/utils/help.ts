import TextCommand from "../../../utils/textCommand";

new TextCommand(/^(?:помощь|help|start|команды)$/i, async (message) => {
	return await message.reply({
		content: `Список команд:
https://vk.com/@mpt_assistant-helps`,
	});
});
