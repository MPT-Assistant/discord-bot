import { Message } from "discord.js";
import { IState } from "../../types/state";

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

	const command = internalUtils.textCommands.find((x) =>
		x.check(message.content),
	);

	if (command) {
		command.process(message as Message & IState);
	}
}

export default messageMiddleware;
