const { SlashCommandBuilder } = require('@discordjs/builders');
const Minesweeper = require('discord.js-minesweeper');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('minesweeper')
        .setDescription('Simple minesweeper game.')
        .addSubcommand( fixed =>
        fixed.setName('fixed')
            .setDescription('Play with some predetermined size')
            .addStringOption( difficulty =>
                difficulty
                .setName('difficulty')
                .setDescription('The difficulty you want to play in')
                .setRequired(true)
                .addChoices(
                    [[
                        'Beginner',
                        'beginner'
                    ],
                    [
                        'Intermediate',
                        'intermediate'
                    ],
                    [
                        'Expert',
                        'expert'
                    ]]
                )
            )
        )
        .addSubcommand( custom =>
        custom.setName('custom')
        .setDescription('Specify a custom size, make sure it\'s less than 2000 character')
            .addIntegerOption( x =>
            x.setName('x')
                .setDescription('x size')
                .setRequired(true))
            .addIntegerOption( y =>
                y.setName('y')
                    .setDescription('y size')
                    .setRequired(true)
            ).addIntegerOption(mines =>
        mines.setName('mines')
            .setDescription('The number if mines you want')
            .setRequired(true)
        )),

    /*
    name: 'minesweeper',
    aliases: ['µmine', 'ms'],
    description: 'Simple minesweeper game.\nThere are 3 difficulty levels (0, 1, 2 and 3). Level 3 parameters can be ' +
    'customized further :.',
    usage: `<difficulty> [optional with difficulty 3:] <rows> <columns> <mines>`,*/
    async execute(client, interaction) {

        let command = interaction.options.getSubcommand();

        switch (command) {
            case 'custom':{
                const x  = interaction.options.getInteger('x');
                const y = interaction.options.getInteger('y');
                const mines =  interaction.options.getInteger('mines');
                 if (x * y <= mines) {
                     return interaction.reply("Invalid number of mines");
                } else {
                    const minesweeperc = new Minesweeper({
                        rows: x,
                        columns: y,
                        mines: mines,
                        revealFirstCell: true,
                        zeroFirstCell: true,
                        // emote: data["emoji"],
                    });
                    ;await (async function () {
                        try {
                            await interaction.reply(minesweeperc.start())
                        } catch (err) {
                            return interaction.reply("Discord can't handle that many characters, try something like 10*10 with 35 mines or lower the number of mines");
                            // console.log('Too many characters') // will get executed
                        }
                    })()
                } break;
            }
            case 'fixed':{
                let difficulty = interaction.options.getString('difficulty');
                switch (difficulty) {
                    case "beginner":
                        const minesweeperb = new Minesweeper({
                            rows: 5,
                            columns: 5,
                            mines: 6,
                            revealFirstCell: true,
                            zeroFirstCell: true,
                            // emote: data["emoji"],
                        });
                        return interaction.reply(minesweeperb.start())
                    case "intermediate":
                        const minesweeperi = new Minesweeper({
                            rows: 9,
                            columns: 9,
                            mines: 10,
                            revealFirstCell: true,
                            zeroFirstCell: true,
                            // emote: data["emoji"],
                        });
                        return interaction.reply(minesweeperi.start())
                    case "expert":
                        const minesweeperd = new Minesweeper({
                            rows: 9,
                            columns: 10,
                            mines: 35,
                            revealFirstCell: true,
                            zeroFirstCell: true,
                            // emote: data["emoji"],
                        });
                        return interaction.reply(minesweeperd.start());
                    default: return interaction.reply("Invalid arguments");
                    }
            }
        }
    }
};
