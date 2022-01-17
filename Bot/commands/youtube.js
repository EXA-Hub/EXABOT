const { Client } = require("discord.js");
const { ICallbackObject } = require("wokcommands");
module.exports = {
  name: "youtube",
  aliases: ["yt"],
  category: "أوامـر عـامـة",
  description: "الأوامر المتعلقة باليوتيوب",
  // expectedArgs: '',
  // minArgs: 0,
  // maxArgs: 0,
  syntaxError: "",
  permissions: [],
  cooldown: "3s",
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
   * @param {ICallbackObject} ICallbackObject
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
    if (interaction)
      interaction.reply({ content: "**🙂 | مرحبا صانع المحتوى**" });
    if (message && message.content.includes("@here" || "@everyone")) return;
    const {
      MessageActionRow,
      MessageButton,
      MessageEmbed,
    } = require("discord.js");
    const config = require("../data/config.js");
    let watch = new MessageButton()
      .setLabel("مشاهدة اليوتيوب")
      .setEmoji("📺")
      .setStyle("SUCCESS")
      .setCustomId(`YTWatch${channel.id + user.id}`);
    let abacus = new MessageButton()
      .setLabel("قناة عداد اليوتيوب")
      .setEmoji("🧮")
      .setStyle("SUCCESS")
      .setCustomId(`YTabacus${channel.id + user.id}`);
    let YouTuber = new MessageButton()
      .setLabel("تقديم على رتبة يوتيوبر")
      .setEmoji("👀")
      .setStyle("SUCCESS")
      .setCustomId(`YouTuber${channel.id + user.id}`);
    const firstYTembed = new MessageEmbed()
      .setTitle("إختر أمرا من الثلاثة")
      .setTimestamp()
      .setDescription("ستمسح الرسالة بعد 20 ثانية")
      .setURL(config.support.server.invite.link)
      .setThumbnail(client.user.avatarURL())
      .setColor(config.bot.color.hex)
      .addField("مشاهدة اليوتيوب 📺", "مشاهدة اليوتيوب في غرفة صوتية معا", true)
      .addField("إحصائيات اليوتيوب 🧮", "مشاهدة اليوتيوب في قناة ديسكورد", true)
      .setFooter({ text: user.username, iconURL: user.avatarURL() });
    let row = new MessageActionRow().addComponents(watch, abacus, YouTuber);
    await channel
      .send({ embeds: [firstYTembed], components: [row] })
      .then((msg) => {
        const filter = (interaction) =>
          interaction.customId.includes(channel.id + user.id) &&
          interaction.user.id === user.id;
        channel
          .awaitMessageComponent({ filter, time: 60 * 1000 })
          .then((interaction) => {
            if (!interaction.isButton()) return;
            const db = require("../functions/database");
            const config = require("../data/config.js");
            const filter = (msg) => msg.author == user;
            if (interaction.customId.includes(channel.id + user.id))
              interaction.reply({ content: `**📨 | جار بدأ تشغيل**` });
            if (interaction.customId == `YTWatch${channel.id + user.id}`) {
              const youtubeTogether = (ID) => {
                const fetch = require("node-fetch");
                fetch(`https://discord.com/api/v8/channels/${ID}/invites`, {
                  method: "POST",
                  body: JSON.stringify({
                    max_age: 86400,
                    max_uses: 0,
                    target_application_id: "755600276941176913", // youtube together
                    target_type: 2,
                    temporary: false,
                    validate: null,
                  }),
                  headers: {
                    Authorization: `Bot ${config.bot.token}`,
                    "Content-Type": "application/json",
                  },
                })
                  .then((res) => res.json())
                  .then((invite) => {
                    if (invite.error || !invite.code)
                      return channel.send({
                        content: "❌ | لا أستطيع تشغيل **YouTube Together**!",
                      });
                    channel.send({
                      content: `**✅ | تم تحضير الغرفة <#${ID}> للمشاهدة**\n** https://discord.gg/${invite.code} **`,
                    });
                  })
                  .catch((e) => {
                    channel.send({
                      content: "❌ | لا أستطيع تشغيل **YouTube Together**!",
                    });
                  });
                interaction.message.delete();
              };
              if (guild.members.cache.get(interaction.user.id).voice.channel) {
                return youtubeTogether(
                  guild.members.cache.get(interaction.user.id).voice.channel.id
                );
              } else {
                return interaction.message
                  .reply({
                    allowedMentions: { repliedUser: false },
                    content: "**يرجى إرسال أيدي أو إسم القناة**",
                  })
                  .then((x) => {
                    return interaction.channel
                      .awaitMessages({
                        filter,
                        max: 1,
                        time: 60 * 1000,
                        errors: ["الزمن"],
                      })
                      .then((m) => {
                        m = m.first();
                        const voice =
                          guild.channels.cache.get(m.content) ||
                          guild.channels.cache.find(
                            (voice) => voice.name.toLowerCase() === m.content
                          );
                        if (!voice)
                          return interaction.message.channel.send({
                            content: "❌ | لا توجد قناة!",
                          });
                        if (voice.type !== "GUILD_VOICE")
                          return interaction.message.channel.send({
                            content: "❌ | يجب أن تكون قناة صوتية!",
                          });
                        if (
                          !voice
                            .permissionsFor(interaction.message.guild.me)
                            .has("CREATE_INSTANT_INVITE")
                        )
                          return interaction.message.channel.send({
                            content:
                              "❌ | أحتاج صلاحيات `ADMINISTRATOR` و `CREATE_INSTANT_INVITE`",
                          });
                        x.delete();
                        return youtubeTogether(voice.id);
                      });
                  });
              }
            } else if (
              interaction.customId == `YTabacus${channel.id + user.id}`
            ) {
              if (
                !guild.members.cache
                  .get(interaction.user.id)
                  .permissions.has("MANAGE_CHANNELS" || "ADMINISTRATOR")
              )
                return interaction.message.reply(
                  "allowedMentions: { repliedUser: false },**❌ | يجب أن تمتلك صلاحية `ADMINISTRATOR` أو `MANAGE_CHANNELS`**",
                  true
                );
              const abacusEmbed = new MessageEmbed()
                .setColor("#2f3136")
                .setTitle("حدد إسم أو أيدي القناة");
              return channel
                .send({
                  allowedMentions: { repliedUser: false },
                  embeds: [abacusEmbed],
                })
                .then((x) => {
                  interaction.message.channel
                    .awaitMessages({
                      filter,
                      max: 1,
                      time: 60 * 1000,
                      errors: ["الزمن"],
                    })
                    .then((m) => {
                      m = m.first();
                      m.delete();
                      const selectedVChannel =
                        guild.channels.cache.get(m.content) ||
                        guild.channels.cache.find(
                          (voice) => voice.name.toLowerCase() === m.content
                        );
                      if (!selectedVChannel)
                        return interaction.message.channel.send({
                          content: "❌ | لا توجد قناة!",
                        });
                      if (
                        !selectedVChannel
                          .permissionsFor(interaction.message.guild.me)
                          .has("CREATE_INSTANT_INVITE")
                      )
                        return interaction.channel.send({
                          content:
                            "❌ | أحتاج صلاحيات `ADMINISTRATOR` و `CREATE_INSTANT_INVITE`",
                        });
                      const YTIDEmbed = new MessageEmbed()
                        .setDescription(
                          "youtube.com/channel/`UC9-qS_Jj-rG1I_Nfza6fT4w`"
                        )
                        .setColor("#2f3136")
                        .setTitle("حدد أيدي قناة اليوتيوب");
                      return interaction.channel
                        .send({ embeds: [YTIDEmbed] })
                        .then((xMsg) => {
                          return interaction.message.channel
                            .awaitMessages({
                              filter,
                              max: 1,
                              time: 60 * 1000,
                              errors: ["الزمن"],
                            })
                            .then((msg) => {
                              msg = msg.first();
                              xMsg.delete();
                              msg.delete();
                              const YTID = msg.content;
                              const YTdata = require("../functions/YouTube");
                              const API_KEY = config.youtube.API_KEY;
                              YTdata(YTID, API_KEY, (data) => {
                                const subscriberCount =
                                  data.items[0].statistics.subscriberCount;
                                const viewCount =
                                  data.items[0].statistics.viewCount;
                                const videoCount =
                                  data.items[0].statistics.videoCount;
                                const YTcEmbed = new MessageEmbed()
                                  .addField("عدد المشتركين", subscriberCount)
                                  .addField("عدد الفيديوهات", videoCount)
                                  .addField("عدد المشاهدات", viewCount)
                                  .setColor("#2f3136");
                                interaction.message.delete();
                                x.delete();
                                return channel.send({ embeds: [YTcEmbed] });
                              });
                            });
                        });
                    });
                });
            } else if (
              interaction.customId == `YouTuber${channel.id + user.id}`
            ) {
              const YouTuberEmbed = new MessageEmbed()
                .setColor(config.bot.color.hex)
                .setTitle("يرجى إرسال أيدي قناتك في يوتيوب");
              return interaction.message
                .reply({
                  allowedMentions: { repliedUser: false },
                  embeds: [YouTuberEmbed],
                })
                .then((x) => {
                  return interaction.message.channel
                    .awaitMessages({
                      filter,
                      max: 1,
                      time: 60 * 1000,
                      errors: ["الزمن"],
                    })
                    .then(async (m) => {
                      m = m.first();
                      m.delete();
                      const wantedChannelData = await db.get(
                        `YouTube_data/apply_${guild.id}`
                      );
                      if (guild.channels.cache.has(m.content)) {
                        const wantedChannel = guild.channels.cache.get(
                          m.content
                        );
                        if (
                          !guild.members.cache
                            .get(interaction.user.id)
                            .permissions.has("ADMINISTRATOR")
                        )
                          return channel.send({
                            content:
                              "**❌ | يجب أن تمتلك صلاحية `ADMINISTRATOR`**",
                          });
                        const data =
                          (await db.get(`YouTube_data/apply_${guild.id}`)) ||
                          {};
                        if (data && data === wantedChannel.id) {
                          db.delete(`YouTube_data/apply_${guild.id}`);
                          channel.send({
                            content: "**❎ | تم حذف غرفة الإستقبال**",
                          });
                        } else if (!data || data !== wantedChannel.id) {
                          db.set(
                            `YouTube_data/apply_${guild.id}`,
                            wantedChannel.id
                          );
                          wantedChannel.send({
                            content: "**✅ | هذه الأن روم الإستقبال**",
                          });
                        } else
                          return channel.send({
                            content:
                              "× حدث خطأ ما ×" +
                              config.support.server.invite.link,
                          });
                      } else if (db.has(`YouTube_data/apply_${guild.id}`)) {
                        channel
                          .send({
                            allowedMentions: { repliedUser: false },
                            content: "**⚜ | جاري إرسال الطلب**",
                          })
                          .then((msg) => {
                            const YTIDEmbed = new MessageEmbed()
                              .setDescription(`<@!${user.id}>`)
                              .setColor(config.bot.color.hex)
                              .setAuthor({
                                name: user.tag,
                                iconURL: user.avatarURL({ dynamic: true }),
                              });
                            guild.channels.cache
                              .get(wantedChannelData)
                              .send({
                                content:
                                  "https://www.youtube.com/channel/" +
                                  m.content,
                                embeds: [YTIDEmbed],
                              })
                              .then(
                                msg.edit({
                                  content: "**🌟 | تم إرسال طلبك**",
                                })
                              );
                          });
                      } else
                        return channel.send({
                          allowedMentions: { repliedUser: false },
                          content:
                            "**👀 | لم تقم الادارة بتحديد روم الاستقبال**",
                        });
                    });
                });
            }
          })
          .catch(console.error);
      });
  },
};
