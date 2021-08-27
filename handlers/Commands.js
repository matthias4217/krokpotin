const node_dir = require('node-dir');
require('dotenv').config();


module.exports = (client) => {
    let commandsFiles = node_dir.files('./commands', {sync:true}).filter(file => file.endsWith('.js'));
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