import { Message } from "discord.js";
import { IState } from "../types/state";

import internalUtils from "./core";

type TextCommandProcess = (
	message: Message & IState,
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
