import { Interaction, CommandInteraction } from "discord.js";
import IExtendCommandInteraction from "../../types/IExtendCommandInteraction";

import internalUtils from "../../utils/core";

async function messageMiddleware(interaction: Interaction): Promise<void> {
	if (interaction.isCommand()) {
		const command = internalUtils.interactionCommands.find((x) =>
			x.check(interaction.commandName),
		);

		if (command) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-ignore
			interaction.state = {
				user: await internalUtils.getUserInfo(interaction.user.id),
				channel: await internalUtils.getChannelInfo(interaction.channelId),
			};

			await command.process(
				interaction as CommandInteraction & IExtendCommandInteraction,
			);
			await (
				interaction as CommandInteraction & IExtendCommandInteraction
			).state.user.save();
			await (
				interaction as CommandInteraction & IExtendCommandInteraction
			).state.channel.save();
		}
	}
}

export default messageMiddleware;
