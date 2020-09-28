const genericImageCommand = require('./generic');

module.exports = {
  name: 'pokemon',
  aliases: ['randompokemon'],
  description: 'Chooses a random gif of a pokemon',
  usage: genericImageCommand.usage,
  execute(msg, args) {
    const data = require("../../data/pokemon.json");
    genericImageCommand.execute(msg, data);
  }
};
