const { MessageEmbed } = require('discord.js');

const DEFAULT_COLOR = process.env.DEFAULT_COLOR;

module.exports = {
  usage: `[optional] <users>`,
  async execute(interaction, client, data) {
    const image = data.images[Math.floor(Math.random()*data.images.length)];
    let desc = data.titles[Math.floor(Math.random()*data.titles.length)];
    let user_temp = interaction.options.getUser('user');
    if ( user_temp != null){
      desc += ` <@${user_temp.id}>`
    }
    const mentionString = '';  // TODO
    /*for (let obj of msg.mentions.users) {
      desc = `${desc} ${obj[1]}`;
    }*/

    const embed = new MessageEmbed().setDescription(desc).setImage(image.url).setColor(0x49909A);
    if (image.source) {
      embed.setFooter(image.source);
    }
    return interaction.reply({embeds: [embed]});
  }
};
