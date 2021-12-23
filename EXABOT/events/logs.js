const Discord = require("discord.js");

/**
 * @param {Discord.Client} client
 */

module.exports = (client, instance) => {
    const db = require('../functions/database');
    const config = require('../data/config');

    /*
        client.on("messageCreate", async(message) => {
            if (!message.guild) return;
            const logsCheck = await db.get('logs_on-off') || {};
            if (!logsCheck[message.guild.id] || logsCheck[message.guild.id] == 'off') return;
            const logsChannel = await db.get('logs_channels') || {};
            if (!logsChannel[message.guild.id]) return;
            const owner = client.users.cache.get(config.owner);
            const logChannel = message.guild.channels.cache.get(logsChannel[message.guild.id]);
            const logEmbed = new Discord.MessageEmbed()
                .setTimestamp()
                .setFooter(`Bot Developer: ${owner.tag}`, owner.avatarURL({ dynamic: true }));
            // return logChannel.send(
{embeds:[logEmbed]}
);
        });
    */

    client.on("channelCreate", async(channel) => {
        if (!channel.guild) return;
        const logsCheck = await db.get('logs_on-off') || {};
        if (!logsCheck[channel.guild.id] || logsCheck[channel.guild.id] == 'off') return;
        const logsChannel = await db.get('logs_channels') || {};
        if (!logsChannel[channel.guild.id]) return;
        const owner = client.users.cache.get(config.owner);
        const logChannel = channel.guild.channels.cache.get(logsChannel[channel.guild.id]);
        const channelDeleted = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('تم إنشاء قناة')
            .setURL(config.support.server.invite.link)
            .setDescription(`${channel}`)
            .setTimestamp()
            .setFooter(`Bot Developer: ${owner.tag}`, owner.avatarURL({ dynamic: true }));
        return logChannel.send({ embeds: [channelDeleted] });
    });

    client.on("channelDelete", async(channel) => {
        if (!channel.guild) return;
        const logsCheck = await db.get('logs_on-off') || {};
        if (!logsCheck[channel.guild.id] || logsCheck[channel.guild.id] == 'off') return;
        const logsChannel = await db.get('logs_channels') || {};
        if (!logsChannel[channel.guild.id]) return;
        const owner = client.users.cache.get(config.owner);
        const logChannel = channel.guild.channels.cache.get(logsChannel[channel.guild.id]);
        const channelDeleted = new Discord.MessageEmbed()
            .setColor('RED')
            .setTitle('تم حذف قناة')
            .setURL(config.support.server.invite.link)
            .setDescription(`${channel.name}`)
            .setTimestamp()
            .setFooter(`Bot Developer: ${owner.tag}`, owner.avatarURL({ dynamic: true }));
        return logChannel.send({ embeds: [channelDeleted] });
    });

    client.on("channelUpdate", async(oldChannel, newChannel) => {
        if (!oldChannel.guild) return;
        const logsCheck = await db.get('logs_on-off') || {};
        if (!logsCheck[oldChannel.guild.id] || logsCheck[oldChannel.guild.id] == 'off') return;
        const logsChannel = await db.get('logs_channels') || {};
        if (!logsChannel[oldChannel.guild.id]) return;
        const owner = client.users.cache.get(config.owner);
        const logChannel = oldChannel.guild.channels.cache.get(logsChannel[oldChannel.guild.id]);
        const channelDeleted = new Discord.MessageEmbed()
            .setTitle('تعديل على قناة')
            .setURL(config.support.server.invite.link)
            .setColor('GREEN')
            .setDescription(`${newChannel}`)
            .addField('⚙️ قبل التعديل:', `**الإسم: \`${oldChannel.name}\`**\n**الوصف: \`${oldChannel.topic}\`**\n**النوع: \`${oldChannel.type}\`**`, true)
            .addField('🚀 بعد التعديل:', `**الإسم: \`${newChannel.name}\`**\n**الوصف: \`${newChannel.topic}\`**\n**النوع: \`${newChannel.type}\`**`, true)
            .setTimestamp()
            .setFooter(`Bot Developer: ${owner.tag}`, owner.avatarURL({ dynamic: true }));
        return logChannel.send({ embeds: [channelDeleted] });
    });

    client.on("emojiCreate", async(emoji) => {
        if (!emoji.guild) return;
        const logsCheck = await db.get('logs_on-off') || {};
        if (!logsCheck[emoji.guild.id] || logsCheck[emoji.guild.id] == 'off') return;
        const logsChannel = await db.get('logs_channels') || {};
        if (!logsChannel[emoji.guild.id]) return;
        const owner = client.users.cache.get(config.owner);
        const logChannel = emoji.guild.channels.cache.get(logsChannel[emoji.guild.id]);
        const logEmbed = new Discord.MessageEmbed()
            .setTitle('تم إضافة إيموجي')
            .setColor('#0099ff')
            .setURL(config.support.server.invite.link)
            .setDescription(`\`${emoji}\``)
            .setImage(emoji.url)
            .setTimestamp()
            .setFooter(`Bot Developer: ${owner.tag}`, owner.avatarURL({ dynamic: true }));
        return logChannel.send({ embeds: [logEmbed] });
    });

    client.on("emojiDelete", async(emoji) => {
        if (!emoji.guild) return;
        const logsCheck = await db.get('logs_on-off') || {};
        if (!logsCheck[emoji.guild.id] || logsCheck[emoji.guild.id] == 'off') return;
        const logsChannel = await db.get('logs_channels') || {};
        if (!logsChannel[emoji.guild.id]) return;
        const owner = client.users.cache.get(config.owner);
        const logChannel = emoji.guild.channels.cache.get(logsChannel[emoji.guild.id]);
        const logEmbed = new Discord.MessageEmbed()
            .setTitle('تم حذف إيموجي')
            .setColor('RED')
            .setURL(config.support.server.invite.link)
            .setDescription(`\`${emoji}\``)
            .setImage(emoji.url)
            .setTimestamp()
            .setFooter(`Bot Developer: ${owner.tag}`, owner.avatarURL({ dynamic: true }));
        return logChannel.send({ embeds: [logEmbed] });
    });

    client.on("emojiUpdate", async(oldEmoji, newEmoji) => {
        if (!oldEmoji.guild) return;
        const logsCheck = await db.get('logs_on-off') || {};
        if (!logsCheck[oldEmoji.guild.id] || logsCheck[oldEmoji.guild.id] == 'off') return;
        const logsChannel = await db.get('logs_channels') || {};
        if (!logsChannel[oldEmoji.guild.id]) return;
        const owner = client.users.cache.get(config.owner);
        const logChannel = oldEmoji.guild.channels.cache.get(logsChannel[oldEmoji.guild.id]);
        const channelDeleted = new Discord.MessageEmbed()
            .setTitle(`تعديل على إيموجي ${newEmoji}`)
            .setURL(config.support.server.invite.link)
            .setColor('GREEN')
            .addField('⚙️ قبل التعديل:', `\`${oldEmoji.name}\``, true)
            .addField('🚀 بعد التعديل:', `\`${newEmoji.name}\``, true)
            .setTimestamp()
            .setFooter(`Bot Developer: ${owner.tag}`, owner.avatarURL({ dynamic: true }));
        return logChannel.send({ embeds: [channelDeleted] });
    });

    client.on("guildBanAdd", async(guild, user) => {
        const logsCheck = await db.get('logs_on-off') || {};
        if (!logsCheck[guild.id] || logsCheck[guild.id] == 'off') return;
        const logsChannel = await db.get('logs_channels') || {};
        if (!logsChannel[guild.id]) return;
        const owner = client.users.cache.get(config.owner);
        const logChannel = guild.channels.cache.get(logsChannel[guild.id]);
        const logEmbed = new Discord.MessageEmbed()
            .setTimestamp()
            .setColor('RED')
            .setTitle('تم حظر عضو')
            .setURL(config.support.server.invite.link)
            .setAuthor(user.username, user.avatarURL({ dynamic: true }))
            .setDescription(`${user}`)
            .setFooter(`Bot Developer: ${owner.tag}`, owner.avatarURL({ dynamic: true }));
        return logChannel.send({ embeds: [logEmbed] });
    });

    client.on("guildBanRemove", async(guild, user) => {
        const logsCheck = await db.get('logs_on-off') || {};
        if (!logsCheck[guild.id] || logsCheck[guild.id] == 'off') return;
        const logsChannel = await db.get('logs_channels') || {};
        if (!logsChannel[guild.id]) return;
        const owner = client.users.cache.get(config.owner);
        const logChannel = guild.channels.cache.get(logsChannel[guild.id]);
        const logEmbed = new Discord.MessageEmbed()
            .setTimestamp()
            .setColor('BLUE')
            .setTitle('تم فك حظر عضو')
            .setURL(config.support.server.invite.link)
            .setAuthor(user.username, user.avatarURL({ dynamic: true }))
            .setDescription(`${user}`)
            .setFooter(`Bot Developer: ${owner.tag}`, owner.avatarURL({ dynamic: true }));
        return logChannel.send({ embeds: [logEmbed] });
    });

    client.on("messageDelete", async(message) => {
        if (!message.guild) return;
        const logsCheck = await db.get('logs_on-off') || {};
        if (!logsCheck[message.guild.id] || logsCheck[message.guild.id] == 'off') return;
        const logsChannel = await db.get('logs_channels') || {};
        if (!logsChannel[message.guild.id]) return;
        if (!message.author) return;
        if (message.author.id == client.user.id && message.channel.id == logsChannel[message.guild.id]) return;
        if (message.channel.id == message.guild.systemChannel.id) return;
        const owner = client.users.cache.get(config.owner);
        const logChannel = message.guild.channels.cache.get(logsChannel[message.guild.id]);
        const messageDeleted = new Discord.MessageEmbed()
            .setColor('RED')
            .setTitle('تم حذف رسالة')
            .setURL(config.support.server.invite.link)
            .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
            .setDescription(`\`${message.content}\``)
            .setTimestamp()
            .setFooter(`Bot Developer: ${owner.tag}`, owner.avatarURL({ dynamic: true }));
        return logChannel.send({ embeds: [messageDeleted] });
    });
}

module.exports.config = {
    displayName: 'LogsEvents',
    dbName: 'LOGS EVENTS' // This should NEVER be changed once set, and users cannot see it.
}