const genericImageCommand = require('./generic');

module.exports = {
  name: 'boop',
  aliases: [],
  description: 'Send boop images',
  usage: genericImageCommand.usage,
  execute(msg, args) {

    // there will be problems if the file doesn't exist, but not a priority for now
    var data = require("../../data/boop.json");

    genericImageCommand.execute(msg, data);
  }
};
