const genericImageCommand = require('./generic');

module.exports = {
name: 'dance',
	  aliases: ['danse'],
	  description: 'Dance !',
	  usage: genericImageCommand.usage,
	  execute(msg, args) {

		  // there will be problems if the file doesn't exist, but not a priority for now
		  var data = require("../../data/dance.json");

		  genericImageCommand.execute(msg, data);
	  }
};
