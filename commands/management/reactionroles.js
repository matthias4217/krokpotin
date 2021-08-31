const {SlashCommandBuilder} = require('@discordjs/builders');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reactionroles')
        .setDescription('Manage messages to self-assign roles')
        .addSubcommand(create =>

            create.setName('create_message')
                .setDescription('Create a empty message for people to self-assign roles')

                .addChannelOption(channel =>
                    channel.setName('channel')
                        .setDescription('The channel you want the message to be')
                        .setRequired(true))
        ).addSubcommand(add =>
            add.setName('add_role')
                .setDescription('add a role to react message')

                .addStringOption(id =>
                    id.setName('id')
                        .setDescription('The id of the message you want to add a role to')
                        .setRequired(true))

                .addRoleOption(role =>
                    role.setName('role')
                        .setDescription('The role you want to add')
                        .setRequired(true))

                .addStringOption(emoji =>
                    emoji.setName('emoji')
                        .setDescription('The emoji for people to react to')
                        .setRequired(true))
                .addIntegerOption(order =>
                    order.setName('order')
                        .setDescription('The place you want the role to be. otherwise the roles will be displayed in order'))
        ).addSubcommand(remove =>
            remove.setName('remove_role')
                .setDescription('Remove a role from a react message')

                .addStringOption(id =>
                    id.setName('id')
                        .setDescription('The id of the message you want to edit')
                        .setRequired(true))

                .addRoleOption(role =>
                    role.setName('role_delete')
                        .setDescription('The role to delete')
                        .setRequired(true))
        ).addSubcommand(deleted =>
            deleted.setName('delete_message')
                .setDescription('Delete a react message')

                .addStringOption(id =>
                    id.setName('id')
                        .setDescription('The id of the message you want to delete')
                        .setRequired(true))
        )
    //TODO: write the commands so that one may edit the roles
    /*.addSubcommandGroup(edit =>
            edit.setName('edit_role')
                .setDescription('Edit set roles').addSubcommand(emoji =>
                emoji.setName('emoji')
                    .setDescription('update an emoji')
                    .addIntegerOption(id =>
                        id.setName("id_edit_emoji")
                            .setDescription("The message you want to edit")
                            .setRequired(true))
                    .addRoleOption(role =>
                        role.setName('role_edit_emoji')
                            .setDescription("The role you want to edit")
                            .setRequired(true))
            ).addSubcommand(order =>
                order.setName('order')
                    .setDescription('Update the order you want the role to be shown')
                    .addIntegerOption(id =>
                        id.setName("order")
                            .setDescription("The message you want to shift around")
                            .setRequired(true))
                    .addRoleOption(role =>
                        role.setName('order')
                            .setDescription("The role you want to edit")
                            .setRequired(true))))*/

    ,
    async execute(client, interaction) {
        const guildId = interaction.guild.id;
        const command = interaction.options.getSubcommand();

        let dataManagement = require('../../data/dataManagement.json');
        console.log(command);


        if (interaction.member.permissions.has('ADMINISTRATOR')) {

            let guildIdIsSet = checkGuildId();
            const messageId = interaction.options.getString('id');

            switch (command) {
                case 'create_message':
                    if (!guildIdIsSet) {
                        dataManagement[guildId] =
                            {
                                "reactMessages": {}
                            }
                    }


                    let channel = interaction.options.getChannel('channel');

                    const messageSent = await channel.send("This message waits for you to configure it, type `/reactionroles add [role] [emoji]` to add roles");

                    dataManagement[guildId]["reactMessages"][messageSent.id] =
                        {
                            "roles": [],
                            "channel": channel.id
                        }

                    fs.writeFile('./data/dataManagement.json', JSON.stringify(dataManagement), (err) => {
                        if (err) {
                            messageSent.delete().then(() => console.log('The message has been deleted'));
                            return interaction.reply("An unexpected error happened, blame the dev")
                        } else {
                            console.log('data Updated');
                            return interaction.reply("The message is now in place in <#" + messageSent.channelId + ">. Set it up using `/reactionsroles add [role] [emoji]`. Its id is `" + messageSent.id + "`")
                        }
                    });
                    break;
                case 'add_role':
                    if (guildIdIsSet) {


                        if (dataManagement[guildId]["reactMessages"].hasOwnProperty(messageId)) {
                            let channelId = dataManagement[guildId]["reactMessages"][messageId]["channel"];

                            let emoji = interaction.options.getString("emoji");


                            let roles = dataManagement[guildId]["reactMessages"][messageId]["roles"]
                            let roleToAdd = interaction.options.getRole('role');

                            for (let role in roles) {
                                if (roles[role]["role"] === roleToAdd.id) {
                                    return interaction.reply('The role is already present in the database, please edit or remove it first')
                                }
                            }

                            roles.push({
                                "role": roleToAdd.id,
                                "emoji": interaction.options.getString('emoji'),
                                "order": 0
                            })

                            client.channels.cache.get(channelId).messages.fetch(messageId).then(msg => {
                                //TODO:add a regex to check what is the given emoji :emoji: or <:emoji:123456789123456>
                                //TODO: Rectification, check if the emoji is part of the server or not
                                msg.react(emoji).then(rea => {
                                    let messageFromRea = rea.message;
                                    messageFromRea.edit(createText(messageId, dataManagement)).then(() => {
                                        fs.writeFile('./data/dataManagement.json', JSON.stringify(dataManagement), (err) => {
                                            if (err) {
                                                return interaction.reply("An unexpected error happened, blame the dev")
                                            } else {
                                                console.log('data Updated');
                                                return interaction.reply("The role " + interaction.options.getRole('role').name + " has been added to the message");
                                            }
                                        })
                                    });
                                }, err => {
                                    console.log(err);
                                    console.log('this emoji does not exist');
                                    return interaction.reply('This emoji does not exist');
                                })
                            }, (error) => {
                                console.log(error);
                                return interaction.reply("The message from this id does not exist");
                            })
                        } else
                            return interaction.reply("The message from this id does not exist in the database");
                    } else
                        return interaction.reply("No messages has been set");
                    break;

                case 'remove_role' :
                    if (guildIdIsSet) {
                        if (dataManagement[guildId]["reactMessages"].hasOwnProperty(messageId)) {
                            let channelId = dataManagement[guildId]["reactMessages"][messageId]["channel"];
                            let role_to_delete = interaction.options.getRole("role_delete");
                            let role = dataManagement[guildId]["reactMessages"][messageId]["roles"].filter((role) =>
                                role["role"] === role_to_delete.id
                            )[0]

                            let roles_to_keep = dataManagement[guildId]["reactMessages"][messageId]["roles"].filter((role) =>
                                role["role"] !== role_to_delete.id
                            )
                            console.log(roles_to_keep);

                            const index = dataManagement[guildId]["reactMessages"][messageId]["roles"].findIndex(e => {

                                    return e === role;
                                }
                            )

                            let emoji = role["emoji"];

                            client.channels.cache.get(channelId).messages.fetch(messageId).then(msg => {
                                let reaction = msg.reactions.resolve(emoji);
                                if (reaction !== null) {
                                    msg.reactions.resolve(emoji).remove().then((reac) => {
                                        dataManagement[guildId]["reactMessages"][messageId]["roles"] = roles_to_keep;
                                        let messageFromRea = reac.message;
                                        messageFromRea.edit(createText(messageId, dataManagement)).then(() => {
                                            fs.writeFile('./data/dataManagement.json', JSON.stringify(dataManagement), (err) => {
                                                if (err) {
                                                    return interaction.reply("An unexpected error happened, blame the dev")
                                                } else {
                                                    console.log('data Updated');
                                                    return interaction.reply("The role has been removed from the message");
                                                }
                                            })
                                        })

                                    }, err => {
                                        console.log(err);
                                        return interaction.reply("An error occurred, the reaction is already gone, maybe");
                                    });
                                } else {
                                    console.log(index);
                                    console.log(dataManagement[guildId]["reactMessages"][messageId]["roles"][index]);
                                    dataManagement[guildId]["reactMessages"][messageId]["roles"] = roles_to_keep;
                                    client.channels.cache.get(channelId).messages.fetch(messageId).then(msg => {
                                        msg.edit(createText(messageId));
                                    });
                                    fs.writeFile('./data/dataManagement.json', JSON.stringify(dataManagement), (err) => {
                                        if (err) {
                                            return interaction.reply("An unexpected error happened, blame the dev")
                                        } else {
                                            return interaction.reply("The reaction does not exist, database has been cleaned of the entry")
                                        }
                                    });
                                }
                            })
                        } else return interaction.reply("The message from this id does not exist in the database");
                    } else return interaction.reply("No messages has been set");
                    break;


                case 'delete_message' :

                    if (guildIdIsSet) {
                        if (dataManagement[guildId]["reactMessages"].hasOwnProperty(messageId)) {

                            const channelId = dataManagement[guildId]["reactMessages"][messageId]["channel"];

                            client.channels.cache.get(channelId).messages.fetch(messageId)
                                .then(msg =>
                                    msg.delete())
                                .catch((error) => {
                                        console.log(error);
                                        delete dataManagement[guildId]["reactMessages"][messageId];
                                        interaction.reply("This message does not exist");
                                    }
                                )

                            delete dataManagement[guildId]["reactMessages"][messageId]

                            fs.writeFile('./data/dataManagement.json', JSON.stringify(dataManagement), (err) => {
                                if (err) {
                                    return interaction.reply("An unexpected error happened, blame the dev")
                                } else {
                                    return interaction.reply("The message with the id: `" + messageId + "` has been succesfully deleted");
                                }
                            });

                        } else return interaction.reply("This id is not in the database");
                    } else return interaction.reply("No react messages have been created on this server yet")


            }
        } else
            return interaction.reply({
                content: "Sorry, you don't have the rights to do that",
                ephemeral: 'true'
            })

        // there will be problems if the file doesn't exist, but not a priority for now
        //const data = require("../../data/bird.json");
        //await genericImageCommand.execute(interaction,client, data);

        function createText(messageId, dataManagement) {

            let content = "**__Pick Your Role__**\n\n" +
                "**React To This Message to Give Yourself A Role**\n\n";

            let roles = dataManagement[guildId]["reactMessages"][messageId]["roles"]
            /*
                        let unordered_roles = [];
                        let ordered_roles = [];

                        for (let role in roles) {
                            if (roles[role]["order"] === 0) {
                                unordered_roles.push(roles[role]);
                            } else ordered_roles.push(roles[role]);
                        }

                        ordered_roles.sort( (a,b) => {
                            return a["order"] - b["order"];
                        })

                        let roles_list = ordered_roles + unordered_roles;
            */
            let roles_text = "";
            let roles_list = roles;
            for (let role in roles_list) {
                let roleId = roles_list[role]["role"]
                let emoji = roles_list[role]["emoji"]
                roles_text += emoji + " <@&" + roleId + ">\n\n"
            }

            return content + roles_text;
        }

        /**
         * checks if data has been created for the server
         */
        function checkGuildId() {
            return dataManagement.hasOwnProperty(guildId)
        }

        function updateContentMessage(messageId, data, msg) {

        }


    }


}
;
