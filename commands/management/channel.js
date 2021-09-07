const {SlashCommandBuilder} = require("@discordjs/builders");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channel')
        .setDescription('Create and manage private channels')
        .addSubcommandGroup(manage =>
            manage.setName('manage')
                .setDescription('Manage your channels')
                .addSubcommand(add =>
                    add.setName("add")
                        .setDescription("add a user to a channel")
                        .addUserOption(user =>
                            user.setName("user")
                                .setDescription("The user you want to add")
                                .setRequired(true))
                        .addChannelOption(channel =>
                            channel.setName("channel")
                                .setDescription("The channel you want to add the user to")
                                .setRequired(true)
                        ))
                .addSubcommand(remove =>
                    remove.setName("remove")
                        .setDescription("Remove a user from a channel")
                        .addUserOption(user =>
                            user.setName("user")
                                .setDescription("The user you want to remove")
                                .setRequired(true))
                        .addChannelOption(channel =>
                            channel.setName("channel")
                                .setDescription("The channel you want to remove the user from")
                                .setRequired(true)
                        )
                ).addSubcommand(del =>
                del.setName("delete")
                    .setDescription("Delete a managed channel")
                    .addChannelOption(channel => channel
                        .setName('channel')
                        .setDescription('The channel you want to remove')
                        .setRequired(true))
            ).addSubcommand(list =>
                list.setName("list")
                    .setDescription("Show the managed channel")
            ).addSubcommand(transfer =>
                transfer.setName("transfer")
                    .setDescription("Transfer the admin rights over a channel. This is permanent")
                    .addUserOption(user =>
                        user.setName("user")
                            .setDescription('The user who will receive the rights')
                            .setRequired(true))
                    .addChannelOption(channel =>
                        channel.setName("channel")
                            .setDescription("The channel you want to transfer the rights")
                            .setRequired(true))
            ))
        .addSubcommand(create =>
            create.setName('create')
                .setDescription("Create a private channel")
                .addStringOption(name =>
                    name.setName('name')
                        .setDescription("The name of the channel, if not set a random flower name will be given")
                        .setRequired(false))
        ),
    async execute(client, interaction) {


    }
}