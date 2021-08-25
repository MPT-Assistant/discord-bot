import TextCommand from "../../../utils/textCommand";

new TextCommand(/^(?:профиль|проф)$/i, async (message) => {
	const isEnable = message.state.args[1].toLowerCase() === "включить";
	if (message.state.channel) {
		message.state.channel.inform = isEnable;
		return await message.reply(
			`рассылка замен ${isEnable ? "включена" : "отключена"}.`,
		);
	} else {
		message.state.user.inform = isEnable;
		return await message.reply(
			`рассылка замен ${isEnable ? "включена" : "отключена"}.`,
		);
	}
});
