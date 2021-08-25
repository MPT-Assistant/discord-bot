import { Interaction } from "discord.js";

import internalUtils from "./core";

type TextCommandProcess = (message: Interaction) => Promise<unknown> | unknown;

class TextCommand {
	constructor(public interaction: string, public process: TextCommandProcess) {
		internalUtils.interactionCommands.push(this);
	}

	public check(input: string): boolean {
		return this.interaction === input;
	}
}

export default TextCommand;
