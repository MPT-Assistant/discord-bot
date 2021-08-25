import { CommandInteraction as CommandInteractionInterface } from "discord.js";
import {IExtendCommandInteraction} from "../types/events";

import internalUtils from "./core";

type CommandInteractionProcess = (
	message: CommandInteractionInterface & IExtendCommandInteraction,
) => Promise<unknown> | unknown;

class CommandInteraction {
	constructor(
		public string: string,
		public process: CommandInteractionProcess,
	) {
		internalUtils.interactionCommands.push(this);
	}

	public check(input: string): boolean {
		return this.string === input;
	}
}

export default CommandInteraction;
