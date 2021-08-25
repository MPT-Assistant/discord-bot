import utils from "rus-anonym-utils";
import moment from "moment";
import { MessageActionRow, MessageButton } from "discord.js";

import ButtonCommand from "../../../utils/buttonCommand";
import internalUtils from "../../../utils/core";

new ButtonCommand(/^(?:lessons_)(.*)/, async (interaction) => {
	if (
		(interaction.state.channel &&
			interaction.state.channel.group === "" &&
			interaction.state.user.group === "") ||
		(interaction.state.user.group === "" && !interaction.state.channel)
	) {
		return await interaction.update(
			`Вы не установили свою группу. Для установки своей группы введите команду: "Установить группу [Название группы]", либо же для установки стандартной группы для чата: "regchannel [Название группы].`,
		);
	}

	let userGroup: string | undefined;
	let selectedDate: moment.Moment = moment();

	if (interaction.state.user.group === "" && interaction.state.channel) {
		userGroup = interaction.state.channel.group;
	} else {
		userGroup = interaction.state.user.group;
	}

	const groupData = internalUtils.mpt.data.groups.find(
		(x) => x.name === userGroup,
	);

	if (!groupData) {
		throw new Error("Group not found");
	}

	switch (true) {
		case /^(?:tomorrow)$/gi.test(interaction.state.args[1]):
			selectedDate = moment().add(1, "day");
			break;
		case /^(?:yesterday)$/gi.test(interaction.state.args[1]):
			selectedDate = moment().subtract(1, "day");
			break;
		case /([\d]+)?(.)?([\d]+)?(.)?([\d]+)/.test(interaction.state.args[1]): {
			selectedDate = moment(interaction.state.args[1], "DD.MM.YYYY");
			break;
		}
	}

	const responseComponents = internalUtils.mpt.generateKeyboard("lessons");

	if (!selectedDate || !selectedDate.isValid()) {
		return await interaction.update({
			content: "Неверная дата",
			components: responseComponents,
		});
	}

	if (selectedDate.day() === 0) {
		return await interaction.update({
			content: `${selectedDate.format("DD.MM.YYYY")} воскресенье.`,
			components: responseComponents,
		});
	}

	const parsedTimetable = internalUtils.mpt.parseTimetable(selectedDate);

	const parsedSchedule = internalUtils.mpt.parseSchedule(
		groupData,
		selectedDate,
	);

	if (parsedSchedule.replacementsCount !== 0) {
		responseComponents.push(
			new MessageActionRow({
				components: [
					new MessageButton({
						customId: "replacements_" + selectedDate.format("DD.MM.YYYY"),
						style: "SECONDARY",
						label: "Замены",
					}),
				],
			}),
		);
	}

	let responseLessonsText = "";

	for (const lesson of parsedSchedule.lessons) {
		const lessonDateData = parsedTimetable.find(
			(x) => x.num === lesson.num && x.type === "lesson",
		);
		responseLessonsText += `${
			lessonDateData
				? lessonDateData.start.format("HH:mm:ss") +
				  " - " +
				  lessonDateData.end.format("HH:mm:ss")
				: ""
		}\n${lesson.num}. ${lesson.name} (${lesson.teacher})\n\n`;
	}

	const selectedDayName = selectedDate.format("dddd").split("");
	selectedDayName[0] = selectedDayName[0].toUpperCase();

	return await interaction.update({
		content: `Расписание на ${selectedDate.format("DD.MM.YYYY")}:
Группа: ${groupData.name}
День: ${selectedDayName.join("")}
Место: ${parsedSchedule.place}
Неделя: ${parsedSchedule.week}
${responseLessonsText}
${
	parsedSchedule.replacementsCount > 0
		? `\nВнимание:\nНа выбранный день есть ${utils.string.declOfNum(
				parsedSchedule.replacementsCount,
				["замена", "замены", "замены"],
		  )}.\nПросмотреть текущие замены можно командой "замены".`
		: ""
}`,
		components: responseComponents,
	});
});
