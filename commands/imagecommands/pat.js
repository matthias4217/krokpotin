const genericImageCommand = require('./generic');

module.exports = {
  name: 'pat',
  aliases: ['pats'],
  description: 'Pat your friends !',
  usage: genericImageCommand.usage,
  execute(msg, args) {

    // there will be problems if the file doesn't exist, but not a priority for now
    var data = require("../../data/pat.json");

    genericImageCommand.execute(msg, data);
  }
};
