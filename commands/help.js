module.exports = {
    name: 'help',
    aliases: ['h'],
    description: 'Show all of the commands',
    execute(msg, args) {
        let embed;
        let data = require("./help.json");
        switch (args[0]) {
            case "d":
                embed = data["dice"];
                console.log({embed});
                msg.channel.send({embed});
                break;
            case "loc":
                embed = data["location"];
                msg.channel.send({embed});
                break;
            case "char":
                embed = data["char"];
                msg.channel.send({embed});
                break;
            default:
                embed = data["general"];
                msg.channel.send({embed});
                break;
            // default: msg.channel.send("coucou");
        }
    },
};
