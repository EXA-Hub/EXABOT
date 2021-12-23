module.exports = {
    name: 'shop',
    aliases: ['s'],
    category: 'أوامـر عـامـة',
    description: 'متجر البوت المعتمد',
    // expectedArgs: '',
    // minArgs: 0,
    // maxArgs: 0,
    syntaxError: '',
    permissions: [],
    cooldown: '5s',
    // globalCooldown: '',
    hidden: false,
    ownerOnly: false,
    testOnly: false,
    guildOnly: true,
    slash: 'both',
    options: [{
        name: 'شخص',
        description: 'لرؤية البضاعة الخاصة بشخص ما',
        required: false,
        type: 6,
    }, {
        name: 'متجر_مين',
        description: 'تحديد صاحب المتجر',
        required: false,
        type: 3,
        choices: [{
            name: 'متجرك_أنت',
            value: 'me',
        }, {
            name: 'متجر_السيرفر',
            value: 'server',
        }, ],
    }, {
        name: 'إضافة_وإزالة_البضائع',
        description: 'العمليات_على_البضائع',
        required: false,
        type: 3,
        choices: [{
            name: 'إضافة_بضاعة_جديدة',
            value: 'add',
        }, {
            name: 'إزالة_بضاعة_قديمة',
            value: 'remove',
        }, ],
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
        const config = require('../data/config.js');
        const db = require('../functions/database');
        let botSellerShop = await db.get('shop/bot') || {};
        const { MessageEmbed } = require("discord.js");
        const wrongembed = new MessageEmbed()
            .setColor('RED')
            .setURL(config.support.server.invite.link)
            .addField(`\`${message ? prefix : '/'}shop\``, 'لرؤية البضاعة الرسمية', false)
            .addField(`\`${message ? prefix : '/'}shop me\``, 'لرؤية البضاعة الخاصة بك', false)
            .addField(`\`${message ? prefix : '/'}shop me add\``, 'لإضافة بضاعة جديدة', false)
            .addField(`\`${message ? prefix : '/'}shop me remove\``, 'لحذف بضاعة حالية', false)
            .addField(`\`${message ? prefix : '/'}shop server\``, 'لرؤية البضاعة الخاصة بالسيرفر', false)
            .addField(`\`${message ? prefix : '/'}shop server add\``, 'لإضافة بضاعة جديدة للسيرفر', false)
            .addField(`\`${message ? prefix : '/'}shop server remove\``, 'لحذف بضاعة حالية في السيرفر', false)
            .addField(`\`${message ? prefix : '/'}shop <user>\``, 'لرؤية البضاعة الخاصة بشخص ما', false)
            .setTitle(`إستخدام خطأ للأمر: ${message ? prefix : '/'}shop`);
        const shopItemsEmbed = new MessageEmbed()
            .setTimestamp()
            .setColor(config.bot.color.hex)
            .setFooter(`requested by: ${user.tag}`)
            .setTitle('البضاعة المتاحة:')
            .setDescription(`لا يمكن إسترداد البضاعة بعد الشراء\nقم بالتبليغ إذا تمت عملية نصب أو إحتيال\nإذا كانت البضاعة ممنوعة أو مخالفة قم بالتبليغ فورا\nأمر التبليغ: \`${message ? prefix : '/'}report\` [سيرفر التبليغ](${config.support.server.invite.link} 'قم بالضغط لدخول سيرفر التبليغ')`)
            .setURL(config.support.server.invite.link);
        if (args[0]) {
            const targetUserSeller = message ? (client.users.cache.get(args[0]) ||
                client.users.cache.find(user => user.tag.toString() === args.join(' ')) ||
                message.mentions.users.first()) : interaction.options.getUser('شخص');
            if (targetUserSeller) {
                const targetUserSellerShop = await db.get(`shop/${targetUserSeller.id}`) || {};
                if (targetUserSellerShop && Array.isArray(targetUserSellerShop.items) && targetUserSellerShop.items.size > 0) {
                    targetUserSellerShop.items.forEach(item => {
                        shopItemsEmbed.addField(item.name, item.description + `\nالسعر: \`${item.price}\`🪙`, true);
                    });
                } else shopItemsEmbed.addField('البضاعة:', 'لا توجد بضاعة', true);
                return { custom: true, embeds: [shopItemsEmbed] };
            } else if (args[0] === 'me') {
                if (args[1] === 'add') {
                    return '**📝 | قريبا جدا بإذن الله**';
                } else if (args[1] === ('remove' || 'delete')) {
                    return '**📝 | قريبا جدا بإذن الله**';
                } else if (!args[1]) {
                    let targetUserSellerShop = await db.get(`shop/${user.id}`) || {};
                    if (targetUserSellerShop && Array.isArray(targetUserSellerShop.items) && targetUserSellerShop.items.size > 0) {
                        targetUserSellerShop.items.forEach(item => {
                            shopItemsEmbed.addField(item.name, item.description + `\nالسعر: \`${item.price}\`🪙`, true);
                        });
                    } else shopItemsEmbed.addField('البضاعة:', 'لا توجد بضاعة', true);
                    shopItemsEmbed.setThumbnail(user.avatarURL({ dynamic: true, size: 1024 }));
                    return { custom: true, embeds: [shopItemsEmbed] };
                } else return { custom: true, embeds: [wrongembed] };
            } else if (args[0] === 'server') {
                if (args[1] === 'add') {
                    return '**📝 | قريبا جدا بإذن الله**';
                } else if (args[1] === ('remove' || 'delete')) {
                    return '**📝 | قريبا جدا بإذن الله**';
                } else if (!args[1]) {
                    let targetUserSellerShop = await db.get(`shop/${guild.id}`) || {};
                    if (targetUserSellerShop && Array.isArray(targetUserSellerShop.items) && targetUserSellerShop.items.size > 0) {
                        targetUserSellerShop.items.forEach(item => {
                            shopItemsEmbed.addField(item.name, item.description + `\nالسعر: \`${item.price}\`🪙`, true);
                        });
                    } else shopItemsEmbed.addField('البضاعة:', 'لا توجد بضاعة', true);
                    shopItemsEmbed.setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }));
                    return { custom: true, embeds: [shopItemsEmbed] };
                } else return { custom: true, embeds: [wrongembed] };
            } else if (args[0] === 'bot') {
                if (!config.devs.includes(user.id)) {
                    return '**❌ | الأمر لمطويرن البوت فقط**';
                } else if (args[1] === 'add') {
                    channel.send({ content: '**الرجاء إرسال أسم البضاعة**' }).then(setNameMessage => {
                        channel.awaitMessages(msg => msg.author == user, { max: 1, time: 60 * 1000 }).then(setNameMsg => {
                            setNameMessage.delete();
                            setNameMsg = setNameMsg.first();
                            const goodName = setNameMsg.content;
                            if (goodName) {
                                setNameMsg.delete();
                                channel.send({ content: '**الرجاء تحديد وصف للبضاعة**' }).then(setDescriptionMeessage => {
                                    channel.awaitMessages(msg => msg.author == user, { max: 1, time: 60 * 1000 }).then(setDescriptionMsg => {
                                        setDescriptionMeessage.delete();
                                        setDescriptionMsg = setDescriptionMsg.first();
                                        const description = setDescriptionMsg.content;
                                        if (description) {
                                            channel.send({ content: '**الرجاء إرسال السعر**' }).then(setPriceMessage => {
                                                channel.awaitMessages(msg => msg.author == user, { max: 1, time: 60 * 1000 }).then(setPriceMsg => {
                                                    setPriceMessage.delete();
                                                    setPriceMsg = setPriceMsg.first();
                                                    const price = Number.parseInt(setPriceMsg.content);
                                                    if (price && !Number.isNaN(price)) {
                                                        const newGood = { goodName: goodName, description: description, price: price };
                                                        botSellerShop.items = botSellerShop.items ? botSellerShop.items = [...botSellerShop.items, newGood] : [newGood, ];
                                                        db.set('shop/bot', botSellerShop);
                                                        const newGoodEmbed = new MessageEmbed()
                                                            .setTitle(goodName)
                                                            .setColor(config.bot.color.hex)
                                                            .setDescription(description + `\nالسعر: \`${price}\`🪙`)
                                                            .setThumbnail(client.user.avatarURL({ dynamic: true, size: 1024 }));
                                                        return { custom: true, embeds: [newGoodEmbed] };
                                                    } else return '**❌ | الرجاء إرسال سعر صحيح**';
                                                });
                                            });
                                        } else return '**❌ | الرجاء إرسال وصف صحيح**';
                                    });
                                });
                            } else return '**❌ | الرجاء إرسال إسم صحيح**';
                        });
                    });
                } else if (args[1] === ('remove' || 'delete')) {
                    return '**📝 | قريبا جدا بإذن الله**';
                } else return { custom: true, embeds: [wrongembed] };
            } else return { custom: true, embeds: [wrongembed] };
        } else {
            const shopEmbed = new MessageEmbed()
                .setColor(config.bot.color.hex)
                .setTimestamp()
                .setTitle('🏧 متجر البوت المعتمد للعملة الرسمية :coin:')
                .setDescription('**البضاعة المتاحة حاليا لا يمكن إستردادها\nEXA-Studio™: https://discord.gg/aEkKZQfZuk\nEXA-4-EVER: https://discord.gg/ZPpwb3GRyG\nEXA-TUBE™: https://discord.gg/e4ewVXcKCs\nEXA-Support: https://discord.gg/n9AQZ6qjNc**')
                .setThumbnail(client.user.avatarURL({ dynamic: true, size: 1024 }))
                .setFooter(`THX to: ${client.users.cache.get(config.owner).tag}`);
            if (botSellerShop && Array.isArray(botSellerShop.items) && botSellerShop.items.length > 0) {
                botSellerShop.items.forEach(item => {
                    shopEmbed.addField(item.goodName, item.description + `\nالسعر: \`${item.price}\`🪙`, true);
                });
            } else shopEmbed.addField('البضاعة:', 'لا توجد بضاعة', true);
            return { custom: true, embeds: [shopEmbed] };
        }
    },
}