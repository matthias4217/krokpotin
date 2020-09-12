const Minesweeper = require('discord.js-minesweeper');

module.exports = {
    name: 'minesweeper',
    aliases: ['µmine', 'ms'],
    description: 'Simple minesweeper game.\nThere are 3 difficulty levels (0, 1, 2 and 3). Level 3 parameters can be ' +
    'customized further :.',
    usage: `<difficulty> [optional with difficulty 3:] <rows> <columns> <mines>`,
    execute(msg, args) {
        //let data = require("../../data/mine.json");
        // console.log(args);
        let difficulty = args[0];
        switch (difficulty) {
            case "0":
                const minesweeperb = new Minesweeper({
                    rows: 5,
                    columns: 5,
                    mines: 6,
                    revealFirstCell: true,
                    // emote: data["emoji"],
                });
                msg.channel.send(minesweeperb.start());
                break;
            case "1":
                const minesweeperi = new Minesweeper({
                    rows: 9,
                    columns: 9,
                    mines: 10,
                    // emote: data["emoji"],
                });
                msg.channel.send(minesweeperi.start());
                break;
            case "2":
                const minesweeperd = new Minesweeper({
                    rows: 12,
                    columns: 12,
                    mines: 50,
                    // emote: data["emoji"],
                });
                msg.channel.send(minesweeperd.start());
                break;
            case "3":
                if (typeof args[1] === 'undefined' || typeof args[2] === 'undefined' || typeof args[3] === 'undefined') {
                    msg.channel.send("Invalid arguments");
                } else if (args[1] * args[2] <= args[3]) {
                    msg.channel.send("Invalid number of mines");
                } else {
                    const minesweeperc = new Minesweeper({
                        rows: parseInt(args[1]),
                        columns: parseInt(args[2]),
                        mines: parseInt(args[3]),
                        revealFirstCell: true,
                        // emote: data["emoji"],
                    });
                    ;(async function () {
                        try {
                            await msg.channel.send(minesweeperc.start())
                        } catch (err) {
                            msg.channel.send("Discord can't handle that many characters, try something like 12*12 with 50 mines");
                            // console.log('Too many characters') // will get executed
                        }
                    })()
                }
                break;
            // case "emote":
            //     emote = args[1];
            //     break;
            default: msg.channel.send("Invalid arguments");
        }
    }
};
