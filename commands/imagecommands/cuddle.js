const genericImageCommand = require('./generic');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
      .setName('cuddle')
      .setDescription('Send images of people cuddling')
      .addUserOption( user =>
          user.setName('user')
              .setDescription('Tag Whoever you want!')
              .setRequired(false)
      ),
  async execute(client, interaction) {
    // there will be problems if the file doesn't exist, but not a priority for now
    const data = require("../../data/cuddle.json");
    await genericImageCommand.execute(interaction,client, data);
  }
};
