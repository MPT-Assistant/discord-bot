import { SlashCommandBuilder } from "@discordjs/builders";

class Hint extends SlashCommandBuilder {
	constructor({ name, description }: { name: string; description: string }) {
		super();
		this.setName(name);
		this.setDescription(description);
	}
}

const commands = [
	new Hint({
		name: "расписание",
		description: "Показывает расписание на выбранный день",
	}),
].map((command) => command.toJSON());

export default commands;
