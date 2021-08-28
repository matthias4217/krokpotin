const node_dir = require('node-dir');
require('dotenv').config();



module.exports = (client) => {

    const image = [process.env.USE_IMAGE_MODULE, 'imagecommands'];
    const management = [process.env.USE_MANAGEMENT_MODULE, 'management'];
    const games = [process.env.USE_GAMES_MODULE, 'games'];
    const mosaic = [process.env.USE_MOSAIC_MODULE, 'mosaic'];

    let dir_list= [];
    const directories = [image, management,games,mosaic];
    for ( let dir in directories) {
        if (directories[dir][0] === 'true') dir_list.push(directories[dir][1]);
    }

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
    //TODO: filter les commandes qui sont déséléctionnées dans .env (split(//) et recherche du mot clé interdit dans la string
    for (const file of commandsFiles) {
        const command = require(`../${file}`);
        if (!(command.data === undefined))
        {
            client.commands.set(command.data.name, command);
        }
    }
};