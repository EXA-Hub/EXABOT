module.exports = {
  name: "giveaway",
  aliases: ["gv"],
  category: "الألـعـاب",
  description: "أمر بدأ الجيف أواي",
  expectedArgs: "<start/reroll/delete/end>",
  minArgs: 1,
  maxArgs: 1,
  syntaxError: "",
  permissions: ["ADMINISTRATOR"],
  // cooldown: '',
  // globalCooldown: '',
  hidden: false,
  ownerOnly: false,
  testOnly: false,
  guildOnly: true,
  slash: "both",
  options: [
    {
      name: "الأمر",
      description: "نوع الأمر",
      required: true,
      type: 3,
      choices: [
        {
          name: "لبدء_جائزة_جديدة",
          value: "start",
        },
        {
          name: "لإعادة_إختيار_الفائزين",
          value: "reroll",
        },
        {
          name: "لحذف_جائزة_ما",
          value: "delete",
        },
        {
          name: "لإنهاء_وقت_الجائزة_فورا",
          value: "end",
        },
      ],
    },
  ],
  init: (client, instance) => {},
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
    const config = require("../data/config.js");
    const filter = (msg) => msg.author == user;
    const { MessageEmbed } = require("discord.js");
    const worngCmdEmbed = new MessageEmbed()
      .setColor("RED")
      .setURL(config.support.server.invite.link)
      .addField(
        `\`${message ? prefix : "/"}giveaway start\``,
        "لبدء جائزة جديدة",
        false
      )
      .addField(
        `\`${message ? prefix : "/"}giveaway reroll\``,
        "لإعادة إختيار الفائزين",
        false
      )
      .addField(
        `\`${message ? prefix : "/"}giveaway delete\``,
        "لحذف جائزة ما",
        false
      )
      .addField(
        `\`${message ? prefix : "/"}giveaway end\``,
        "لإنهاء وقت الجائزة فورا",
        false
      )
      .setTitle(`إستخدام خطأ للأمر: ${message ? prefix : "/"}giveaway`);
    if (args[0] === "start") {
      if (!message) interaction.reply({ content: "👍 | جاري بدأ جائزة جديدة" });
      await channel
        .send({
          content: "**⁉ | يرجى تحديد غرفة نشر الجائزة**",
          allowedMentions: { repliedUser: false },
        })
        .then((m) => {
          m.channel
            .awaitMessages({
              filter,
              max: 1,
              time: 60 * 1000,
              errors: ["الزمن"],
            })
            .then((m1) => {
              m1 = m1.first();
              const giveawayChannel =
                m1.guild.channels.cache.get(m1.content) ||
                m1.guild.channels.cache.find(
                  (channel) => channel.name.toLowerCase() === m1.content
                ) ||
                m1.mentions.channels.first() ||
                m1.channel;
              if (giveawayChannel) {
                m1.channel
                  .send({ content: "**⁉ | يرجى تحديد الجائزة**" })
                  .then((m2) => {
                    m2.channel
                      .awaitMessages({
                        filter,
                        max: 1,
                        time: 60 * 1000,
                        errors: ["الزمن"],
                      })
                      .then((m3) => {
                        m3 = m3.first();
                        const gift = m3.content;
                        if (gift) {
                          const timeEmbed = new MessageEmbed()
                            .setColor(config.bot.color.hex)
                            .setDescription(
                              "m = دقيقة" + "\n" + "h = ساعة" + "\n" + "d = يوم"
                            )
                            .setTitle("**⁉ | يرجى تحديد الوقت**");
                          m3.channel
                            .send({ embeds: [timeEmbed] })
                            .then((m4) => {
                              m4.channel
                                .awaitMessages({
                                  filter,
                                  max: 1,
                                  time: 60 * 1000,
                                  errors: ["الزمن"],
                                })
                                .then((m5) => {
                                  m5 = m5.first();
                                  const ms = require("ms");
                                  const time = ms(m5.content);
                                  if (time) {
                                    m5.channel
                                      .send({
                                        content:
                                          "**⁉ | يرجى تحديد عدد الفائزين**",
                                      })
                                      .then((m6) => {
                                        m6.channel
                                          .awaitMessages({
                                            filter,
                                            max: 1,
                                            time: 60 * 1000,
                                            errors: ["الزمن"],
                                          })
                                          .then((m7) => {
                                            m7 = m7.first();
                                            const winners = parseInt(
                                              m7.content
                                            );
                                            if (winners) {
                                              client.giveawaysManager.start(
                                                giveawayChannel,
                                                {
                                                  duration: time,
                                                  prize: gift,
                                                  winnerCount: winners,
                                                  hostedBy: user,
                                                  botsCanWin: false,
                                                  messages: {
                                                    giveaway:
                                                      ":tada: **جائزة** :tada:",
                                                    giveawayEnded:
                                                      ":tada: **إنتهى الوقت** :tada:",
                                                    drawing: `تبقى: {timestamp}!`,
                                                    inviteToParticipate:
                                                      "إضغط على 🎉 للمشاركة!",
                                                    winMessage:
                                                      "مبروك, {winners}! لقد ربحت **{this.prize}**!\n{this.messageURL}",
                                                    embedFooter:
                                                      "الفائز(ين): {this.winnerCount}",
                                                    noWinner:
                                                      "لا يوجد عدد كافي من المشاركين!",
                                                    hostedBy:
                                                      "صاحب الجائزة: {this.hostedBy}",
                                                    winners: "الفائز(ين):",
                                                    endedAt: "إنتهى",
                                                  },
                                                }
                                              );
                                              if (message) message.delete();
                                              m7.delete();
                                            } else {
                                              m7.reply(
                                                "**❌ | لا أستطيع تحديد عدد الفائزين**"
                                              );
                                            }
                                            m6.delete();
                                          });
                                      });
                                    m5.delete();
                                  } else
                                    return m5.reply({
                                      content: "**❌ | لا أستطيع تحديد الوقت**",
                                      allowedMentions: { repliedUser: false },
                                    });
                                  m4.delete();
                                });
                            });
                          m3.delete();
                        } else
                          return m3.reply({
                            content: "**❌ | لا أستطيع تحديد تلك الجائزة**",
                            allowedMentions: { repliedUser: false },
                          });
                        m2.delete();
                      });
                  });
                m1.delete();
              } else
                return m1.reply({
                  content: "**❌ | لا أستطيع العثور على القناة**",
                  allowedMentions: { repliedUser: false },
                });
              m.delete();
            });
        });
    } else if (args[0] === "reroll") {
      if (!message)
        interaction.reply({ content: "👍 | جاري إعادة إختيار الفائزين" });
      channel
        .send({
          content: "**🎉 | يرجى إرسال أيدي رسالة الجائزة**",
          allowedMentions: { repliedUser: false },
        })
        .then((x) => {
          if (message) message.delete();
          channel
            .awaitMessages({
              filter,
              max: 1,
              time: 60 * 1000,
              errors: ["الزمن"],
            })
            .then((msg) => {
              x.delete();
              msg = msg.first();
              client.giveawaysManager
                .reroll(msg.content, {
                  messages: {
                    congrat:
                      ":tada: إعادة إختيار: {winners}! مبروك, لقد فزت بـ**{prize}**!\n{messageURL}",
                    error: "لا يوجد عدد كافي من المشاركين حاليا!",
                  },
                })
                .then(() => {
                  channel.send({
                    content: "**👍 | تم إعادة إختيار الفائزين**",
                  });
                })
                .catch((err) => {
                  console.error(err);
                  channel.send({
                    content:
                      "**لا يوجد جائزة في الرسالة `" +
                      msg.content +
                      "`, الرجاء التحقق ثم إعادة المحاولة**",
                  });
                });
              msg.delete();
            });
        });
    } else if (args[0] === "delete") {
      if (!message) interaction.reply({ content: "👍 | جاري حذف الجائزة" });
      channel
        .send({
          content: "**😴 | يرجى إرسال أيدي رسالة الجائزة**",
          allowedMentions: { repliedUser: false },
        })
        .then((x) => {
          if (message) message.delete();
          channel
            .awaitMessages({
              filter,
              max: 1,
              time: 60 * 1000,
              errors: ["الزمن"],
            })
            .then((msg) => {
              x.delete();
              msg = msg.first();
              client.giveawaysManager
                .delete(msg.content)
                .then(() => {
                  channel.send({ content: "**👍 | تم حذف الجائزة**" });
                })
                .catch((err) => {
                  channel.send({
                    content:
                      "**لا يوجد جائزة في الرسالة `" +
                      msg.content +
                      "`, الرجاء التحقق ثم إعادة المحاولة**",
                  });
                });
              msg.delete();
            });
        });
    } else if (args[0] === "end") {
      if (!message) interaction.reply({ content: "👍 | جاري إنهاء الجائزة" });
      channel
        .send({
          content: "**🥳 | يرجى إرسال أيدي رسالة الجائزة**",
          allowedMentions: { repliedUser: false },
        })
        .then((x) => {
          if (message) message.delete();
          channel
            .awaitMessages({
              filter,
              max: 1,
              time: 60 * 1000,
              errors: ["الزمن"],
            })
            .then((msg) => {
              x.delete();
              msg = msg.first();
              client.giveawaysManager
                .end(msg.content)
                .then(() => {
                  channel.send({
                    content: "**👍 | تم إنهاء الجائزة على خير**",
                  });
                })
                .catch((err) => {
                  channel.send({
                    content:
                      "**لا يوجد جائزة في الرسالة `" +
                      msg.content +
                      "`, الرجاء التحقق ثم إعادة المحاولة**",
                  });
                });
              msg.delete();
            });
        });
    } else return { custom: true, embeds: [worngCmdEmbed] };
  },
};
