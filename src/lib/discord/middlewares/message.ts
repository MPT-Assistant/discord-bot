import { Message } from "discord.js";
import IExtendMessage from "../../types/IExtendMessage";

import internalUtils from "../../utils/core";

async function messageMiddleware(message: Message): Promise<void> {
	if (message.content === "" || message.author.bot) {
		return;
	}

	const command = internalUtils.textCommands.find((x) =>
		x.check(message.content),
	);

	if (command) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		message.state = {
			args: message.content.match(command.regexp),
			user: await internalUtils.getUserInfo(message.author.id),
			channel: await internalUtils.getChannelInfo(message.channelId),
		};

		command.process(message as Message & IExtendMessage);
	}
}

export default messageMiddleware;
