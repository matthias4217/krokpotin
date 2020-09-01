const genericImageCommand = require('./generic')

module.exports = {
  name: 'doggo',
  aliases: ['inu'],
  description: 'Woof doggo',
  execute(msg, args) {
    var doggoData = require("../../data/doggo.json");
    genericImageCommand.execute(msg, doggoData);
  }
}
