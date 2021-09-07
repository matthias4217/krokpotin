const {SlashCommandBuilder} = require('@discordjs/builders');
const fs = require('fs');
const dataManagement = require("../../data/dataManagement.json");

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

        //The interactions are for administrators only

        //function that returns a boolean indicating if dataManagement.json has a property guild.id
        let guildIdIsSet = checkGuildId();


        if (guildIdIsSet) {
            if (dataManagement[guildId]["managers"].length === 0) {
                if (!interaction.member.permissions.has('ADMINISTRATOR')) {
                    return interaction.reply({
                        content: "Only administrators can call this command",
                        ephemeral: 'true'
                    })
                }
            } else {
                const managers = dataManagement[guildId]["managers"];
                if (!managers.some(role => {
                    interaction.member.roles.cache.has(role)
                }) && !interaction.member.permissions.has('ADMINISTRATOR') ) {
                    return interaction.reply({
                        content: "You don't have the required role",
                        ephemeral: 'true'
                    })
                }
            }
        }


        //messageId = null if not set
        const messageId = interaction.options.getString('id');

        //check which command has been called
        switch (command) {
            case 'create_message':
                //if the guild does not exist in the database, we create it
                if (!guildIdIsSet) {
                    dataManagement[guildId] =
                        {
                            "bot_channel" : "",
                            "managers": [],
                            "password": "",
                            "reactMessages": {}
                        }
                }


                let channel = interaction.options.getChannel('channel');

                //send a message to the desired channel

                //Error Channel.send is not a function
                const messageSent = await channel.send("This message waits for you to configure it, type `/reactionroles add [role] [emoji]` to add roles");

                //create the entry in the database
                dataManagement[guildId]["reactMessages"][messageSent.id] =
                    {
                        "roles": [],
                        "channel": channel.id
                    }
                //overwrite the files to save the changes
                fs.writeFile('./data/dataManagement.json', JSON.stringify(dataManagement), (err) => {
                    if (err) {
                        //delete the message in case of error with the databse
                        messageSent.delete().then(() => console.log('The message has been deleted'));
                        return interaction.reply("An unexpected error happened, blame the dev")
                    } else {
                        console.log('data Updated');
                        return interaction.reply("The message is now in place in <#" + messageSent.channelId + ">. Set it up using `/reactionsroles add_role [id] [role] [emoji]`. Its id is `" + messageSent.id + "`")
                    }
                });
                break;

            case 'add_role':
                //if the guild does not exist in the database this command will not be executed
                if (guildIdIsSet) {
                    let roleToAdd = interaction.options.getRole('role');

                    //check if the role the user want to add is @everyone
                    if (guildId !== roleToAdd.id) {

                        //check if the id provided correspond to a message in the database
                        if (dataManagement[guildId]["reactMessages"].hasOwnProperty(messageId)) {


                            let channelId = dataManagement[guildId]["reactMessages"][messageId]["channel"];
                            let emoji = interaction.options.getString("emoji");
                            let roles = dataManagement[guildId]["reactMessages"][messageId]["roles"]

                            //check if the role provided is already user
                            for (let role in roles) {
                                if (roles[role]["role"] === roleToAdd.id) {
                                    return interaction.reply('The role is already present in the database, please edit or remove it first')
                                }
                            }

                            //check if the emoji provided is already used
                            for (let role in roles) {
                                if (roles[role]["emoji"] === emoji) {
                                    return interaction.reply('The emoji is already used for another role')
                                }
                            }


                            //fetch the message from the cache of the channel
                            client.channels.cache.get(channelId).messages.fetch(messageId).then(msg => {

                                //react to the message with the emoji provided
                                msg.react(emoji).then(rea => {
                                    let messageFromRea = rea.message;

                                    roles.push({
                                        "role": roleToAdd.id,
                                        "emoji": interaction.options.getString('emoji'),
                                        "order": 0
                                    })

                                    //edit the message witch the content created from dataManagement
                                    messageFromRea.edit(createText(messageId, dataManagement)).then(() => {

                                        //add the role to dataManagement[guildId]["reactMessages"][messageId]["roles"]


                                        //edit the file to save the changes
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

                                    console.log(err.name);
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
                        return interaction.reply("You can't add @everyone as a role");
                } else
                    return interaction.reply("No messages has been set");
                break;

            case 'remove_role' :
                //if the guild does not exist in the database this command will not be executed
                if (guildIdIsSet) {

                    //check if the id provided correspond to a message in the database
                    if (dataManagement[guildId]["reactMessages"].hasOwnProperty(messageId)) {
                        let channelId = dataManagement[guildId]["reactMessages"][messageId]["channel"];
                        let role_to_delete = interaction.options.getRole("role_delete");

                        //retrieve the role the user wants to delete
                        let role = dataManagement[guildId]["reactMessages"][messageId]["roles"].filter((role) =>
                            role["role"] === role_to_delete.id
                        )[0]

                        //Create a list of the roles that will not be deleted. if you know a better way to do this, go for it!
                        let roles_to_keep = dataManagement[guildId]["reactMessages"][messageId]["roles"].filter((role) =>
                            role["role"] !== role_to_delete.id
                        )

                        let emoji = role["emoji"];

                        //I fetch the message from the cache of the channel
                        client.channels.cache.get(channelId).messages.fetch(messageId).then(msg => {
                            let reaction = msg.reactions.resolve(emoji);
                            if (reaction !== null) {
                                //I find the reactions and remove them from the message
                                msg.reactions.resolve(emoji).remove().then((reac) => {
                                    //I replace the old roles with the roles I want to keep
                                    dataManagement[guildId]["reactMessages"][messageId]["roles"] = roles_to_keep;
                                    let messageFromRea = reac.message;
                                    //I edit the content of the message thanks to create message, I pass the messageid, guildid and the data from which to build the content
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
                                dataManagement[guildId]["reactMessages"][messageId]["roles"] = roles_to_keep;
                                client.channels.cache.get(channelId).messages.fetch(messageId).then(msg => {
                                    msg.edit(createText(messageId, dataManagement));
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
                    } else
                        return interaction.reply("The message from this id does not exist in the database");
                } else
                    return interaction.reply("No messages has been set");
                break;


            case 'delete_message' :

                //if the guild does not exist in the database this command will not be executed
                if (guildIdIsSet) {

                    //check if the id provided correspond to a message in the database
                    if (dataManagement[guildId]["reactMessages"].hasOwnProperty(messageId)) {

                        const channelId = dataManagement[guildId]["reactMessages"][messageId]["channel"];

                        //fetch the message from the cache of the channel
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

                        //edit the file to save the changes
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

        function botChannelIsSet() {
            return dataManagement[guildId]["bot_channel"].length === 1
        }


    }


}
;
