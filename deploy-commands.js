const fs = require('fs');
const node_dir = require('node-dir');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

require('dotenv').config();
const clientId = process.env.CLIENT_ID;
const TOKEN = process.env.TOKEN;
const guildId = process.env.GUILD_ID;

const commands = [];

let dir = './commands';

let files = node_dir.files(dir, {sync:true}).filter(file => file.endsWith('.js'));

console.log(files);

for (const file of files) {
    const command = require(`./${file}`);
    if (!(command.data === undefined)){
    commands.push(command.data.toJSON());
    console.log("command added");
    }
}

const rest = new REST({ version: '9' }).setToken(TOKEN);
(async () => {
    try {
        if (commands.length !== 0)
        {
            await rest.put(
                //Routes.applicationCommands(clientId), //Global command deployment
                Routes.applicationGuildCommands(clientId, guildId), //Server command deployment
                { body: commands },
            );
            console.log('Successfully registered application commands.');
        } else console.log('No command added');


    } catch (error) {
        console.log(error);
    }
})();