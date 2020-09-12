const genericImageCommand = require('./generic');

module.exports = {
  name: 'cat',
  aliases: ['cats', 'neko', 'meow'],
  description: 'Send images of nice cats',
  usage: genericImageCommand.usage,
  execute(msg, args) {
    const data = require("../../data/cat.json");
    genericImageCommand.execute(msg, data);
  }
};
