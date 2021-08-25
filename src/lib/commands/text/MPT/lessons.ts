import moment from "moment";
import utils from "rus-anonym-utils";

import TextCommand from "../../../utils/textCommand";
import internalUtils from "../../../utils/core";
import { Day, Specialty, Group } from "../../../types/mpt";
import { MessageActionRow, MessageButton } from "discord.js";

const DayTemplates: RegExp[] = [
	/воскресенье|вс/,
	/понедельник|пн/,
	/вторник|вт/,
	/среда|ср/,
	/четверг|чт/,
	/пятница|пт/,
	/суббота|сб/,
];

new TextCommand(
	/^(?:расписание|рп|какие пары)(?:\s(.+))?$/i,
	async function LessonsCommand(message) {
		if (
			(message.state.channel &&
				message.state.channel.group === "" &&
				message.state.user.group === "") ||
			(message.state.user.group === "" && !message.state.channel)
		) {
			return await message.reply(
				`Вы не установили свою группу. Для установки своей группы введите команду: "Установить группу [Название группы]", либо же для установки стандартной группы для чата: "regchannel [Название группы].`,
			);
		}

		let userGroup: string | undefined;
		let selectedDate: moment.Moment | undefined;

		if (message.state.user.group === "" && message.state.channel) {
			userGroup = message.state.channel.group;
		} else {
			userGroup = message.state.user.group;
		}

		const groupData = internalUtils.mpt.data.groups.find(
			(x) => x.name === userGroup,
		);

		if (!groupData) {
			throw new Error("Group not found");
		}

		// https://vk.com/sticker/1-1932-512
		switch (true) {
			case !message.state.args[1] ||
				/(?:^сегодня|с)$/gi.test(message.state.args[1]):
				selectedDate = moment();
				break;
			case /(?:^завтра|^з)$/gi.test(message.state.args[1]):
				selectedDate = moment().add(1, "day");
				break;
			case /(?:^послезавтра|^пз)$/gi.test(message.state.args[1]):
				selectedDate = moment().add(2, "day");
				break;
			case /(?:^вчера|^в)$/gi.test(message.state.args[1]):
				selectedDate = moment().subtract(1, "day");
				break;
			case /(?:^позавчера|^поз)$/gi.test(message.state.args[1]):
				selectedDate = moment().subtract(2, "day");
				break;
			case /([\d]+)?(.)?([\d]+)?(.)?([\d]+)/.test(message.state.args[1]): {
				selectedDate = moment(message.state.args[1], "DD.MM.YYYY");
				break;
			}
			default:
				for (const i in DayTemplates) {
					const Regular_Expression = new RegExp(DayTemplates[i], `gi`);
					if (Regular_Expression.test(message.state.args[1]) === true) {
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

		const responseComponents = internalUtils.mpt.generateKeyboard("lessons");

		if (!selectedDate || !selectedDate.isValid()) {
			return await message.reply({
				content: "Неверная дата",
				components: responseComponents,
			});
		}

		if (selectedDate.day() === 0) {
			if (!message.state.args[1]) {
				selectedDate.add(1, "day");
			} else {
				return await message.reply({
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

		if (!message.state.args[1]) {
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

		return await message.reply({
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
);
