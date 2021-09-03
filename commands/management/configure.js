const {SlashCommandBuilder} = require("@discordjs/builders");
const fs = require("fs");
const dataManagement = require("../../data/dataManagement.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('configure')
        .setDescription('Configure the following parameters')
        .addSubcommandGroup(password =>
            password.setName('password')
                .setDescription('change the password (not implemented yet)')
                .addSubcommand(create =>
                    create.setName("set")
                        .setDescription("Set a password for the server that will be used for new member to verify themselves")
                        .addStringOption(password =>
                            password.setName("password")
                                .setDescription("The password you want to setup")
                                .setRequired(true)))
                .addSubcommand(remove =>
                    remove.setName("remove")
                        .setDescription("Remove the password")
                ))
        .addSubcommandGroup(bot_channel =>
            bot_channel.setName('bot_channel')
                .setDescription("The settings of the channel where the bots post error logs")
                .addSubcommand(set =>
                    set.setName('set')
                        .setDescription('Set the channel where the bot will post error logs')
                        .addChannelOption(channel =>
                            channel.setName('channel')
                                .setDescription("The channel you want the bot to post error logs")
                                .setRequired(true))
                ).addSubcommand(remove =>
                remove.setName('remove')
                    .setDescription('The bot will no longer post error logs'))
        ),
    async execute(client, interaction) {

        const guildId = interaction.guild.id;

        const dataManagement = require("../../data/dataManagement.json");

        let commandGroup = interaction.options.getSubcommandGroup();
        let command = interaction.options.getSubcommand();



        switch (commandGroup) {
            case "password" :

                if (!interaction.member.permissions.has('ADMINISTRATOR')) {
                    return interaction.reply({
                        content: "Only administrators can call this command",
                        ephemeral: 'true'
                    })
                }

                switch (command) {

                    case "set" :
                        if (!checkGuildId()) {
                            dataManagement[guildId] =
                                {
                                    "bot_channel": "",
                                    "managers": [],
                                    "password": "",
                                    "reactMessages": {}
                                }
                        }
                        let password = interaction.options.getString("password");

                        if (password.length === 0) {
                            return interaction.reply("Your password can't be an empty string")
                        }

                        dataManagement[guildId]["password"] = password;

                        fs.writeFile('./data/dataManagement.json', JSON.stringify(dataManagement), (err) => {
                            if (err) {
                                return interaction.reply("An unexpected error happened, blame the dev")
                            } else {
                                console.log('manager added');
                                return interaction.reply("The password has been set");
                            }
                        });
                        break;
                    case "remove" :
                        if (!checkGuildId()) {
                            return interaction.reply("Nothing has been set yet")
                        }

                        dataManagement[guildId]["password"] = "";

                        fs.writeFile('./data/dataManagement.json', JSON.stringify(dataManagement), (err) => {
                            if (err) {
                                return interaction.reply("An unexpected error happened, blame the dev")
                            } else {
                                console.log('manager added');
                                return interaction.reply("The password has been removed");
                            }
                        });
                }

                break;
            case "bot_channel":
                switch (command) {
                    case "set" :
                        if (!checkGuildId()) {
                            dataManagement[guildId] =
                                {
                                    "bot_channel": "",
                                    "managers": [],
                                    "password": "",
                                    "reactMessages": {}
                                }
                        }

                        let channel = interaction.options.getChannel('channel');

                        channel.send("I will now display log messages in this channel").then(msg => {
                                dataManagement[guildId]["bot_channel"] = channel.id;

                                fs.writeFile('./data/dataManagement.json', JSON.stringify(dataManagement), (err) => {
                                    if (err) {
                                        return interaction.reply("An unexpected error happened, blame the dev")
                                    } else {
                                        console.log('manager added');
                                        return interaction.reply("The channel has been set");
                                    }
                                });
                            }
                        ).catch(err => {
                            console.log(err);
                            return interaction.reply("sorry, this channel is unavailable for me");
                        })


                        break;
                    case "remove" :
                        if (!checkGuildId()) {
                            return interaction.reply("Nothing has been set yet")
                        }

                        dataManagement[guildId]["bot_channel"] = "";

                        fs.writeFile('./data/dataManagement.json', JSON.stringify(dataManagement), (err) => {
                            if (err) {
                                return interaction.reply("An unexpected error happened, blame the dev")
                            } else {
                                console.log('manager added');
                                return interaction.reply("I will not use this channel anymore");
                            }
                        });
                }


        }

        function checkGuildId() {
            return dataManagement.hasOwnProperty(guildId)
        }
    }
}