const Discord = require("discord.js");

/**
 * 
 * @param {string} mutedID 
 * @param {string} guildID 
 */

const saveMutedData = async(unmutedID, guildID) => {
    const db = require('./database');
    const mutedData = await db.get('muted') || {};
    if (!mutedData[guildID]) mutedData[guildID] = [];
    if (!Array.isArray(mutedData[guildID])) mutedData[guildID] = [];
    mutedData[guildID] = mutedData[guildID].filter(x => x !== unmutedID);
    db.set("muted", mutedData);
}

/**
 * 
 * @param {Discord.Message} message 
 * @param {Discord.User} user 
 * @param {Discord.Guild} guild 
 * @returns 
 */

async function unmute(message, user, guild) {
    const config = require('../data/config');
    const db = require('./database');
    if (!guild) guild = message.guild;
    const muterole = await db.get('mute_roles') || {};
    if (!muterole[guild.id] || !guild.roles.cache.has(muterole[guild.id])) {
        if (message) return message.channel.send("لا توجد رتبة حظر" + "\n" + "لتحديد رتبة الحظر:" + "\n" + `\`${config.prefix}mute <role>\``);
        else return;
    } else if (!user.roles) {
        saveMutedData(user.id, guild.id);
        if (message) return message.channel.send("لا يمكنني العثور على المستخدم المراد فك حظره كتابيا");
        else return;
    } else {
        saveMutedData(user.id, guild.id);
        user.roles.remove(muterole[guild.id]);
        if (message) return message.channel.send(`تم فك حظر ${user} كتابيا`);
        else return;
    }
};

module.exports = unmute;