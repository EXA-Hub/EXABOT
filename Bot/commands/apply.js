const { client } = require("../index");
const wok = require("wokcommands");
module.exports = {
  name: "apply",
  aliases: [],
  category: "أوامـر عـامـة",
  description: "للتقديم في السيرفر",
  expectedArgs: "[on/off/channel/role/info] [roleId/channelId]",
  minArgs: 0,
  maxArgs: 2,
  syntaxError: "",
  permissions: [],
  // cooldown: '6h',
  // globalCooldown: '',
  hidden: false,
  ownerOnly: false,
  testOnly: false,
  guildOnly: true,
  slash: "both",
  options: [
    {
      name: "نوعية_الأمر",
      description: "الطريقة اللتي تريد إستخدام الأمر بها",
      required: false,
      type: 3,
      choices: [
        {
          name: "رؤية_المعلومات",
          value: "info",
        },
        {
          value: "on",
          name: "تشغيل_التقديم",
        },
        {
          value: "off",
          name: "إيقاف_التقديم",
        },
        {
          value: "role",
          name: "تحديد_رتبة_التقديم",
        },
        {
          value: "channel",
          name: "تحديد_قناة_التقديم",
        },
      ],
    },
    {
      name: "رتبة",
      description: "إضافة رتبة التقديم",
      required: false,
      type: 8,
    },
    {
      name: "غرفة",
      description: "إضافة غرفة التقديم",
      required: false,
      type: 7,
    },
  ],
  /**
   *
   * @param {client} client
   */
  init: (client, instance) => {
    client.on("interactionCreate", async (interaction) => {
      if (!interaction.isButton()) return;
      if (!interaction.customId.includes("done")) return;
      const { guild } = interaction;
      const applier = {
        ID: interaction.customId.replace("done", "").replace("undone", ""),
        name: interaction.message.embeds[0].fields
          .filter((field) => field.name === "> `إسمك:`")[0]
          .value.replace(" ** ", ""),
      };
      const member = guild.members.cache.get(applier.ID);
      if (
        !interaction.member.permissions.has("ADMINISTRATOR" || "MANAGE_ROLES")
      )
        return interaction.reply({
          content: "❌ | يجب أن تملك صلاحية `ADMINISTRATOR` أو `MANAGE_ROLES`",
          ephemeral: true,
        });
      if (interaction.customId.startsWith("undone"))
        interaction.message.delete().then(() =>
          interaction.channel.send({
            content: `**❌ | ${
              member ? member.user : applier.name
            } تم رفض تقديمك**`,
          })
        );
      else if (interaction.customId.startsWith("done")) {
        const rolesDataFile =
          (await require("../functions/database").get("apply_data/roles")) ||
          {};
        const role = guild.roles.cache.get(rolesDataFile[guild.id]);
        interaction.message.delete().then(() => {
          member.roles.add(role).then(() => {
            return interaction.channel.send({
              content: `**✅ | ${
                member ? member.user : applier.name
              } تم قبول تقديمك**`,
            });
          });
        });
      }
    });
  },
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
    const config = require("../data/config.js");
    const db = require("../functions/database");
    const Discord = require("discord.js");
    const wrongembed = new Discord.MessageEmbed()
      .addField(`\`${message ? prefix : "/" + "apply"}\``, "للتقديم", false)
      .addField(
        `\`${message ? prefix : "/" + "apply"} info\``,
        "رؤية معلومات التقديم",
        false
      )
      .addField(
        `\`${message ? prefix : "/" + "apply"} <on/off>\``,
        "فتح وإغلاق التقديم",
        false
      )
      .addField(
        `\`${message ? prefix : "/" + "apply"} role <role>\``,
        "تحديد رتبة التقديم",
        false
      )
      .addField(
        `\`${message ? prefix : "/" + "apply"} channel <channel>\``,
        "تحديد قناة التقديم",
        false
      )
      .setURL(config.support.server.invite.link)
      .setColor("RED")
      .setTitle(`إستخدام خطأ للأمر: ${message ? prefix : "/" + "apply"}`);
    const channelsDataFile = (await db.get("apply_data/channels")) || {};
    const onOffDataFile = (await db.get("apply_data/on&off")) || {};
    const rolesDataFile = (await db.get("apply_data/roles")) || {};
    if (args[0]) {
      if (!member.permissions.has("ADMINISTRATOR"))
        return `× يا صاحبي أنت مش مدير في السيرفر معلش ×`;
      const onoffpath = "apply_data/on&off";
      const saveData = async (saved, path) => {
        const datafile = (await db.get(path)) || {};
        datafile[guild.id] = saved;
        db.set(path, datafile);
        return Promise.resolve();
      };
      if (args[0] == "channel") {
        const channel = message
          ? guild.channels.cache.get(args[1]) ||
            guild.channels.cache.find(
              (channel) => channel.name.toLowerCase() === args[1]
            ) ||
            message.mentions.channels.first() ||
            channel
          : interaction.options.getChannel("غرفة");
        if (!channel || channel.type !== "GUILD_TEXT")
          return "**👀 | لم أصل للقناة**";
        if (!guild.channels.cache.get(channel.id))
          return "**❌ | لا يمكنك إستعمال قنوات من سيرفرات أخرى**";
        channel
          .send(
            `\\✅ | <#${channel.id}>\n**تم الوصول للقناة وجاري تدوين المعلومات**`
          )
          .then((msg) => {
            if (channelsDataFile[guild.id] == channel.id) {
              delete channelsDataFile[guild.id];
              db.set("apply_data/channels", channelsDataFile);
              msg.edit("**✅ | تم حذف قناة التقديم**");
            } else {
              channelsDataFile[guild.id] = channel.id;
              db.set("apply_data/channels", channelsDataFile);
              msg.edit("**✅ | تم تحديد قناة التقديم**");
            }
          });
        return "**👍 | تم تنفيذ العملية**";
      } else if (args[0] == "role") {
        const role = message
          ? guild.roles.cache.get(args[1]) ||
            guild.roles.cache.find(
              (role) => role.name.toLowerCase() === args[1]
            ) ||
            message.mentions.roles.first()
          : interaction.options.getRole("رتبة");
        if (!role) return "**❌ | لم أصل للرتبة**";
        if (!guild.roles.cache.get(role.id))
          return "**لا يمكنك إستعمال رتب من سيرفرات أخرى**";
        channel
          .send(
            `\\✅ | <@&${role.id}>\n**تم الوصول للرتبة وجاري تدوين المعلومات**`
          )
          .then((msg) => {
            if (rolesDataFile[guild.id] == role.id) {
              delete rolesDataFile[guild.id];
              db.set("apply_data/roles", rolesDataFile);
              msg.edit("**✅ | تم حذف رتبة التقديم**");
            } else {
              rolesDataFile[guild.id] = role.id;
              db.set("apply_data/roles", rolesDataFile);
              msg.edit("**✅ | تم تحديد رتبة التقديم**");
            }
          });
        return "**👍 | تم تنفيذ العملية**";
      } else if (args[0] == "info") {
        let setColor;
        const coloredRole = guild.roles.cache.get(rolesDataFile[guild.id]);
        if (coloredRole) setColor = coloredRole.hexColor;
        else setColor = config.bot.color.hex;
        const infoEmbed = new Discord.MessageEmbed()
          .addField("حالة التقديم", `\`${onOffDataFile[guild.id]}\``, false)
          .addField("رتبة التقديم", `<@&${rolesDataFile[guild.id]}>`, false)
          .addField("قناة التقديم", `<#${channelsDataFile[guild.id]}>`, false)
          .setURL(config.support.server.invite.link)
          .setColor(setColor)
          .setTitle("معلومات التقديم");
        channel.send({ embeds: [infoEmbed] });
        return "**👍 | تم تنفيذ العملية**";
      } else if (args[0] == "on") {
        saveData(args[0], onoffpath).then(
          channel.send(`**✅ | تم فتح التقديم**`)
        );
        return "**👍 | تم تنفيذ العملية**";
      } else if (args[0] == "off") {
        saveData(args[0], onoffpath).then(
          channel.send(`**❎ | تم إغلاق التقديم**`)
        );
        return "**👍 | تم تنفيذ العملية**";
      } else {
        channel.send({ embeds: [wrongembed] });
        return "**👍 | تم تنفيذ العملية**";
      }
    } else {
      if (
        !onOffDataFile ||
        !onOffDataFile[guild.id] ||
        onOffDataFile[guild.id] == "off"
      )
        return `**❌ | التقديم مغلق حاليا**`;
      if (!rolesDataFile[guild.id])
        return "**⁉ | يرجى تحديد رتبة التقديم**\n`" + message
          ? prefix
          : "/" + "apply" + " role <role>`";
      if (!channelsDataFile[guild.id])
        return "**يرجى تحديد قناة إستقبال طلبات التقديم**\n`" + message
          ? prefix
          : "/" + "apply" + " channel <channel>`";
      if (member.roles.cache.get(rolesDataFile[guild.id]))
        return "**🧐 | أنت بالفعل ضمن طاقم الإدارة**";
      if (interaction)
        interaction.reply({ content: "**👍 | جار بدأ التحقيق**" });
      const endChannel = guild.channels.cache.get(channelsDataFile[guild.id]);
      if (endChannel) {
        const filter = (msg) => msg.author == user;
        channel.send({ content: `${user} \`1\`` }).then((m) => {
          m.edit({ content: `${user}, \`ما هو اسمك?\`` }).then((m) => {
            m.channel
              .awaitMessages({
                filter,
                max: 1,
                time: 60 * 1000,
                errors: ["الزمن"],
              })
              .then((m1) => {
                m1 = m1.first();
                var name = m1.content;
                m1.delete();
                m.edit(`${user} \`2\``).then((m) => {
                  m.edit({ content: `${user}, \`كم عمرك؟\`` });
                  setTimeout(() => {
                    m.delete();
                  }, 10000);
                  m.channel
                    .awaitMessages({
                      filter,
                      max: 1,
                      time: 60 * 1000,
                      errors: ["الزمن"],
                    })
                    .then((m2) => {
                      m2 = m2.first();
                      var age = m2.content;
                      m2.delete();
                      channel.send({ content: `${user} \`3\`` }).then((m) => {
                        m.edit({ content: `${user}, \`كم لك بالديسكورد?\`` });
                        setTimeout(() => {
                          m.delete();
                        }, 10000);
                        m.channel
                          .awaitMessages({
                            filter,
                            max: 1,
                            time: 60 * 1000,
                            errors: ["الزمن"],
                          })
                          .then((m3) => {
                            m3 = m3.first();
                            var ask = m3.content;
                            m3.delete();
                            channel
                              .send({ content: `${user} \`4\`` })
                              .then((m) => {
                                m.edit({
                                  content: `${user}, \`لماذا تريد أن تصبح ضمن طاقم الإدارة?\``,
                                });
                                setTimeout(() => {
                                  m.delete();
                                }, 10000);
                                m.channel
                                  .awaitMessages({
                                    filter,
                                    max: 1,
                                    time: 60 * 1000,
                                    errors: ["الزمن"],
                                  })
                                  .then((m4) => {
                                    m4 = m4.first();
                                    var ask2 = m4.content;
                                    m4.delete();
                                    channel
                                      .send({ content: `${user} \`5\`` })
                                      .then((m) => {
                                        m.edit({
                                          content: `${user}, \`كم مدة تفاعلك?\``,
                                        });
                                        m.channel
                                          .awaitMessages({
                                            filter,
                                            max: 1,
                                            time: 60 * 1000,
                                            errors: ["الزمن"],
                                          })
                                          .then((m5) => {
                                            m5 = m5.first();
                                            var ask3 = m5.content;
                                            m5.delete();
                                            m.edit({
                                              content: `${user}, ***يتم إرسال البيانات***`,
                                            }).then((mtime) => {
                                              setTimeout(() => {
                                                let embed =
                                                  new Discord.MessageEmbed()
                                                    .setAuthor({
                                                      name: user.tag,
                                                      iconURL: user.avatarURL(),
                                                    })
                                                    .setColor(
                                                      config.bot.color.hex
                                                    )
                                                    .setTitle(
                                                      `\`تقديمك على الإدارة\` \n سوف يتم الرد عليك قريبا من الادارة , \n > ID: ${user.id}`
                                                    )
                                                    .addField(
                                                      "> `إسمك:`",
                                                      ` ** ${name} ** `,
                                                      true
                                                    )
                                                    .addField(
                                                      "> `عمرك:`",
                                                      ` ** ${age} ** `,
                                                      true
                                                    )
                                                    .addField(
                                                      "> `كم لك بالديسكورد:`",
                                                      `** ${ask} ** `,
                                                      true
                                                    )
                                                    .addField(
                                                      "> ` لماذا تريد أن تصبح ضمن طاقم الإدارة:` ",
                                                      ` ** ${ask2} ** `,
                                                      true
                                                    )
                                                    .addField(
                                                      "> `مدة تفاعلك:`",
                                                      ` ** ${ask3} ** `,
                                                      true
                                                    )
                                                    .addField(
                                                      "> __متى تم إنشاء حسابك: __",
                                                      `<t:${Math.floor(
                                                        user.createdTimestamp /
                                                          1000
                                                      )}:R>`,
                                                      true
                                                    );
                                                let donebtn =
                                                  new Discord.MessageButton()
                                                    .setStyle("SUCCESS")
                                                    .setLabel("قبول")
                                                    .setEmoji("✅")
                                                    .setCustomId(
                                                      `done${user.id}`
                                                    );
                                                let undonebtn =
                                                  new Discord.MessageButton()
                                                    .setLabel("رفض")
                                                    .setEmoji("❌")
                                                    .setStyle("DANGER")
                                                    .setCustomId(
                                                      `undone${user.id}`
                                                    );
                                                let donningrow =
                                                  new Discord.MessageActionRow().addComponents(
                                                    donebtn,
                                                    undonebtn
                                                  );
                                                endChannel
                                                  .send({
                                                    embeds: [embed],
                                                    components: [donningrow],
                                                  })
                                                  .then(() => {
                                                    channel.send({
                                                      content:
                                                        "**✅ | تم إرسال طلبك بنجاح**",
                                                    });
                                                  });
                                              }, 2500);
                                              setTimeout(() => {
                                                mtime.delete();
                                              }, 3000);
                                            });
                                          });
                                      });
                                  });
                              });
                          });
                      });
                    });
                });
              });
          });
        });
      }
    }
  },
};
