import { Message } from "discord.js";

import internalUtils from "../../utils/core";

async function messageMiddleware(message: Message): Promise<void> {
	if (message.content === "" || message.author.bot) {
		return;
	}

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	message.state = {
		user: await internalUtils.getUserInfo(message.author.id),
		channel: await internalUtils.getChannelInfo(message.channelId),
	};
}

export default messageMiddleware;
