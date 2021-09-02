module.exports = {
    name: 'interactionCreate',
    async execute(interaction , client) {

        //check if the interaction is a command
        if (interaction.isCommand()) {

            //this line is useful if you don't provide an answer to the interaction in less than 3 seconds
            //await interaction.deferReply( {ephemeral: false} ).catch(() => {});
            const command = client.commands.get(interaction.commandName);
            //if the called command does not exist, delete it from the list
            if (!command) return await interaction.followUp({content: 'This command no longer exists does not exist'}) && client.commands.delete(interaction.commandName);
            //call the command
            command.execute(client, interaction);
        }
    },
};