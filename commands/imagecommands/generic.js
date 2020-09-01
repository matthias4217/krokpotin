const { MessageEmbed } = require('discord.js');

const DEFAULT_COLOR = process.env.DEFAULT_COLOR;

module.exports = {
  execute(msg, data) {
    const imageUrl = data.images[Math.floor(Math.random()*data.images.length)].url;
    let desc = data.titles[Math.floor(Math.random()*data.titles.length)];
    const mentionString = '';  // TODO
    for (let obj of msg.mentions.users) {
      desc = `${desc} ${obj[1]}`;
    }
    const embed = new MessageEmbed().setDescription(desc).setImage(imageUrl).setColor(DEFAULT_COLOR);
    msg.channel.send(embed);
  }
}
