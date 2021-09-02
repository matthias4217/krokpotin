const createText = require("../commands/management/createText.js");
const fs = require("fs");

module.exports = {
    name: 'messageReactionRemove',
    async execute(reaction, user, client) {
        //Checks if the user is a bot to ignore the reaction if that's the case. I was using reaction.me before but it was not working properly
        if (user.bot) {
            console.log("This is a bot so im not reacting")
            return;
        }
        let dataManagement = require('../data/dataManagement.json');
        let guild = reaction.message.guild;
        //Check if guild is a managed guild
        if (dataManagement.hasOwnProperty(guild.id)) {
            let messageId = reaction.message.id;
            //Check if message is a managed message
            if (dataManagement[guild.id]["reactMessages"].hasOwnProperty(messageId)) {
                let roles = dataManagement[guild.id]["reactMessages"][messageId]["roles"];
                let emoji = reaction.emoji.name;
                //check if reaction is a managed reaction
                for (let role in roles) {
                    if (roles[role]["emoji"] === emoji) {
                        guild.members.fetch(user.id).then(usr => {
                            let role_to_add = guild.roles.cache.find(r => r.id === roles[role]["role"]);
                            usr.roles.remove(role_to_add).catch(err => {
                                console.log("The role no longer exist, no big deal");
                            })
                        })
                    }
                }
            }
        }
    }
}
