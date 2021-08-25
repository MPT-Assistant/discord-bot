import { SlashCommandBuilder } from "@discordjs/builders";

class Hint extends SlashCommandBuilder {
	constructor({ name, description }: { name: string; description: string }) {
		super();
		this.setName(name);
		this.setDescription(description);
	}
}

const schedule = new Hint({
	name: "расписание",
	description: "Показывает расписание на выбранный день",
});

schedule.addStringOption((option) => {
	option.setName("день");
	option.setDescription(
		"День на который требуется расписание, формат: DD.MM.YYYY",
	);
	option.setRequired(false);
	return option;
});

const commands = [schedule].map((command) => command.toJSON());

export default commands;
