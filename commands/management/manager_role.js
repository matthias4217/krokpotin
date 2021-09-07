const {SlashCommandBuilder} = require("@discordjs/builders");
const fs = require("fs");
const dataManagement = require("../../data/dataManagement.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('manager_role')
        .setDescription('Edit the role who can manage the reaction messages, the admin always has the rights')

        .addSubcommand(add =>
            add.setName('add')
                .setDescription('add a manager role')

                .addRoleOption(role =>
                    role.setName("role_add")
                        .setDescription("The role you wish to add")
                        .setRequired(true)))

        .addSubcommand(remove =>
            remove.setName('remove')
                .setDescription('Tag Whoever you want!')

                .addRoleOption(role =>
                    role.setName("role_remove")
                        .setDescription("The role you wish to remove")
                        .setRequired(true))
        ).addSubcommand(show =>
            show.setName("show")
                .setDescription("Show the current list of managers")
        ),
    async execute(client, interaction) {

        const guildId = interaction.guild.id;
        let dataManagement = require('../../data/dataManagement.json');

        function checkGuildId() {
            return dataManagement.hasOwnProperty(guildId)
        }

        let subCommand = interaction.options.getSubcommand();
        switch (subCommand) {
            case "add" :

                if (!interaction.member.permissions.has('ADMINISTRATOR')) {
                    return interaction.reply({
                        content: "Only administrators can call this command",
                        ephemeral: 'true'
                    })
                }

                if (!checkGuildId()) {
                    dataManagement[guildId] =
                        {
                            "bot_channel": "",
                            "managers": [],
                            "password": "",
                            "reactMessages": {}
                        }
                }
                let managers = dataManagement[guildId]["managers"];
                let role = interaction.options.getRole("role_add");
                for (let manager in managers) {
                    if (managers[manager] === role.id) {
                        return interaction.reply("This role is already a manager");
                    }
                }

                dataManagement[guildId]["managers"].push(role.id);

                fs.writeFile('./data/dataManagement.json', JSON.stringify(dataManagement), (err) => {
                    if (err) {
                        return interaction.reply("An unexpected error happened, blame the dev")
                    } else {
                        console.log('manager added');
                        return interaction.reply("The role `" + role.name + "` has been added to the managers");
                    }
                });
                break;

            case "remove" :

                if (!interaction.member.permissions.has('ADMINISTRATOR')) {
                    return interaction.reply({
                        content: "Only administrators can call this command",
                        ephemeral: 'true'
                    })
                }

                if (!checkGuildId()) {
                    return interaction.reply("No data has been set for this guild");
                }

                let role_ = interaction.options.getRole("role_remove");

                let keepers = dataManagement[guildId]["managers"].filter(role => {
                    return !(role === role_.id)
                })

                dataManagement[guildId]["managers"] = keepers;

                fs.writeFile('./data/dataManagement.json', JSON.stringify(dataManagement), (err) => {
                    if (err) {
                        return interaction.reply("An unexpected error happened, blame the dev")
                    } else {
                        console.log('manager removed');
                        return interaction.reply("If it was a manager, the role `" + role_.name + "` has been removed from them");
                    }
                });
                break;
            case "show" :
                if (!checkGuildId()) {
                    return interaction.reply("No data has been set for this guild");
                }

                let managers_ = dataManagement[guildId]["managers"];

                if (managers_.length === 0) {
                    return interaction.reply("No managers have been set, only the administrators have the rights to manage the reaction messages")
                } else {
                    let content = "The following roles are managers:\n\n"
                    for (let manager in managers_) {
                        let role = interaction.guild.roles.cache.find(r => {
                            return r.id === managers_[manager]
                        })
                        content += role.name + "\n";
                    }
                    return interaction.reply(content);
                }


        }
    }
};
