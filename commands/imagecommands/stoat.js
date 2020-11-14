const genericImageCommand = require('./generic');

module.exports = {
  name: 'stoat',
  aliases: ['stoats', 'hermine', 'hermines', 'ermine'],
  description: 'Stoats are wonderful',
  usage: genericImageCommand.usage,
  execute(msg, args) {
    const data = require("../../data/stoat.json");
    genericImageCommand.execute(msg, data);
  }
};
