import utils from "rus-anonym-utils";
import { MessageButton, MessageActionRow } from "discord.js";

import TextCommand from "../../../utils/textCommand";

import internalUtils from "../../../utils/core";

new TextCommand(
	/(?:установить группу|уг)(?:\s(.*))?$/i,
	async function SetGroupCommand(message) {
		if (!message.state.args[1]) {
			return await message.reply("укажите название группы");
		}
		const selectedGroup = internalUtils.mpt.data.groups.find(
			(group) =>
				group.name.toLowerCase() === message.state.args[1].toLowerCase(),
		);

		if (!selectedGroup) {
			const diff: { group: string; diff: number }[] = [];
			for (const i in internalUtils.mpt.data.groups) {
				diff.push({
					group: internalUtils.mpt.data.groups[i].name,
					diff: utils.string.levenshtein(
						message.state.args[1],
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
			return await message.reply({
				content: `Группы ${message.state.args[1]} не найдено, попробуйте ещё раз.${responseText}`,
				components: responseKeyboardRows,
			});
		} else {
			message.state.user.group = selectedGroup.name;
			return await message.reply(
				`Вы установили себе группу ${selectedGroup.name}.\n(${selectedGroup.specialty})`,
			);
		}
	},
);
