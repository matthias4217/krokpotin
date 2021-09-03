const {SlashCommandBuilder} = require("@discordjs/builders");
const fs = require("fs");
const dataManagement = require("../../data/dataManagement.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addrole')
        .setDescription('add the specified tole to a user'),
    async execute() {
    }
}