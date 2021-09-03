const node_dir = require('node-dir');
require('dotenv').config();



module.exports = (client) => {

    //gather the booleans
    const image = [process.env.USE_IMAGE_MODULE, 'imagecommands'];
    const management = [process.env.USE_MANAGEMENT_MODULE, 'management'];
    const games = [process.env.USE_GAMES_MODULE, 'games'];
    const mosaic = [process.env.USE_MOSAIC_MODULE, 'mosaic'];

    //The list of modules to activate
    let dir_list= [];
    const directories = [image, management,games,mosaic];
    for ( let dir in directories) {
        if (directories[dir][0] === 'true') dir_list.push(directories[dir][1]);
    }

    //gather all the files, check if they are to be activated
    let commandsFiles = node_dir.files('./commands', {sync:true})
        .filter(file => file.endsWith('.js'))
            .filter(file => {
                let temp = file.split('\\');
                for ( let dir in dir_list) {
                    if (temp.includes(dir_list[dir])) return true;
                } return false;
            }
        );


    //TODO: Créer une command help à partir des données d'ici
    //set the commands
    for (const file of commandsFiles) {
        const command = require(`../${file}`);
        //check if the commands are a slash command, this is a bad practice but I don't know how to do it properly
        if (!(command.data === undefined))
        {

            client.commands.set(command.data.name, command);
        }
    }
};