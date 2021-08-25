import TextCommand from "../../utils/textCommand";

new TextCommand(/^ping/i, async (message) => {
	return await message.reply("pong");
});
