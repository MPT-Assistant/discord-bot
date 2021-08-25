import moment from "moment";
import utils from "rus-anonym-utils";

import TextCommand from "../../../utils/textCommand";
import internalUtils from "../../../utils/core";

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
	/^(?:замены на|замены)(?:\s(.+))?$/i,
	async function ReplacementsCommand(message) {
		if (
			(message.state.channel &&
				message.state.channel.group === "" &&
				message.state.user.group === "") ||
			(message.state.user.group === "" && !message.state.channel)
		) {
			return await message.reply(
				`Вы не установили свою группу. Для установки своей группы введите команду: "Установить группу [Название группы]", либо же для установки стандартной группы для чата: "regchat [Название группы].`,
			);
		}

		let userGroup: string | undefined;
		let selectedDate: moment.Moment | undefined;

		if (message.state.channel === "" && message.channel) {
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
				const splittedMessageArgument = message.state.args[1].split(".");
				const currentSplittedDate = moment().format("DD.MM.YYYY");
				splittedMessageArgument[0] =
					splittedMessageArgument[0] || currentSplittedDate[0];
				splittedMessageArgument[1] =
					splittedMessageArgument[1] || currentSplittedDate[1];
				splittedMessageArgument[2] =
					splittedMessageArgument[2] || currentSplittedDate[2];
				selectedDate = moment(splittedMessageArgument.reverse().join("-"));
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

		const responseComponents =
			internalUtils.mpt.generateKeyboard("replacements");

		if (!selectedDate || !selectedDate.isValid()) {
			return await message.reply({
				content: "Неверная дата",
				components: responseComponents,
			});
		}

		if (selectedDate.day() === 0) {
			return await message.reply({
				content: `${selectedDate.format("DD.MM.YYYY")} воскресенье.`,
				components: responseComponents,
			});
		}

		const selectDayReplacements = internalUtils.mpt.data.replacements.filter(
			(replacement) =>
				replacement.group.toLowerCase() === groupData.name.toLowerCase() &&
				moment(replacement.date).format("DD.MM.YYYY") ===
					selectedDate?.format("DD.MM.YYYY"),
		);

		if (selectDayReplacements.length === 0) {
			return await message.reply({
				content: `На выбранный день (${selectedDate.format(
					"DD.MM.YYYY",
				)}) замен для группы ${groupData.name} не найдено.`,
				components: responseComponents,
			});
		} else {
			let responseReplacementsText = "";
			for (let i = 0; i < selectDayReplacements.length; i++) {
				const replacement = selectDayReplacements[i];
				responseReplacementsText += `Замена #${Number(i) + 1}:
Пара: ${replacement.lessonNum}
Заменяемая пара: ${replacement.oldLessonName}
Преподаватель: ${replacement.oldLessonTeacher}
Новая пара: ${replacement.newLessonName}
Преподаватель на новой паре: ${replacement.newLessonTeacher}
Добавлена на сайт: ${moment(replacement.addToSite).format(
					"HH:mm:ss | DD.MM.YYYY",
				)}
Обнаружена ботом: ${moment(replacement.detected).format(
					"HH:mm:ss | DD.MM.YYYY",
				)}\n\n`;
			}
			return await message.reply({
				content: `На выбранный день ${selectedDate.format(
					"DD.MM.YYYY",
				)} для группы ${groupData.name} ${utils.string.declOfNum(
					selectDayReplacements.length,
					["найдена", "найдено", "найдено"],
				)} ${selectDayReplacements.length} ${utils.string.declOfNum(
					selectDayReplacements.length,
					["замена", "замены", "замен"],
				)}:\n\n${responseReplacementsText}`,
				components: responseComponents,
			});
		}
	},
);
