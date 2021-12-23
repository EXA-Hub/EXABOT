module.exports = {
    name: 'partner',
    aliases: [],
    category: 'أوامـر عـامـة',
    description: 'طلب شراكة في السيرفر',
    // expectedArgs: '',
    // minArgs: 0,
    // maxArgs: 0,
    syntaxError: '',
    permissions: [],
    cooldown: '31s',
    // globalCooldown: '',
    hidden: false,
    ownerOnly: false,
    testOnly: false,
    guildOnly: true,
    slash: 'both',
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
        message ? message.reply({ content: '**👍 | يتم البدأ**' }) :
            interaction.reply({ content: '**👍 | يتم البدأ**' });
        const Discord = require("discord.js");
        const config = require('../data/config');
        const discordInv = require("discord-inv");
        const db = require('../functions/database');
        const { MessageEmbed, MessageButton, MessageActionRow } = Discord;
        let otherguildexist = true;
        const sharemessage = await db.get('partner_message') || {};
        const rolesdata = await db.get('partner_roles') || {};
        const rdata = await db.get('partner_requests') || {};
        const cdata = await db.get('partner_channels') || {};
        let sharemessagedoneing;
        if (!rdata[guild.id]) {
            channel.send({
                content: `يرجى تحديد روم إستقبال الطلبات في هذا السيرفر` + '\n' + `الطريقة: **${message ? prefix : '/'}set-partner-channels <ايدي الروم> request**`,
                allowedMentions: { repliedUser: false },
            });
            return;
        }
        if (!cdata[guild.id]) {
            channel.send({
                content: `يرجى تحديد روم النشر في هذا السيرفر` + '\n' + `الطريقة: **${message ? prefix : '/'}set-partner-channels <ايدي الروم> channel**`,
                allowedMentions: { repliedUser: false },
            });
            return;
        }
        if (!sharemessage[guild.id]) {
            channel.send({
                content: `يرجى تحديد رسالة النشر في هذا السيرفر` + '\n' + `الطريقة: **${message ? prefix : '/'}set-partner-message <رسالة النشر>**`,
                allowedMentions: { repliedUser: false },
            });
            return;
        }
        if (!rolesdata[guild.id]) {
            channel.send({
                content: `يرجى تحديد رتبة الشراكة في هذا السيرفر` + '\n' + `الطريقة: **${message ? prefix : '/'}set-partner-role <ايدي الرتبة>**`,
                allowedMentions: { repliedUser: false },
            });
            return;
        }
        let sendbtn = new MessageButton()
            .setStyle('SUCCESS')
            .setLabel('إضغط هنا للقبول')
            .setCustomId(`accept${user.id + channel.id}`);
        let herebtn = new MessageButton()
            .setStyle('SUCCESS')
            .setLabel('@everyone')
            .setCustomId(`accept${user.id + channel.id}everyone`);
        let everyonebtn = new MessageButton()
            .setStyle('SUCCESS')
            .setLabel('@here')
            .setCustomId(`accept${user.id + channel.id}here`);
        let ignorebtn = new MessageButton()
            .setLabel('رفض')
            .setEmoji('❌')
            .setStyle('DANGER')
            .setCustomId(`ignore${user.id + channel.id}`);
        let botinvitebtn = new MessageButton()
            .setStyle('LINK')
            .setURL(config.bot.invite)
            .setLabel('إضغط هنا لإضافة البوت');
        let row = new MessageActionRow()
            .addComponents(sendbtn, everyonebtn, herebtn, ignorebtn, botinvitebtn);
        user.send({ content: `**يرجى إرسال رابط دعوة للتقديم على الشراكة**` }).then(msg => {
            channel.send({ content: `**تم إرسال الأمر في الخاص**`, allowedMentions: { repliedUser: false } });
            const filter = m => (m.author.id != client.user.id);
            const memberchannel = user.dmChannel;
            const requestchannel = guild.channels.cache.get(rdata[guild.id]);
            const fcollector = memberchannel.createMessageCollector({ filter, max: 1, time: 30000 });
            fcollector.on('collect', m => {
                if (!m.content.startsWith("https://discord.gg/" || "discord.gg/" || "discord.com/invite/" || "https://discord.com/invite/")) {
                    return memberchannel.send({
                        content: `\⛔ <@!${user.id}> **يرجى إستعمال رابط دعوة صحيح** \⛔`,
                        allowedMentions: { repliedUser: false }
                    });
                } else {
                    discordInv.getInv(discordInv.getCodeFromUrl(m.content)).then(invite => {
                        otherguild = client.guilds.cache.get(invite.guild.id);
                        if (!otherguild) {
                            otherguildexist = false;
                            return memberchannel.send({
                                content: `يرجى إضافة البوت لسيرفرك أولا`,
                                components: [botinvitebtn]
                            });
                        }
                        if (!cdata[otherguild.id]) {
                            otherguildexist = false;
                            return memberchannel.send({ content: `يرجى تحديد روم النشر في سيرفرك` + '\n' + `الطريقة: **${message ? prefix : '/'}set-partner-channels <ايدي الروم> channel**` });
                        }
                        if (!rolesdata[otherguild.id]) {
                            otherguildexist = false;
                            return memberchannel.send({ content: `يرجى تحديد رتبة الشراكة في سيرفرك` + '\n' + `الطريقة: **${message ? prefix : '/'}set-partner-role <ايدي الرتبة>**` });
                        }
                        if (invite.guild.id == guild.id) {
                            otherguildexist = false;
                            return memberchannel.send({ content: "**عذرا لكن البارتنر مع نفسك مش طبيعي**" });
                        }
                        const editsharemessagedoneing = sharemessage[invite.guild.id].split(" ");
                        sharemessagedoneing = editsharemessagedoneing;
                        let requestembed = new MessageEmbed()
                            .setAuthor(invite.guild.name, invite.guild.iconURL)
                            .setThumbnail(invite.guild.iconURL)
                            .addField('🔠 إسم السيرفر :', `${invite.guild.name}`, true)
                            .addField('🆔 أيدي السيرفر :', `${invite.guild.id}`, true)
                            .addField('📆 تاريخ الإنشاء', `<t:${Math.floor(invite.guild.createdTimestamp / 1000)}:d>`, true)
                            .addField('👥 عدد الأعضاء: ', `${invite.approximate_member_count}`, true)
                            .addField('↩ صاحب الدعوة :', `${invite.inviter.username}`, true)
                            .setFooter(user.username, user.avatarURL({ dynamic: true }))
                            .setTimestamp();
                        requestchannel.send({ embeds: [requestembed] });
                        requestchannel.send({ content: m.content });
                        if (sharemessage[invite.guild.id]) {
                            if (otherguildexist === false) {
                                return otherguildexist = true;
                            } else {
                                editsharemessagedoneing.forEach(x => {
                                    if (x.includes("<@&") && x.endsWith(">")) {
                                        let wantedroleID = x.replace('\\', '').replace('@', '').replace('<', '').replace('>', '').replace('!', '').replace('&', '');
                                        const roleguild = client.guilds.cache.get(invite.guild.id);
                                        const wantedrole = roleguild.roles.cache.find(r => r.id == wantedroleID) || guild.roles.cache.get(wantedroleID);
                                        const index = editsharemessagedoneing.indexOf(x);
                                        editsharemessagedoneing[index] = `\@${wantedrole.name}`;
                                        sharemessagedoneing = editsharemessagedoneing.join(" ") + "\n|| **تم تعديل الأخطاء الكتابية وإستبدال المنشنات غير القانونية بأسماء الرتب** ||";
                                    }
                                });
                                return requestchannel.send({
                                    content: sharemessagedoneing.join(" "),
                                    components: [row]
                                }).then(
                                    memberchannel.send({
                                        content: `\✅ **تم إرسال طلب الشراكة بنجاح**`
                                    })
                                );
                            }
                        } else {
                            memberchannel.send({ content: `**الرجاء إرسال رسالة الشراكة**` }).then(m => {
                                const filter = m => (m.author.id != client.user.id);
                                const memberchannel = user.dmChannel;
                                const requestchannel = guild.channels.cache.get(rdata[guild.id]);
                                const scollector = memberchannel.createMessageCollector({ filter, max: 1, time: 30000 });
                                scollector.on('collect', m => {
                                    if (otherguildexist === false) {
                                        return otherguildexist = true;
                                    } else {
                                        requestchannel.send({
                                            content: Discord.Util.cleanContent(m.content, m),
                                            components: [row]
                                        }).then(
                                            memberchannel.send({ content: `\✅ **تم إرسال طلب الشراكة بنجاح**` })
                                        );
                                    }
                                });
                                scollector.on('end', collected => {
                                    if (otherguildexist === false) {
                                        return otherguildexist = true;
                                    } else {
                                        if (collected.size < 1) {
                                            memberchannel.send({ content: `**إنتهى وقت إرسال رسالة الشراكة**\n> **حاول مجددا مرة أخرى**` })
                                        }
                                    }
                                });
                            });
                        }
                    }).catch(err => {
                        console.error(err);
                        memberchannel.send({ content: `\⚠️ **يرجى إستعمال رابط دعوة صالح** \⚠️\n ${err}` });
                    });
                }
            });
            fcollector.on('end', collected => {
                if (otherguildexist === false) {
                    return otherguildexist = true;
                } else {
                    if (collected.size < 1) {
                        memberchannel.send({ content: `**إنتهى وقت إرسال رابط الدعوة**\n> **حاول مجددا مرة أخرى**` });
                    }
                }
            });
        }).catch(async err => {
            console.log(err);
            channel.send({
                content: `**حدثت بعض المشاكل *× الرجاء إبقاء الخاص مفتوح ×***`,
                allowedMentions: { repliedUser: false }
            });
        });
        let firstserverclickerID;
        client.on("interactionCreate", async(interaction) => {
            if (!interaction.isButton) return;
            if (interaction.customId == `ignore${user.id + channel.id}`) {
                interaction.reply({ content: `تم رفض الطلب\nوسيتم إعلام <@!${user.id}>`, ephemeral: true });
                user.send({ content: `<@!${interaction.user.id}>, ❌ **تم رفض طلب الشراكة الخاص بك**` });
                return interaction.message.delete();
            }
            const sharechannel = await client.channels.cache.get(cdata[guild.id]);
            const sharerequest = await client.channels.cache.get(rdata[guild.id]);
            const othersharechannel = await client.channels.cache.get(cdata[otherguild.id]);
            const othersharerequest = await client.channels.cache.get(rdata[otherguild.id]);
            if (interaction.customId.startsWith(`accept${user.id + channel.id}`)) {
                let donebtn = new MessageButton()
                    .setLabel('قبول')
                    .setEmoji('✅')
                    .setStyle('SUCCESS')
                    .setCustomId(`done${user.id + channel.id}`);
                let undonebtn = new MessageButton()
                    .setLabel('رفض')
                    .setEmoji('❌')
                    .setStyle('DANGER')
                    .setCustomId(`undone${user.id + channel.id}`);
                let donningrow = new MessageActionRow()
                    .addComponents(donebtn, undonebtn);
                if (interaction.customId === `accept${user.id + channel.id}here`) {
                    if (sharemessagedoneing.includes(`everyone`)) {
                        othersharerequest.send({
                            content: sharemessagedoneing.replace('everyone', 'here').join(" "),
                            components: [donningrow]
                        });
                    } else {
                        othersharerequest.send({
                            content: `${sharemessagedoneing.join(" ")}\n|| @here ||`,
                            components: [donningrow]
                        });
                    }
                } else if (interaction.customId === `accept${user.id + channel.id}everyone`) {
                    if (sharemessagedoneing.includes(`here`)) {
                        othersharerequest.send({
                            content: sharemessagedoneing.replace('here', 'everyone').join(" "),
                            components: [donningrow]
                        });
                    } else {
                        othersharerequest.send({
                            content: `${sharemessagedoneing.join(" ")}\n|| @everyone ||`,
                            components: [donningrow]
                        });
                    }
                } else {
                    othersharerequest.send({
                        content: sharemessagedoneing.join(" "),
                        components: [donningrow]
                    });
                }
                interaction.reply({
                    content: `سيتم إرسال رسالة الشراكة على الفور إلى <#${cdata[guild.id]}>\nوسيتم إعلام <@!${user.id}> بأنك قبلت الطلب الخاصة به`,
                    ephemeral: true
                });
                user.send({ content: `<@!${interaction.user.id}>, \🎉 **قد قبل طلب الشراكة الخاص بك**` });
                user.send({ content: `<#${othersharerequest.id}> ***يرجى قبول الشراكة لإنهاء الطلب***` });
                firstserverclickerID = interaction.user.id;
                interaction.message.delete();
            }
            if (interaction.customId === `done${user.id + channel.id}`) {
                try {
                    interaction.message.delete().then(() => {
                        sharechannel.send({
                            content: sharemessagedoneing.join(" ")
                        });
                        othersharechannel.send({
                            content: Discord.Util.cleanContent(sharemessage[guild.id], interaction.message)
                        });
                        const secRoleID = guild.roles.cache.get(rolesdata[guild.id]);
                        if (secRoleID) {
                            member.roles.add(secRoleID.id).then(() => {
                                user.send({
                                    content: `\🥳 **مبروك لقد حصلت على رتبة الشراكة في السيرفر**`
                                });
                                sharechannel.send({
                                    content: `<@!${user.id}> قد حصل على رتبة الشراكة **\@${sharechannel.guild.roles.cache.get(rolesdata[guild.id]).name}**`
                                });
                            })
                        }
                        const firstserverclicker = client.users.cache.get(firstserverclickerID);
                        const rolefirstserverclicker = interaction.guild.members.cache.get(firstserverclickerID);
                        firstserverclicker.send({
                            content: `> **مبروك: *تم إنهاء طلب الشراكة بنجاح \🥳***`
                        }).then(() => {
                            const roleID = interaction.guild.roles.cache.get(rolesdata[interaction.guild.id]);
                            if (roleID) rolefirstserverclicker.roles.add(roleID.id);
                            firstserverclicker.send({
                                content: `\🥳 **مبروك لقد حصلت على رتبة الشراكة في السيرفر**`
                            });
                            othersharechannel.send({
                                content: `<@!${firstserverclickerID}> قد حصل على رتبة الشراكة **\@${othersharechannel.guild.roles.cache.get(rolesdata[interaction.guild.id]).name}**`
                            });
                        }).then(
                            user.send({
                                content: `> **مبروك: *تم إنهاء طلب الشراكة بنجاح \🥳***`
                            })
                        );
                    });
                } catch (error) {
                    client.users.cache.get(guild.ownerId).send({
                        content: '**حاول أحد الطرفين منع البوت من النشر**'
                    });
                    client.users.cache.get(interaction.guild.ownerId).send({
                        content: '**حاول أحد الطرفين منع البوت من النشر**'
                    });
                    console.error(error);
                }
            }
            if (interaction.customId === `undone${user.id + channel.id}`) {
                sharerequest.send({ content: `تم رفض الشراكة في سيرفر: \`${interaction.guild.name}\`` });
                interaction.reply({ content: `تم رفض الطلب`, ephemeral: true });
                interaction.message.delete();
            }
        });
    },
}