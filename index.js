require('dotenv').config();
const { Client, Intents, Collection } = require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

bot.commands = new Collection();
module.exports = bot;
const TOKEN = process.env.TOKEN;

['Events', 'Commands'].forEach(handler => {
    require(`./handlers/${handler}`)(bot);
});

bot.login(TOKEN);
