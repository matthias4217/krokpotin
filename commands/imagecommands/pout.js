const genericImageCommand = require('./generic');

module.exports = {
name: 'pout',
	  aliases: [],
	  description: 'Pout when you need to',
	  usage: genericImageCommand.usage,
	  execute(msg, args) {

		  // there will be problems if the file doesn't exist, but not a priority for now
		  var data = require("../../data/pout.json");

		  genericImageCommand.execute(msg, data);
	  }
};
