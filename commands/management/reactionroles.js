const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'reactionroles',
    aliases: ['rr'],
    description: 'This commands allow to set reaction roles. ' +
    'The bot will post a message, and reacting the right reaction will grant you a role.',
    usage: `<role id> <emoji_name> <role id> <custom_emoji_id> ...`,
    execute(msg, args) {

        if (args.length % 2 !== 0) {
            return msg.channel.send("Error, incorrect number of arguments!")
        }

        // console.log(msg.guild.emojis.cache);
        // return;

        const emojiRoles = [];
        for (let i = 0; i < args.length/2; i++) {
            // let emoji = msg.guild.emojis.cache.find(emoji => emoji.name === args[i*2+1]);
            let emoji = args[i*2+1];
            if (emoji.charAt(0) === '<') {
                // const emojiName = emoji.substring(1, emoji.length-1).split(':')[1];
                // emoji = msg.guild.emojis.cache.find(emoji => emoji.name === emojiName);
                emoji = emoji.substring(1, emoji.length-1).split(':')[1];
            }
            emojiRoles.push(
              [msg.channel.guild.roles.cache.get(args[Math.floor(i*2)]),
                emoji]);
        }

        console.log('Emoji Roles:\n', emojiRoles);

        // const role = msg.channel.guild.roles.cache.find(role => role.name === 'Team Red');
        // msg.member.roles.add(role);

        let embed = new MessageEmbed();

        // we send a message to give reaction roles
        embed.setTitle(`React to get the roles`).setColor(process.env.DEFAULT_COLOR);

        msg.channel.send(embed).then(sentMessage => {


            const emojis = [];
            // here we react with the role emojis :
            for (let emojirole of emojiRoles) {
                let emoji = msg.guild.emojis.cache.find(emoji => emoji.name === emojirole[1]);
                if (emoji === undefined) {
                  emoji = emojirole[1];
                }
                emojis.push(emojirole[1]);
                sentMessage.react(emoji);
            }

            console.log(emojis);
            const filter = (reaction, user) => {
                console.log('Reaction', reaction.emoji.name);
                return emojis.includes(reaction.emoji.name) && user.id !== sentMessage.author.id;
            };

            sentMessage.awaitReactions(filter, {max: 1, time: 60000, errors: ['time']})
                .then(collected => {
                    const reaction = collected.first();

                    console.log('Yeee');
                    console.log('Emoji name:', reaction.emoji.name);
                    const role = emojiRoles.find(value => { return value[1] === reaction.emoji.name })[0];
                    console.log('Role:', role.name);
                    // msg.members.roles.add
                    console.log(reaction.users);
                    // sentMessage.guild.roles.add(role);
                    reaction.users.cache.forEach(user => {
                        // TODO check that the member is not the bot
                        sentMessage.guild.members.fetch({ user, cache: false}).then(member => {
                            console.log('Member', member);
                            console.log('User', user);
                            member.roles.add(role);
                            console.log(`${role} has been added to ${user.username}`);
                        })

                    });
                    // if (reaction.emoji.name === '👍') {
                    //     sentMessage.reply('you reacted with a thumbs up.');
                    // } else {
                    //     sentMessage.reply('you reacted with a thumbs down.');
                    // }
                })
                .catch(collected => {
                    sentMessage.reply('you reacted with neither a thumbs up, nor a thumbs down.');
                });
        })
    }
};
