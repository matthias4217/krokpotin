const genericImageCommand = require('./generic');

module.exports = {
name: 'sleepy',
	  aliases: [],
	  description: 'Do you need some rest?',
	  usage: genericImageCommand.usage,
	  execute(msg, args) {

		  // there will be problems if the file doesn't exist, but not a priority for now
		  var data = require("../../data/sleepy.json");

		  genericImageCommand.execute(msg, data);
	  }
};
