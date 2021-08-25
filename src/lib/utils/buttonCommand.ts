import { ButtonInteraction } from "discord.js";
import { IExtendButtonInteraction } from "../types/events";

import internalUtils from "./core";

type ButtonCommandProcess = (
	interaction: ButtonInteraction & IExtendButtonInteraction,
) => Promise<unknown> | unknown;

class ButtonCommand {
	constructor(public regexp: RegExp, public process: ButtonCommandProcess) {
		internalUtils.buttonCommands.push(this);
	}

	public check(input: string): boolean {
		return this.regexp.test(input);
	}
}

export default ButtonCommand;
