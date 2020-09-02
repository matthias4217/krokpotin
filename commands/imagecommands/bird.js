const genericImageCommand = require('./generic');

module.exports = {
  name: 'bird',
  aliases: ['birb', 'birds', 'birbs'],
  description: 'Cute birds',
  execute(msg, args) {

    // there will be problems if the file doesn't exist, but not a priority for now
    var data = require("../../data/bird.json");

    genericImageCommand.execute(msg, data);
  }
};
