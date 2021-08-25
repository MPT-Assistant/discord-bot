import utils from "rus-anonym-utils";
import moment from "moment";
import { MessageActionRow, MessageButton } from "discord.js";

import InteractionCommand from "../../../utils/interactionCommand";
import internalUtils from "../../../utils/core";
import { Specialty, Group, Day } from "../../../types/mpt";

const DayTemplates: RegExp[] = [
	/воскресенье|вс/,
	/понедельник|пн/,
	/вторник|вт/,
	/среда|ср/,
	/четверг|чт/,
	/пятница|пт/,
	/суббота|сб/,
];

new InteractionCommand({
	command: "расписание",
	description: "Показывает расписание на выбранный день",
	process: async (interaction) => {
		const selectedDay = interaction.options.get("день", false);
		if (
			(interaction.state.channel &&
				interaction.state.channel.group === "" &&
				interaction.state.user.group === "") ||
			(interaction.state.user.group === "" && !interaction.state.channel)
		) {
			return await interaction.reply(
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

		if (selectedDay) {
			switch (true) {
				case /(?:^сегодня|с)$/gi.test(selectedDay.value as string):
					selectedDate = moment();
					break;
				case /(?:^завтра|^з)$/gi.test(selectedDay.value as string):
					selectedDate = moment().add(1, "day");
					break;
				case /(?:^послезавтра|^пз)$/gi.test(selectedDay.value as string):
					selectedDate = moment().add(2, "day");
					break;
				case /(?:^вчера|^в)$/gi.test(selectedDay.value as string):
					selectedDate = moment().subtract(1, "day");
					break;
				case /(?:^позавчера|^поз)$/gi.test(selectedDay.value as string):
					selectedDate = moment().subtract(2, "day");
					break;
				case /([\d]+)?(.)?([\d]+)?(.)?([\d]+)/.test(
					selectedDay.value as string,
				): {
					selectedDate = moment(selectedDay.value as string, "DD.MM.YYYY");
					break;
				}
				default:
					for (const i in DayTemplates) {
						const Regular_Expression = new RegExp(DayTemplates[i], `gi`);
						if (Regular_Expression.test(selectedDay.value as string) === true) {
							const currentDate = new Date();
							const targetDay = Number(i);
							const targetDate = new Date();
							const delta = targetDay - currentDate.getDay();
							if (delta >= 0) {
								targetDate.setDate(currentDate.getDate() + delta);
							} else {
								targetDate.setDate(currentDate.getDate() + 7 + delta);
							}
							selectedDate = moment(targetDate);
						}
					}
					break;
			}
		}

		const responseComponents = internalUtils.mpt.generateKeyboard("lessons");

		if (!selectedDate || !selectedDate.isValid()) {
			return await interaction.reply({
				content: "Неверная дата",
				components: responseComponents,
			});
		}

		if (selectedDate.day() === 0) {
			if (!selectedDay) {
				selectedDate.add(1, "day");
			} else {
				return await interaction.reply({
					content: `${selectedDate.format("DD.MM.YYYY")} воскресенье.`,
					components: responseComponents,
				});
			}
		}

		const parsedTimetable = internalUtils.mpt.parseTimetable(selectedDate);

		const selectSpecialty = internalUtils.mpt.data.schedule.find(
			(specialty) => specialty.name === groupData.specialty,
		) as Specialty;

		const selectGroup = selectSpecialty.groups.find(
			(group) => group.name === groupData.name,
		) as Group;

		if (!selectedDay) {
			const selectedDayNum = selectedDate.day();
			const selectDaySchedule = selectGroup.days.find(
				(day) => day.num === selectedDayNum,
			) as Day;

			const lastLessonNum =
				selectDaySchedule.lessons[selectDaySchedule.lessons.length - 1].num;

			if (
				parsedTimetable.find(
					(x) => x.num === lastLessonNum && x.type === "lesson",
				)?.status === "finished"
			) {
				if (selectedDayNum + 1 === 7) {
					selectedDate.add(2, "day");
				} else {
					selectedDate.add(1, "day");
				}
			}
		}

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

		return await interaction.reply({
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
	},
}).hint.addStringOption((option) => {
	option.setName("день");
	option.setDescription(
		"День на который требуется расписание, формат: DD.MM.YYYY",
	);
	option.setRequired(false);
	return option;
});
