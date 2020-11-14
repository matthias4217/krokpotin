const genericImageCommand = require('./generic');

module.exports = {
name: 'nyan',
	  aliases: ['catperson'],
	  description: 'Wanna be a catboy or a catgirl?',
	  usage: genericImageCommand.usage,
	  execute(msg, args) {
		  const data = require("../../data/nyan.json");
		  genericImageCommand.execute(msg, data);
	  }
};
