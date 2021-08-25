import { Message } from "discord.js";
import { IExtendMessage } from "../types/events";

import internalUtils from "./core";

type TextCommandProcess = (
	message: Message & IExtendMessage,
) => Promise<unknown> | unknown;

class TextCommand {
	constructor(public regexp: RegExp, public process: TextCommandProcess) {
		internalUtils.textCommands.push(this);
	}

	public check(input: string): boolean {
		return this.regexp.test(input);
	}
}

export default TextCommand;
