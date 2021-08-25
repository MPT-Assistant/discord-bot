import ButtonCommand from "../../../utils/buttonCommand";
import internalUtils from "../../../utils/core";

new ButtonCommand(/^(?:setGroup_)(.*)/, async (interaction) => {
	const selectedGroupData = internalUtils.mpt.data.groups.find(
		(group) =>
			group.name.toLowerCase() === interaction.state.args[1].toLowerCase(),
	);
	if (!selectedGroupData) {
		return await interaction.update(
			`Группы ${interaction.state.args[1]} не найдено`,
		);
	} else {
		interaction.state.user.group = selectedGroupData.name;
		return await interaction.update({
			content: `Вы установили себе группу ${selectedGroupData.name} (${selectedGroupData.specialty})`,
			components: [],
		});
	}
});
