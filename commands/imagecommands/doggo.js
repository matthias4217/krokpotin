const genericImageCommand = require('./generic');

module.exports = {
  name: 'doggo',
  aliases: ['inu', 'dog'],
  description: 'Send images of various dogs',
  usage: genericImageCommand.usage,
  execute(msg, args) {
    const data = require("../../data/doggo.json");
    genericImageCommand.execute(msg, data);
  }
};
