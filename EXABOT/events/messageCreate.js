const Discord = require("discord.js");
/**
 * @param {Discord.Client} client
 */
module.exports = (client, instance) => {
    const unmute = require('../functions/unmute');
    const mute = require('../functions/mute');
    const config = require('../data/config');
    const db = require('../functions/database');
    client.on("messageCreate", async(message) => {
        if (message.author.bot || message.webhookID || !message.guild) return;
        const letters = message.content.trim().split('');
        const giveCoins = require('../functions/giveCoins');
        giveCoins(message.author.id, letters.length);
        if (message.mentions.has(client.user.id) &&
            (!message.content.includes("@here") ||
                !message.content.includes("@everyone")) &&
            message.mentions.users.first() === client.user) {
            const prefix = instance.getPrefix(message.guild) || config.prefix;
            message.channel.send({
                embeds: [new Discord.MessageEmbed()
                    .setColor(config.bot.color.hex)
                    .setTitle(`للحصول على المعلومات إكتب \`${prefix}help\``)
                ]
            });
        }
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            if ((message.content.includes("discord.gg/") ||
                    message.content.includes("discord.com/invite/")) &&
                !message.member.permissions.has('EMBED_LINKS')) {
                const working = await db.get('antiad-on-off') || {};
                const anticheck = working[message.guild.id];
                if (anticheck && anticheck === "on" && !anticheck === "off") {
                    const warndeletemsg = () => {
                        message.delete();
                        mute(message, message.member);
                        message.channel.send({ content: "**ممنوع نشر الدعوات**" });
                    }
                    const allowed = await db.get('antiad_protection/allowed') || {};
                    const allowedrolesinguild = allowed[message.guild.id];
                    if (!allowedrolesinguild || allowedrolesinguild.length === 0) {
                        warndeletemsg();
                    } else if (allowedrolesinguild) {
                        const allowedMemberPremsRoles = await allowedrolesinguild.filter(ID => message.member.roles.cache.has(ID));
                        if (allowedMemberPremsRoles && allowedMemberPremsRoles.length > 0) warndeletemsg();
                    }
                }
            } else if (!message.member.permissions.has('EMBED_LINKS')) {
                function is_url(str) {
                    let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
                    if (regexp.test(str)) {
                        return true;
                    } else {
                        return false;
                    }
                }
                if (is_url(message.content)) {
                    const working = await db.get('antilink-on-off') || {};
                    const anticheck = working[message.guild.id];
                    if (anticheck && anticheck === "on" && !anticheck === "off") {
                        const warndeletemsg = () => {
                            message.delete();
                            mute(message, message.member);
                            channel.send("**ممنوع نشر الروابط**");
                        }
                        const allowed = await db.get('antilink_protection/allowed') || {};
                        const allowedrolesinguild = allowed[message.guild.id];
                        if (!allowedrolesinguild) {
                            warndeletemsg();
                        } else if (allowedrolesinguild) {
                            if (allowedrolesinguild.length === 0) warndeletemsg();
                            const allowedMemberPremsRoles = await allowedrolesinguild.filter(ID => message.member.roles.cache.has(ID));
                            if (allowedMemberPremsRoles && allowedMemberPremsRoles.length > 0) warndeletemsg();
                        }
                    }
                }
            }
            const antispamCheacker = await db.get('antispam-on-off') || {};
            if (antispamCheacker[message.guild.id] &&
                antispamCheacker[message.guild.id] == 'on' &&
                !antispamCheacker[message.guild.id] == 'off') {
                const filter = m => (m.author.id != client.user.id && m.author == message.author);
                const spamerKiller = async(collected) => {
                    if (collected) {
                        message.channel.messages.fetch({
                            limit: 20
                        }).then((messages) => {
                            let spamerMessages = [];
                            messages.filter(m => m.author.id === message.author.id).forEach(msg => spamerMessages.push(msg));
                            message.channel.bulkDelete(spamerMessages);
                        });
                    } else collected.forEach(m => m.delete());
                    const muteRole = await db.get('mute_roles')[message.guild.id];
                    if (!message.member.roles.cache.has(muteRole)) {
                        message.channel.send({ content: 'إزعاج' });
                        mute(message, message.member);
                    }
                }
                const allowed = await db.get('antispam_protection/allowed') || {};
                const allowedrolesinguild = allowed[message.guild.id];
                const spamcollector = message.channel.createMessageCollector(filter, { max: 3, time: 5 * 1000 });
                spamcollector.on('end', async(collected) => {
                    if (collected.size == spamcollector.options.max) {
                        if (!allowedrolesinguild) {
                            await spamerKiller(collected);
                        } else if (allowedrolesinguild) {
                            if (allowedrolesinguild.length === 0) await spamerKiller(collected);
                            const allowedMemberPremsRoles = await allowedrolesinguild.filter(ID => message.member.roles.cache.has(ID));
                            if (allowedMemberPremsRoles && allowedMemberPremsRoles.length > 0) await spamerKiller();
                        }
                    }
                });
            }
        }
    });
}

module.exports.config = {
    displayName: 'MessageCreateEvent',
    dbName: 'MESSAGE CREATE EVENT' // This should NEVER be changed once set, and users cannot see it.
}