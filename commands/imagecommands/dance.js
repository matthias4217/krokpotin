const genericImageCommand = require('./generic');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dance')
		.setDescription('Dance!')
		.addUserOption( user =>
			user.setName('user')
				.setDescription('Tag Whoever you want!')
				.setRequired(false)
		),
	async execute(client, interaction) {
		// there will be problems if the file doesn't exist, but not a priority for now
		const data = require("../../data/dance.json");
		await genericImageCommand.execute(interaction,client, data);
	}
};
