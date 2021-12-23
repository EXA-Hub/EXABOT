module.exports = {
    name: 'welcomer',
    aliases: ['welcome'],
    category: 'الإداريـة',
    description: 'التحكم في إعدادات الترحيب',
    expectedArgs: '<on/off/info/test/message/channel> [channel]',
    // minArgs: 0,
    // maxArgs: 0,
    syntaxError: '',
    permissions: ["ADMINISTRATOR"],
    cooldown: '5s',
    // globalCooldown: '',
    hidden: false,
    ownerOnly: false,
    testOnly: false,
    guildOnly: true,
    slash: 'both',
    options: [{
        name: 'العملية',
        description: 'يرجى تحديد نوع العملية',
        required: true,
        type: 3,
        choices: [{
            name: 'رؤية_معلومات_الترحيب',
            value: 'info',
        }, {
            name: 'محاكاة_وتجربة_الترحيب',
            value: 'test',
        }, {
            name: 'تحديد_رسالة_الترحيب',
            value: 'message',
        }, {
            name: 'تشغيل_الترحيب',
            value: 'on',
        }, {
            name: 'إيقاف_الترحيب',
            value: 'off',
        }, {
            name: 'تحديد_قناة_الترحيب',
            value: 'channel',
        }, ],
    }, {
        name: 'الغرفة',
        description: 'يرجى تحديد غرفة الترحيب',
        required: false,
        type: 7,
    }, {
        name: 'الرسالة',
        description: 'رسالة الترحيب الخاصة بك',
        required: false,
        type: 3,
    }, ],
    init: (client, instance) => {},
    callback: async({
        guild,
        member,
        user,
        message,
        channel,
        args,
        text,
        client,
        prefix,
        instance,
        interaction,
    }) => {
        const db = require('../functions/database');
        const config = require('../data/config');
        const { MessageEmbed } = require("discord.js");
        const wrongembed = new MessageEmbed()
            .setColor('RED')
            .setURL(config.support.server.invite.link)
            .addField(`\`${message ? prefix : '/'}welcomer info\``, 'رؤية معلومات الترحيب', false)
            .addField(`\`${message ? prefix : '/'}welcomer test\``, 'محاكاة وتجربة الترحيب', false)
            .addField(`\`${message ? prefix : '/'}welcomer message\``, 'تحديد رسالة الترحيب', false)
            .addField(`\`${message ? prefix : '/'}welcomer <on/off>\``, 'تشغيل وإيقاف الترحيب', false)
            .addField(`\`${message ? prefix : '/'}welcomer channel <channel>\``, 'تحديد قناة الترحيب', false)
            .setTitle(`إستخدام خطأ للأمر: ${message ? prefix : '/'}welcomer`);
        if (!args[0]) return { custom: true, embeds: [wrongembed] };
        if (!member.permissions.has("ADMINISTRATOR")) return "❌ | لا تمتلك صلاحية `ADMINISTRATOR`";
        if (args[0]) {
            const saveData = async(saved, path) => {
                var datafile = await db.get(path) || {};
                datafile[guild.id] = saved;
                db.set(path, datafile);
                return Promise.resolve();
            }
            const onoffpath = "welcome_on-off";
            if (args[0] === 'on') {
                saveData(args[0], onoffpath);
                return `**✅ | تم تفعيل الترحيب**`;
            } else if (args[0] === 'off') {
                saveData(args[0], onoffpath);
                return `**❎ | تم إلغاء تفعيل الترحيب**`;
            } else if (args[0] === "channel") {
                const selectedChannel = message ?
                    (guild.channels.cache.get(args[1]) ||
                        message.mentions.channels.first() || selectedChannel) :
                    interaction.options.getChannel('الغرفة');
                if (!selectedChannel) return '💢 | لا يمكن تحديد القناة';
                if (!guild.channels.cache.get(selectedChannel.id))
                    return '❌ | لا يمكن إستخدام قنوات من مجتمعات أخرى';
                const welcomeChannelsData = await db.get('welcome_channels') || {};
                const willSave = selectedChannel.id;
                const saveChannel = (saveThat) => {
                    const welcomeChannelPath = "welcome_channels";
                    selectedChannel.send(`> **قناة الترحيب => ${selectedChannel}**`);
                    saveData(saveThat, welcomeChannelPath);
                }
                if (welcomeChannelsData[guild.id]) {
                    if (welcomeChannelsData[guild.id] === willSave) {
                        const deleteData = async() => {
                            var datafile = await db.get('welcome_channels') || {};
                            if (!datafile[guild.id]) return '🙄 | لا توجد قناة لحذفها';
                            delete datafile[guild.id];
                            db.set('welcome_channels', datafile);
                            return Promise.resolve();
                        }
                        deleteData();
                        return `تم حذف قناة الترحيب ${selectedChannel}`;
                    } else {
                        saveChannel(willSave);
                        return `**✅ | تم تحديد قناة الترحيب**`;
                    }
                } else if (!welcomeChannelsData[guild.id]) {
                    saveChannel(willSave);
                    return `**✅ | تم تحديد قناة الترحيب**`;
                } else return '× حدث خطأ أثناء تدوين المعلومات ×\nيرجى التواصل مع الإدارة\n' + config.support.server.invite.link;
            } else if (args[0] === "info") {
                const logChannel = await db.get('welcome_channels') || {};
                const working = await db.get('welcome_on-off') || {};
                let channels = "لا توجد قناة لترحيب المعلومات";
                if (logChannel[guild.id]) channels = guild.channels.cache.get(logChannel[guild.id]);
                const welcome_message = await db.get('welcome_message') || {};
                const infoembed = new MessageEmbed()
                    .setURL(config.support.server.invite.link)
                    .addField(`الترحيب:`, `${working[guild.id]}`, true)
                    .addField(`قناة ترحيب المعلومات:`, `${channels}`, true)
                    .setColor(config.bot.color.hex)
                    .setDescription(`**رسالة الترحيب:**\n\`\`\`${welcome_message[guild.id]}\`\`\``)
                    .setTitle(`معلومات الترحيب في السيرفر`);
                return { custom: true, embeds: [infoembed] };
            } else if (args[0] === "message") {
                if (interaction) interaction.reply({ content: "**✅ | سيتم تحديد رسالة الترحيب**" });
                const setMessageEmbed = new MessageEmbed()
                    .setColor(config.bot.color.hex)
                    .setDescription(`**\`{{name}}\` => *إسم العضو***\n**\`{{memberCount}}\` => *عدد الأعضاء***\n**\`{{tag}}\` => *رقم العضو***`)
                    .setTitle('قم بإرسال الرسالة الخاصة بك وإستخدم التفاصيل التالية');
                channel.send({ embeds: [setMessageEmbed] }).then((msg1) => {
                    const filter = msg => msg.author == user;
                    channel.awaitMessages({ filter, max: 1, time: 60 * 1000, errors: ['الزمن'] }).then(async(m1) => {
                        msg1.delete();
                        m1 = m1.first();
                        const arg = m1.content;
                        const datafile = await db.get('welcome_message') || {};
                        datafile[guild.id] = arg;
                        db.set('welcome_message', datafile);
                        channel.send({ content: "**✅ | تم تحديد رسالة الترحيب**" });
                    });
                });
            } else if (args[0] === "test") {
                try {
                    const welcome = require('../functions/welcome');
                    await welcome(client, guild.id, user.discriminator, user.username, user.avatarURL({ dynamic: true, size: 128, format: "png" }));
                } catch (e) {
                    console.log(e);
                    return `**× حدث خطأ ما ×**\n\`\`\`${e}\`\`\``;
                } finally {
                    return '**✅ | تم محاكاة الترحيب**';
                }
            } else return { custom: true, embeds: [wrongembed] };
        }
    },
}