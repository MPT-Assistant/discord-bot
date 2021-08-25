import { CommandInteraction as CommandInteractionInterface } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { IExtendCommandInteraction } from "../types/events";

import internalUtils from "./core";

type CommandInteractionProcess = (
	message: CommandInteractionInterface & IExtendCommandInteraction,
) => Promise<unknown> | unknown;

class Hint extends SlashCommandBuilder {
	constructor({ name, description }: { name: string; description: string }) {
		super();
		this.setName(name);
		this.setDescription(description);
	}
}

class CommandInteraction {
	public command: string;
	public process: CommandInteractionProcess;
	public hint: Hint;

	constructor({
		command,
		description,
		process,
	}: {
		command: string;
		description: string;
		process: CommandInteractionProcess;
	}) {
		this.command = command;
		this.process = process;
		this.hint = new Hint({
			name: command,
			description,
		});
		internalUtils.interactionCommands.push(this);
	}

	public check(input: string): boolean {
		return this.command === input;
	}
}

export default CommandInteraction;
