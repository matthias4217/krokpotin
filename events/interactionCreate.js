module.exports = {
    name: 'interactionCreate',
    async execute(interaction , client) {
        if (interaction.isCommand()) {
            //await interaction.deferReply( {ephemeral: false} ).catch(() => {});
            const command = client.commands.get(interaction.commandName);
            if (!command) return await interaction.followUp({content: 'This command no longer exists does not exist'}) && client.commands.delete(interaction.commandName);
            command.execute(client, interaction);
        }
    },
};