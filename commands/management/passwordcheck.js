const {SlashCommandBuilder} = require("@discordjs/builders");
const passwordHash = require('password-hash');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('passwordcheck')
        .setDescription('Enter the password from a server')
        .addStringOption(server =>
            server.setName("server")
                .setDescription("The name of the server")
                .setRequired(false))
        .addStringOption(password =>
            password.setName("password")
                .setDescription("The password of the server")
                .setRequired(false)),
    async execute(client, interaction) {

        let password = interaction.options.getString("password");
        let server = interaction.options.getString("server");

        let dataManagement = require("../../data/dataManagement.json");

        let guildIds = client.guilds.cache.filter(guild => guild.name.toLowerCase() === server.toLowerCase());

        if (guildIds.length === 0) {
            return interaction.reply("The server is not in my database")
        } else {
            guildIds.forEach((value, key) => {
                if (dataManagement.hasOwnProperty(key)) {
                    if (passwordHash.verify(password, dataManagement[key]["password"])) {
                        return interaction.reply("This password is correct");
                    } else return interaction.reply("This password is not correct");
                } else return interaction.reply("I am on this server but am not managing it");
            })
        }
    }
}
