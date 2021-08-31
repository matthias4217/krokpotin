const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'reactionrolesold',
    aliases: ['rr'],
    description: 'This command allow to set',
    usage: `<role> <:emoji:> <role> <:emoji:>`,
    execute(msg, args) {
        let embed = new MessageEmbed();

        const role = msg.channel.guild.roles.cache.find(role => role.name === 'Team Red');
        msg.member.roles.add(role);

        // we send a message to give reaction roles
        embed.setTitle(`React to get the roles`).setColor(process.env.DEFAULT_COLOR);
        msg.channel.send(embed).then(sentMessage => {
            // here we react with the role emojis :
            sentMessage.react('743530916390895657');
            sentMessage.react('👍').then(() => sentMessage.react('👎'));

            const filter = (reaction, user) => {
                return ['👍', '👎'].includes(reaction.emoji.name) && user.id !== sentMessage.author.id;
            };

            sentMessage.awaitReactions(filter, {max: 1, time: 60000, errors: ['time']})
                .then(collected => {
                    const reaction = collected.first();

                    if (reaction.emoji.name === '👍') {
                        sentMessage.reply('you reacted with a thumbs up.');
                    } else {
                        sentMessage.reply('you reacted with a thumbs down.');
                    }
                })
                .catch(collected => {
                    sentMessage.reply('you reacted with neither a thumbs up, nor a thumbs down.');
                });
        })
    }
}
