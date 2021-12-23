async function welcome(client, guildID, tag, name, avatar) {
    const { MessageEmbed } = require('discord.js');
    const db = require('./database');
    const onOffData = await db.get("welcome_on-off") || {};
    const onOff = onOffData[guildID];
    if (onOff === 'on') {
        const messagesData = await db.get("welcome_message");
        const message = messagesData[guildID];
        if (message) {
            const guild = client.guilds.cache.get(guildID);
            const channelsID = await db.get("welcome_channels");
            const channelID = channelsID[guildID];
            const channel = guild.channels.cache.get(channelID);
            if (channel) {
                const welcomeMessage = message.replace('{{name}}', name).replace('{{memberCount}}', guild.memberCount).replace('{{tag}}', tag);
                const username = name;
                const avatarURL = avatar || client.user.avatarURL({ dynamic: true, size: 128, format: "png" });
                let url = `https://exa-bot-api.exacom.repl.co/welcome/1?tag=${tag}&name=${username}&memberCount=${guild.memberCount}&avatar=${avatarURL}`;
                // const Canvas = require('canvas');
                // if (Canvas) {
                //     await Canvas.registerFont('fonts/dg-bebo-b.ttf', { family: 'DG-Bebo-B' });

                //     const canvas = Canvas.createCanvas(700, 250);
                //     const ctx = canvas.getContext('2d');

                //     const background = await Canvas.loadImage(background || 'https://cdn.discordapp.com/attachments/851746618138951691/894676615894802473/20191115_213644.png');
                //     let x = 0;
                //     let y = 0;
                //     ctx.drawImage(background, x, y);

                //     const pfp = await Canvas.loadImage(avatarURL || 'https://cdn.discordapp.com/avatars/709512157821403186/8e620e4b55eb080a7ae265f52de88097.png');
                //     x = canvas.width / 2 - pfp.width / 2;
                //     y = 25;
                //     ctx.drawImage(pfp, x, y);

                //     ctx.fillStyle = '#ffffff';
                //     ctx.font = '35px DG-Bebo-B';
                //     let text = `مرحبا ${username}#${tag}`;
                //     x = canvas.width / 2 - ctx.measureText(text).width / 2;
                //     ctx.fillText(text, x, 60 + pfp.height);

                //     ctx.font = '30px DG-Bebo-B';
                //     text = `العضو رقم #${guild.memberCount}`;
                //     x = canvas.width / 2 - ctx.measureText(text).width / 2;
                //     ctx.fillText(text, x, 100 + pfp.height);

                //     url = canvas.toBuffer();
                // }
                const welcomeEmbed = new MessageEmbed()
                    .setImage(url)
                    .setColor(require('../data/config').bot.color.hex)
                    .setTitle(welcomeMessage);
                channel.send({ embeds: [welcomeEmbed] });
            } else return;
        } else return;
    } else return;
};

module.exports = welcome;