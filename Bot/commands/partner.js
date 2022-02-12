const { Client } = require("discord.js");
const wok = require("wokcommands");
module.exports = {
  name: "partner",
  aliases: [],
  category: "أوامـر عـامـة",
  description: "طلب شراكة في السيرفر",
  // expectedArgs: '',
  // minArgs: 0,
  // maxArgs: 0,
  syntaxError: "",
  permissions: [],
  cooldown: "31s",
  // globalCooldown: '',
  hidden: false,
  ownerOnly: false,
  testOnly: false,
  guildOnly: true,
  slash: "both",
  /**
   *
   * @param {Client} client
   */
  init: (client, instance) => {},
  /**
   * @param {wok.ICallbackObject} ICallbackObject
   *
   */
  callback: async ({
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
    message
      ? message.reply({ content: "**👍 | يتم البدأ**" })
      : interaction.reply({ content: "**👍 | يتم البدأ**" });
    const Discord = require("discord.js");
    const config = require("../data/config");
    const discordInv = require("discord-inv");
    const db = require("../functions/database");
    const { MessageEmbed, MessageButton, MessageActionRow } = Discord;
    let otherGuildExist = true;
    const shareMessage = (await db.get("partner_message")) || {};
    const rolesData = (await db.get("partner_roles")) || {};
    const rdata = (await db.get("partner_requests")) || {};
    const cdata = (await db.get("partner_channels")) || {};
    let shareMessageDonning;
    if (!rdata[guild.id]) {
      channel.send({
        content:
          `يرجى تحديد روم إستقبال الطلبات في هذا السيرفر` +
          "\n" +
          `الطريقة: **${
            message ? prefix : "/"
          }set-partner-channels <ايدي الروم> request**`,
        allowedMentions: { repliedUser: false },
      });
      return;
    }
    if (!cdata[guild.id]) {
      channel.send({
        content:
          `يرجى تحديد روم النشر في هذا السيرفر` +
          "\n" +
          `الطريقة: **${
            message ? prefix : "/"
          }set-partner-channels <ايدي الروم> channel**`,
        allowedMentions: { repliedUser: false },
      });
      return;
    }
    if (!shareMessage[guild.id]) {
      channel.send({
        content:
          `يرجى تحديد رسالة النشر في هذا السيرفر` +
          "\n" +
          `الطريقة: **${
            message ? prefix : "/"
          }set-partner-message <رسالة النشر>**`,
        allowedMentions: { repliedUser: false },
      });
      return;
    }
    if (!rolesData[guild.id]) {
      channel.send({
        content:
          `يرجى تحديد رتبة الشراكة في هذا السيرفر` +
          "\n" +
          `الطريقة: **${
            message ? prefix : "/"
          }set-partner-role <ايدي الرتبة>**`,
        allowedMentions: { repliedUser: false },
      });
      return;
    }
    let sendButton = new MessageButton()
      .setStyle("SUCCESS")
      .setLabel("إضغط هنا للقبول")
      .setCustomId(`accept${user.id + channel.id}`);
    let hereButton = new MessageButton()
      .setStyle("SUCCESS")
      .setLabel("@everyone")
      .setCustomId(`accept${user.id + channel.id}everyone`);
    let everyoneButton = new MessageButton()
      .setStyle("SUCCESS")
      .setLabel("@here")
      .setCustomId(`accept${user.id + channel.id}here`);
    let ignoreButton = new MessageButton()
      .setLabel("رفض")
      .setEmoji("❌")
      .setStyle("DANGER")
      .setCustomId(`ignore${user.id + channel.id}`);
    let botInviteButton = new MessageButton()
      .setStyle("LINK")
      .setURL(config.bot.invite)
      .setLabel("إضغط هنا لإضافة البوت");
    let row = new MessageActionRow().addComponents(
      sendButton,
      everyoneButton,
      hereButton,
      ignoreButton,
      botInviteButton
    );
    user
      .send({ content: `**يرجى إرسال رابط دعوة للتقديم على الشراكة**` })
      .then((msg) => {
        channel.send({
          content: `**تم إرسال الأمر في الخاص**`,
          allowedMentions: { repliedUser: false },
        });
        const filter = (m) => m.author.id != client.user.id;
        const memberChannel = user.dmChannel;
        const requestChannel = guild.channels.cache.get(rdata[guild.id]);
        const fcollector = memberChannel.createMessageCollector({
          filter,
          max: 1,
          time: 30000,
        });
        fcollector.on("collect", (m) => {
          if (
            !m.content.startsWith(
              "https://discord.gg/" ||
                "discord.gg/" ||
                "discord.com/invite/" ||
                "https://discord.com/invite/"
            )
          ) {
            return memberChannel.send({
              content: `\⛔ <@!${user.id}> **يرجى إستعمال رابط دعوة صحيح** \⛔`,
              allowedMentions: { repliedUser: false },
            });
          } else {
            discordInv
              .getInv(discordInv.getCodeFromUrl(m.content))
              .then((invite) => {
                otherGuild = client.guilds.cache.get(invite.guild.id);
                if (!otherGuild) {
                  otherGuildExist = false;
                  return memberChannel.send({
                    content: `يرجى إضافة البوت لسيرفرك أولا`,
                    components: [botInviteButton],
                  });
                }
                if (!cdata[otherGuild.id]) {
                  otherGuildExist = false;
                  return memberChannel.send({
                    content:
                      `يرجى تحديد روم النشر في سيرفرك` +
                      "\n" +
                      `الطريقة: **${
                        message ? prefix : "/"
                      }set-partner-channels <ايدي الروم> channel**`,
                  });
                }
                if (!rolesData[otherGuild.id]) {
                  otherGuildExist = false;
                  return memberChannel.send({
                    content:
                      `يرجى تحديد رتبة الشراكة في سيرفرك` +
                      "\n" +
                      `الطريقة: **${
                        message ? prefix : "/"
                      }set-partner-role <ايدي الرتبة>**`,
                  });
                }
                if (invite.guild.id == guild.id) {
                  otherGuildExist = false;
                  return memberChannel.send({
                    content: "**عذرا لكن البارتنر مع نفسك مش طبيعي**",
                  });
                }
                const editShareMessageDonning =
                  shareMessage[invite.guild.id].split(" ");
                shareMessageDonning = editShareMessageDonning;
                let requestEmbed = new MessageEmbed()
                  .setAuthor({
                    name: invite.guild.name,
                    iconURL: invite.guild.iconURL,
                  })
                  .setThumbnail(invite.guild.iconURL)
                  .addField("🔠 إسم السيرفر :", `${invite.guild.name}`, true)
                  .addField("🆔 أيدي السيرفر :", `${invite.guild.id}`, true)
                  .addField(
                    "📆 تاريخ الإنشاء",
                    `<t:${Math.floor(invite.guild.createdTimestamp / 1000)}:d>`,
                    true
                  )
                  .addField(
                    "👥 عدد الأعضاء: ",
                    `${invite.approximate_member_count}`,
                    true
                  )
                  .addField(
                    "↩ صاحب الدعوة :",
                    `${invite.inviter.username}`,
                    true
                  )
                  .setFooter({
                    text: user.username,
                    iconURL: user.avatarURL({ dynamic: true }),
                  })
                  .setTimestamp();
                requestChannel.send({ embeds: [requestEmbed] });
                requestChannel.send({ content: m.content });
                if (shareMessage[invite.guild.id]) {
                  if (otherGuildExist === false) {
                    return (otherGuildExist = true);
                  } else {
                    editShareMessageDonning.forEach((x) => {
                      if (x.includes("<@&") && x.endsWith(">")) {
                        let wantedRoleID = x.replace(/[\\@<>!&]+/g, "");
                        const roleGuild = client.guilds.cache.get(
                          invite.guild.id
                        );
                        const wantedRole =
                          roleGuild.roles.cache.find(
                            (r) => r.id == wantedRoleID
                          ) || guild.roles.cache.get(wantedRoleID);
                        const index = editShareMessageDonning.indexOf(x);
                        editShareMessageDonning[index] = `\@${wantedRole.name}`;
                        shareMessageDonning =
                          editShareMessageDonning.join(" ") +
                          "\n|| **تم تعديل الأخطاء الكتابية وإستبدال المنشنات غير القانونية بأسماء الرتب** ||";
                      }
                    });
                    return requestChannel
                      .send({
                        content: shareMessageDonning.join(" "),
                        components: [row],
                      })
                      .then(
                        memberChannel.send({
                          content: `\✅ **تم إرسال طلب الشراكة بنجاح**`,
                        })
                      );
                  }
                } else {
                  memberChannel
                    .send({ content: `**الرجاء إرسال رسالة الشراكة**` })
                    .then((m) => {
                      const filter = (m) => m.author.id != client.user.id;
                      const memberchannel = user.dmChannel;
                      const requestchannel = guild.channels.cache.get(
                        rdata[guild.id]
                      );
                      const scollector = memberchannel.createMessageCollector({
                        filter,
                        max: 1,
                        time: 30000,
                      });
                      scollector.on("collect", (m) => {
                        if (otherGuildExist === false) {
                          return (otherGuildExist = true);
                        } else {
                          requestchannel
                            .send({
                              content: Discord.Util.cleanContent(m.content, m),
                              components: [row],
                            })
                            .then(
                              memberchannel.send({
                                content: `\✅ **تم إرسال طلب الشراكة بنجاح**`,
                              })
                            );
                        }
                      });
                      scollector.on("end", (collected) => {
                        if (otherGuildExist === false) {
                          return (otherGuildExist = true);
                        } else {
                          if (collected.size < 1) {
                            memberchannel.send({
                              content: `**إنتهى وقت إرسال رسالة الشراكة**\n> **حاول مجددا مرة أخرى**`,
                            });
                          }
                        }
                      });
                    });
                }
              })
              .catch((err) => {
                memberChannel.send({
                  content: `\⚠️ **يرجى إستعمال رابط دعوة صالح** \⚠️\n ${err}`,
                });
                throw err;
              });
          }
        });
        fcollector.on("end", (collected) => {
          if (otherGuildExist === false) {
            return (otherGuildExist = true);
          } else {
            if (collected.size < 1) {
              memberChannel.send({
                content: `**إنتهى وقت إرسال رابط الدعوة**\n> **حاول مجددا مرة أخرى**`,
              });
            }
          }
        });
      })
      .catch(async (err) => {
        console.log(err);
        channel.send({
          content: `**حدثت بعض المشاكل *× الرجاء إبقاء الخاص مفتوح ×***`,
          allowedMentions: { repliedUser: false },
        });
      });
    let firstserverclickerID;
    client.on("interactionCreate", async (endInteraction) => {
      if (
        !endInteraction.isButton() ||
        channel.id ||
        user.id ||
        endInteraction.customId.includes(user.id + channel.id)
      )
        return;
      if (endInteraction.customId == `ignore${user.id + channel.id}`) {
        endInteraction.reply({
          content: `تم رفض الطلب\nوسيتم إعلام <@!${user.id}>`,
          ephemeral: true,
        });
        user.send({
          content: `<@!${endInteraction.user.id}>, ❌ **تم رفض طلب الشراكة الخاص بك**`,
        });
        return endInteraction.message.delete();
      }
      const sharechannel = await client.channels.cache.get(cdata[guild.id]);
      const sharerequest = await client.channels.cache.get(rdata[guild.id]);
      const othersharechannel = await client.channels.cache.get(
        cdata[otherGuild.id]
      );
      const othersharerequest = await client.channels.cache.get(
        rdata[otherGuild.id]
      );
      if (endInteraction.customId.startsWith(`accept${user.id + channel.id}`)) {
        let donebtn = new MessageButton()
          .setLabel("قبول")
          .setEmoji("✅")
          .setStyle("SUCCESS")
          .setCustomId(`done${user.id + channel.id}`);
        let undonebtn = new MessageButton()
          .setLabel("رفض")
          .setEmoji("❌")
          .setStyle("DANGER")
          .setCustomId(`undone${user.id + channel.id}`);
        let donningrow = new MessageActionRow().addComponents(
          donebtn,
          undonebtn
        );
        if (endInteraction.customId === `accept${user.id + channel.id}here`) {
          if (shareMessageDonning.includes(`everyone`)) {
            othersharerequest.send({
              content: shareMessageDonning
                .replace("everyone", "here")
                .join(" "),
              components: [donningrow],
            });
          } else {
            othersharerequest.send({
              content: `${shareMessageDonning.join(" ")}\n|| @here ||`,
              components: [donningrow],
            });
          }
        } else if (
          endInteraction.customId === `accept${user.id + channel.id}everyone`
        ) {
          if (shareMessageDonning.includes(`here`)) {
            othersharerequest.send({
              content: shareMessageDonning
                .replace("here", "everyone")
                .join(" "),
              components: [donningrow],
            });
          } else {
            othersharerequest.send({
              content: `${shareMessageDonning.join(" ")}\n|| @everyone ||`,
              components: [donningrow],
            });
          }
        } else {
          othersharerequest.send({
            content: shareMessageDonning.join(" "),
            components: [donningrow],
          });
        }
        endInteraction.reply({
          content: `سيتم إرسال رسالة الشراكة على الفور إلى <#${
            cdata[guild.id]
          }>\nوسيتم إعلام <@!${user.id}> بأنك قبلت الطلب الخاصة به`,
          ephemeral: true,
        });
        user.send({
          content: `<@!${endInteraction.user.id}>, \🎉 **قد قبل طلب الشراكة الخاص بك**`,
        });
        user.send({
          content: `<#${othersharerequest.id}> ***يرجى قبول الشراكة لإنهاء الطلب***`,
        });
        firstserverclickerID = endInteraction.user.id;
        endInteraction.message.delete();
      } else if (endInteraction.customId === `done${user.id + channel.id}`) {
        try {
          endInteraction.message.delete().then(() => {
            sharechannel.send({
              content: shareMessageDonning.join(" "),
            });
            othersharechannel.send({
              content: Discord.Util.cleanContent(
                shareMessage[guild.id],
                endInteraction.message
              ),
            });
            const secRoleID = guild.roles.cache.get(rolesData[guild.id]);
            if (secRoleID) {
              member.roles.add(secRoleID.id).then(() => {
                user.send({
                  content: `\🥳 **مبروك لقد حصلت على رتبة الشراكة في السيرفر**`,
                });
                sharechannel.send({
                  content: `<@!${user.id}> قد حصل على رتبة الشراكة **\@${
                    sharechannel.guild.roles.cache.get(rolesData[guild.id]).name
                  }**`,
                });
              });
            }
            const firstserverclicker =
              client.users.cache.get(firstserverclickerID);
            const rolefirstserverclicker =
              endInteraction.guild.members.cache.get(firstserverclickerID);
            firstserverclicker
              .send({
                content: `> **مبروك: *تم إنهاء طلب الشراكة بنجاح \🥳***`,
              })
              .then(() => {
                const roleID = endInteraction.guild.roles.cache.get(
                  rolesData[endInteraction.guild.id]
                );
                if (roleID) rolefirstserverclicker.roles.add(roleID.id);
                firstserverclicker.send({
                  content: `\🥳 **مبروك لقد حصلت على رتبة الشراكة في السيرفر**`,
                });
                othersharechannel.send({
                  content: `<@!${firstserverclickerID}> قد حصل على رتبة الشراكة **\@${
                    othersharechannel.guild.roles.cache.get(
                      rolesData[endInteraction.guild.id]
                    ).name
                  }**`,
                });
              })
              .then(
                user.send({
                  content: `> **مبروك: *تم إنهاء طلب الشراكة بنجاح \🥳***`,
                })
              );
          });
        } catch (error) {
          client.users.cache.get(guild.ownerId).send({
            content: "**حاول أحد الطرفين منع البوت من النشر**",
          });
          client.users.cache.get(endInteraction.guild.ownerId).send({
            content: "**حاول أحد الطرفين منع البوت من النشر**",
          });
          console.error(error);
        }
      } else if (endInteraction.customId === `undone${user.id + channel.id}`) {
        sharerequest.send({
          content: `تم رفض الشراكة في سيرفر: \`${endInteraction.guild.name}\``,
        });
        endInteraction.reply({ content: `تم رفض الطلب`, ephemeral: true });
        endInteraction.message.delete();
      }
    });
  },
};
