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


const image = [process.env.USE_IMAGE_MODULE, 'imagecommands'];
const management = [process.env.USE_MANAGEMENT_MODULE, 'management'];
const games = [process.env.USE_GAMES_MODULE, 'games'];
const mosaic = [process.env.USE_MOSAIC_MODULE, 'mosaic'];

let dir_list= [];
const directories = [image, management,games,mosaic];
for ( let directory in directories) {
    if (directories[directory][0] === 'true') dir_list.push(directories[directory][1]);
}

let files = node_dir.files('./commands', {sync:true})
    .filter(file => file.endsWith('.js'))
    .filter(file => {
            let temp = file.split('\\');
            for ( let dir in dir_list) {
                if (temp.includes(dir_list[dir])) return true;
            } return false;
        }
    );





console.log(files);

for (const file of files) {
    const command = require(`./${file}`);
    if (!(command.data === undefined)){
    commands.push(command.data.toJSON());
    console.log("command added: " + command.data.name );
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