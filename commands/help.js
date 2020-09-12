const {MessageEmbed} = require('discord.js');
const PREFIX = process.env.PREFIX;

module.exports = {
  name: 'help',
  aliases: ['h'],
  description: 'Show all of the commands',
  usage: `[optional] <command>`,
  execute(msg, args) {
    const embed = new MessageEmbed();
    const data = [];
    const {commands} = msg.client;

    if (!args.length) {
      data.push('**Commands:**');
      data.push(commands.map(command => `\`${command.name}\``).join('\n'));
      data.push(`\nYou can send \`${PREFIX}help [command name]\` to get info on a specific command.`);

      embed.setTitle(`Help`);
      embed.setDescription(data.concat('\n'));

    } else {
      const name = args[0].toLowerCase();
      const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

      if (!command) {
        embed.setTitle(`Help`);
        embed.setDescription(`Error, ${args[0].toLowerCase()} is not a valid command name or alias.`);
        embed.setColor(process.env.DEFAULT_COLOR);
        return msg.channel.send(embed);
      }

      embed.setTitle(`Help ${command.name}`);

      if (command.aliases) {
        const commandNames = [];
        commandNames.push(command.name);
        commandNames.push(command.aliases);
        data.push(`**Aliases:** ${commandNames.join(', ')}`);
      }
      if (command.description) data.push(`**Description:** ${command.description}`);
      if (command.usage) data.push(`**Usage:** ${PREFIX}${command.name} ${command.usage}`);

      embed.setDescription(data.concat('\n'));
    }

    embed.setColor(process.env.DEFAULT_COLOR);
    return msg.channel.send(embed);
  },
};