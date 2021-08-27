const genericImageCommand = require('./generic');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
data: new SlashCommandBuilder()
    .setName('birb')
    .setDescription('Send images of cute birds')
    .addUserOption( user =>

    user.setName('user')
        .setDescription('Tag Whoever you want!')
        .setRequired(false)
    ),
  async execute(client, interaction) {
    // there will be problems if the file doesn't exist, but not a priority for now
    const data = require("../../data/bird.json");
    await genericImageCommand.execute(interaction,client, data);
  }
};
