const genericImageCommand = require('./generic');

module.exports = {
name: 'hug',
	  aliases: [],
	  description: 'A hug for you !',
	  usage: genericImageCommand.usage,
	  execute(msg, args) {

		  // there will be problems if the file doesn't exist, but not a priority for now
		  var data = require("../../data/hug.json");

		  genericImageCommand.execute(msg, data);
	  }
};
