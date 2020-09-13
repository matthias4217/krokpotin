const {MessageEmbed} = require('discord.js');
const {createCanvas, createImageData} = require('canvas');
const fs = require('fs');
const https = require('https');

const DEFAULT_COLOR = process.env.DEFAULT_COLOR;

module.exports = {
    name: 'mosaic',
    aliases: ['canvas', 'canevas', 'mosaique'],
    description: 'Get a mosaic',
    execute(msg, args) {
        const canvasUrl = process.env.MOSAIC_URL;
        let desc = ``;

        https.get(`https://${canvasUrl}${process.env.MOSAIC_DATA_ROUTE}`, (res) => {

            let jsonData = '';
            res.on('data', (d) => {
                jsonData += d;
            });

            res.on('end', () => {
                jsonData = JSON.parse(jsonData);
                let canvas = createCanvas(jsonData.width, jsonData.height);
                let ctx = canvas.getContext('2d');

                let color = null;
                // here we fill the canvas
                if (jsonData.array) {
                    for (let y = 0; y < jsonData.value.length; y++) {
                        for (let x = 0; x < jsonData.value[y].length; x++) {
                            color = jsonData.value[y][x];
                            if (color !== null) {
                                ctx.fillStyle = color;
                            } else {
                                ctx.fillStyle = '#ffffff'
                            }
                            ctx.fillRect(x, y, 1, 1);
                        }
                    }
                } else {
                    for (let obj of jsonData.value) {
                            color = obj.color;
                            if (color !== null) {
                                ctx.fillStyle = color;
                            } else {
                                ctx.fillStyle = '#ffffff'
                            }
                            ctx.fillRect(obj.x, obj.y, 1, 1);
                    }
                }

                const buffer = canvas.toBuffer('image/png')
                fs.writeFileSync('./mosaic.png', buffer)

                const message = new MessageEmbed().setDescription(desc).setColor(DEFAULT_COLOR)
                    .setFooter(`https://${canvasUrl}`)
                    .attachFiles('mosaic.png').setImage('attachment://mosaic.png');
                msg.channel.send(message);
            });
        }).on('error', error => {
            console.error(error);
        });
    }
}
