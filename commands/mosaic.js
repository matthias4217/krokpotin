const { MessageEmbed } = require('discord.js');

const DEFAULT_COLOR = process.env.DEFAULT_COLOR;

module.exports = {
  name: 'mosaic',
  description: 'Get a mosaic',
  execute(msg, args) {
    const canvasUrl = process.env.MOSAIC_URL;
    let desc = `Not implemented yet. Go to ${canvasUrl} to see the mosaic.`;
    const message = new MessageEmbed().setDescription(desc).setColor(DEFAULT_COLOR);
    msg.channel.send(message)
  }
}
