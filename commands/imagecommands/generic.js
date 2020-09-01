const { MessageEmbed } = require('discord.js');

const DEFAULT_COLOR = process.env.DEFAULT_COLOR;

module.exports = {
  execute(msg, data) {
    const image = data.images[Math.floor(Math.random()*data.images.length)];
    let desc = data.titles[Math.floor(Math.random()*data.titles.length)];
    const mentionString = '';  // TODO
    for (let obj of msg.mentions.users) {
      desc = `${desc} ${obj[1]}`;
    }
    const embed = new MessageEmbed().setDescription(desc).setImage(image.url).setColor(DEFAULT_COLOR);
    if (image.source) {
      embed.setFooter(image.source);
    }
    msg.channel.send(embed);
  }
};
