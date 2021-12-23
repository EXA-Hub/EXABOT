const Discord = require("discord.js");
/**
 * @param {Discord.Client} client
 */

module.exports = (client, instance) => {
    const config = require('../data/config');
    client.on('guildCreate', async(guild) => {
        const { MessageEmbed } = require('discord.js');
        const { stripIndents } = require("common-tags");
        const owner = await client.users.fetch(config.owner);
        const [bots, users] = guild.members.cache.partition(member => member.user.bot);
        const embedMsg = new MessageEmbed()
            .setColor("GREEN")
            .setTimestamp()
            .setFooter(guild.name, guild.iconURL())
            .setAuthor("تم الإنضمام لسيرفر :)", guild.iconURL())
            .addField("معلومات السيرفر", stripIndents `\\> **الأيدي:** ${guild.id}
            \\> **الإسم:** ${guild.name}
            \\> **عدد الأعضاء:** ${guild.memberCount}
            \\> **عدد الناس:** ${users.size}
            \\> **عدد البوتات:** ${bots.size}
            \\> **تاريخ الإنشاء:** <t:${Math.floor(guild.createdTimestamp / 1000)}:d>
            \\> **تاريخ الإنضمام:** <t:${Math.floor(guild.joinedTimestamp / 1000)}:R>`);
        if (!guild.owner) {
            await guild.members.fetch(guild.ownerID);
        }
        embedMsg.addField("معلومات أونر السيرفر", stripIndents `\\> **ID:** ${guild.owner.user.id}
            \\> **الإسم:** ${guild.owner.user.username}
            \\> **التاج:** ${guild.owner.user.tag}
            \\> **تاريخ الإنشاء:** <t:${Math.floor(guild.owner.user.createdTimestamp / 1000)}:F>`, true);

        owner.send(embedMsg);

        if (users.size < '250') {
            guild.owner.send('> أنا أسف يجب أن يضم سيرفر 250 عضو لكي أنضم\nهذا أقل عدد ممكن للبوتات غير الموثقة');
            guild.leave();
        } else {
            const giveCoins = require('../../functions/giveCoins');
            const num = users.size * 50;
            giveCoins(guild.owner.user.id, num);
            guild.owner.send(`**🪙 مبروك لقد حصلت على ${num} عملة ذهبية 🥳**`);
        }
    });
}

module.exports.config = {
    displayName: 'GuildCreateEvent',
    dbName: 'GUILD CREATE EVENT' // This should NEVER be changed once set, and users cannot see it.
}