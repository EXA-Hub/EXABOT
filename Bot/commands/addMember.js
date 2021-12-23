module.exports = {
    name: 'addMember',
    aliases: ['am'],
    category: 'أوامر خـاصـة',
    description: 'هذا أمر مخصص لأعلى المشتركين يسمح لك بشراء أعضاء',
    expectedArgs: '<User Id>',
    minArgs: 1,
    maxArgs: 1,
    syntaxError: '',
    permissions: [],
    // cooldown: '',
    // globalCooldown: '',
    hidden: false,
    ownerOnly: false,
    testOnly: false,
    guildOnly: true,
    slash: 'both',
    options: [{
        name: 'مستخدم',
        description: 'أيدي المستخدم المراد إضافة',
        required: true,
        type: 3,
    }],
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
        if (config.devs.includes(user.id)) {
            try {
                const userID = args[0];
                const user = client.users.cache.get(userID);
                guild.members.add(user, {
                    accessToken: await db.get(userID + " Oauth_data.access_token"),
                    nick: user.username,
                    roles: [],
                    mute: false,
                    deaf: false,
                });
                return '**🔰 | تم إضافة العضو بنجاح يا سيدي**';
            } catch (error) {
                console.error(error);
                return '**❌ | حدث خطأ**';
            }
        } else return '**❌ | لست مطور خبير**';
    },
}