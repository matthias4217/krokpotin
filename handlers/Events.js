const node_dir = require('node-dir');

module.exports = (client) => {

    //check all the gathered events
    let eventFiles = node_dir.files('./events', {sync:true}).filter(file => file.endsWith('.js'));

    //tell the client to react on them
    for (const file of eventFiles) {
        const event = require(`../${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }
};
