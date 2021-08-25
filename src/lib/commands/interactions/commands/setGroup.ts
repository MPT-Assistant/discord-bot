import utils from "rus-anonym-utils";
import { MessageActionRow, MessageButton } from "discord.js";

import InteractionCommand from "../../../utils/interactionCommand";
import internalUtils from "../../../utils/core";

new InteractionCommand({
	command: "уг",
	description: "Позволяет выбрать Вашу группу",
	process: async (interaction) => {
		const selectedGroup = interaction.options.get("группа", true)
			.value as string;

		const selectedGroupData = internalUtils.mpt.data.groups.find(
			(group) => group.name.toLowerCase() === selectedGroup.toLowerCase(),
		);

		if (!selectedGroupData) {
			const diff: { group: string; diff: number }[] = [];
			for (const i in internalUtils.mpt.data.groups) {
				diff.push({
					group: internalUtils.mpt.data.groups[i].name,
					diff: utils.string.levenshtein(
						selectedGroup,
						internalUtils.mpt.data.groups[i].name,
						{
							replaceCase: 0,
						},
					),
				});
			}
			diff.sort(function (a, b) {
				if (a.diff > b.diff) {
					return 1;
				}
				if (a.diff < b.diff) {
					return -1;
				}
				return 0;
			});
			let responseText = `\nВозможно вы имели в виду какую то из этих групп:`;
			const responseKeyboardRows: MessageActionRow[] = [];
			const buttonColors: Array<"SUCCESS" | "SECONDARY" | "DANGER"> = [
				"SUCCESS",
				"SECONDARY",
				"DANGER",
			];
			for (let i = 0; i < 3; ++i) {
				responseKeyboardRows.push(
					new MessageActionRow({
						components: [
							new MessageButton({
								customId: "setGroup_" + diff[i].group,
								style: buttonColors[i],
								label: diff[i].group,
							}),
						],
					}),
				);

				responseText += `\n${i + 1}. ${diff[i].group}`;
			}
			return await interaction.reply({
				content: `Группы ${selectedGroup} не найдено, попробуйте ещё раз.${responseText}`,
				components: responseKeyboardRows,
			});
		} else {
			interaction.state.user.group = selectedGroupData.name;
			return await interaction.reply(
				`Вы установили себе группу ${selectedGroupData.name}.\n(${selectedGroupData.specialty})`,
			);
		}
	},
}).hint.addStringOption((option) => {
	option.setName("группа");
	option.setDescription("Ваша группа");
	option.setRequired(true);
	return option;
});
