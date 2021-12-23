const Discord = require("discord.js");
/**
 * @param {Discord.Client} client
 */
module.exports = (client, instance) => {
    client.on("guildMemberAdd", async(member) => {
        try {
            const welcome = require('../functions/welcome');
            const avatar = member.user.avatarURL({ dynamic: true, size: 128, format: "png" }) ||
                client.user.avatarURL({ dynamic: true, size: 128, format: "png" });
            welcome(client, member.guild.id, member.user.discriminator, member.user.username, avatar);
            const db = require('../functions/database');
            const config = require('../data/config');
            const giveCoins = require('../functions/giveCoins');
            const saveMutedDataFile = await db.get('muted') || {};
            const mute = require('../functions/mute');
            if (saveMutedDataFile &&
                !(!Array.isArray(saveMutedDataFile[member.guild.id]) ||
                    saveMutedDataFile[member.guild.id].length > 0) &&
                saveMutedDataFile[member.guild.id].includes(member.id)) mute(null, member, member.guild);
            else if (member.guild.id === config.support.server.id) {
                const welcomeCoins = 10 * 1000;
                giveCoins(member.id, welcomeCoins);
                const welcomeChannelsID = await db.get("welcome_channels");
                const welcomeChannelID = welcomeChannelsID[guildID];
                const welcomeChannel = member.guild.channels.cache.get(welcomeChannelID);
                welcomeChannel.send({ content: `> **<@!${member.id}> مبروك لقد ربحت \`${welcomeCoins}\` عملة**` });
            }
        } catch (error) {
            console.error(error);
        }
    });
}

module.exports.config = {
    displayName: 'GuildMemberAddEvent',
    dbName: 'GUILD MEMBER ADD EVENT' // This should NEVER be changed once set, and users cannot see it.
}