const createText = require('../commands/management/createText.js');
const fs = require("fs");

module.exports = {
    name: 'messageReactionAdd',
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
                            usr.roles.add(role_to_add).catch(err => {
                                //Si le rôle n'a pas pu être attribué, c'est que le rôle a été supprimé ou bien qu'il n'est pas attribuale aux utilisateur·ices
                                //if the role returns an error, it's because it doesn't exist anymore or that the role can't be given to users, it's getting deleted from the database

                                //Create a list of the roles that will not be deleted
                                let roles_to_keep = dataManagement[guild.id]["reactMessages"][messageId]["roles"].filter((role_current) =>
                                    role_current["role"] !== roles[role]["role"]
                                )
                                console.log(roles_to_keep);
                                let channelId = dataManagement[guild.id]["reactMessages"][messageId]["channel"]

                                //I fetch the message from the cache of the channel
                                client.channels.cache.get(channelId).messages.fetch(messageId).then(msg => {
                                    //I replace the old roles with the roles I want to keep
                                    dataManagement[guild.id]["reactMessages"][messageId]["roles"] = roles_to_keep;
                                    //I edit the content of the message thanks to create message, I pass the messageid, guildid and the data from which to build the content
                                    msg.edit(createText.createText(messageId, dataManagement, guild.id)).then(msg => {
                                        reaction.remove();
                                        //I edit the file to save the changes
                                        fs.writeFile('./data/dataManagement.json', JSON.stringify(dataManagement), (err) => {
                                            if (err) {
                                                //TODO: configure an error channel in which the bot will put all the errors
                                                console.log(err);
                                            }
                                        });
                                    });
                                });
                            })
                        })
                    }
                }
            }
        }
    },
};