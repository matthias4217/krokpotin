const genericImageCommand = require('./generic');

module.exports = {
  name: 'cuddle',
  aliases: [],
  description: 'Send images of people cuddling',
  usage: genericImageCommand.usage,
  execute(msg, args) {
    const data = require("../../data/cuddle.json");
    genericImageCommand.execute(msg, data);
  }
};
