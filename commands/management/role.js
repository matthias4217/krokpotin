const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Add or remove role from user')
        .addSubcommand(add =>
            add.setName("add")
                .setDescription("Add a role to a user")
                .addUserOption(user =>
                    user.setName("user")
                        .setDescription("The user you want to add the role to")
                        .setRequired(true))
                .addRoleOption(role =>
                    role.setName("role")
                        .setDescription("The role you want to add to the user")
                        .setRequired(true)))
        .addSubcommand(remove =>
            remove.setName("remove")
                .setDescription("Remove a role from a user")
                .addUserOption(user =>
                    user.setName("user")
                        .setDescription("The user you want to remove the role from")
                        .setRequired(true))
                .addRoleOption(role =>
                    role.setName("role")
                        .setDescription("The role you want to remove from the user")
                        .setRequired(true))),
    async execute(client, interaction) {

        const command = interaction.options.getSubcommand();

        let user = interaction.options.getUser("user");
        let role = interaction.options.getRole("role");

        let guild = interaction.guild;
        let dataManagement = require("../../data/dataManagement.json");


        if (dataManagement.hasOwnProperty(guild.id)) {
            if (dataManagement[guild.id]["managers"].length === 0) {
                if (!interaction.member.permissions.has('ADMINISTRATOR')) {
                    return interaction.reply({
                        content: "Only administrators can call this command",
                        ephemeral: 'true'
                    })
                }
            } else {
                const managers = dataManagement[guild.id]["managers"];
                if (!managers.some(role => {
                    interaction.member.roles.cache.has(role)
                }) && !interaction.member.permissions.has('ADMINISTRATOR')) {
                    return interaction.reply({
                        content: "You don't have the required role",
                        ephemeral: 'true'
                    })
                }
            }
        }

        switch (command) {
            case "add" :
                guild.members.fetch(user.id).then(usr => usr.roles.add(role).then(msg => {
                            return interaction.reply('The role has been given')
                        }
                    ).catch(err => {
                        return interaction.reply("This role can't be given")
                    })
                )
                break;
            case "remove":
                guild.members.fetch(user.id).then(usr => usr.roles.remove(role).then(msg => {
                            return interaction.reply('The role has been removed')
                        }
                    ).catch(err => {
                        return interaction.reply("This role can't be given")
                    })
                )
        }


    }
}