const { MessageEmbed } = require('discord.js');

const DEFAULT_COLOR = process.env.DEFAULT_COLOR;

module.exports = {
  usage: `[optional] <users>`,
  async execute(interaction, client, data) {
    const image = data.images[Math.floor(Math.random()*data.images.length)];
    //fetch a random title
    let desc = data.titles[Math.floor(Math.random()*data.titles.length)];
    let user_temp = interaction.options.getUser('user');

    //if a user has been tagged, tag them in the message
    if ( user_temp != null){
      desc += ` <@${user_temp.id}>`
    }

    //create and embed with the image
    const embed = new MessageEmbed().setDescription(desc).setImage(image.url).setColor(0x49909A);
    if (image.source) {
      embed.setFooter(image.source);
    }
    return interaction.reply({embeds: [embed]});
  }
};
