const config = require("../data/config.js");
const { client } = require("../index");
const Discord = require("discord.js");
const wok = require("wokcommands");
const dataTypes = {
  name: String,
  age: String,
  ask: String,
  ask2: String,
  ask3: String,
};
/**
 *
 * @param {dataTypes} data
 * @param {Discord.User} user
 * @param {Discord.Channel} channel
 * @param {Discord.Channel} endChannel
 */
function sendApply(user, endChannel, channel, data) {
  const { name, age, ask, ask2, ask3 } = data;
  let embed = new Discord.MessageEmbed()
    .setAuthor({
      name: user.tag,
      iconURL: user.avatarURL(),
    })
    .setColor(config.bot.color.hex)
    .setTitle(
      `\`تقديمك على الإدارة\` \n سوف يتم الرد عليك قريبا من الادارة , \n > ID: ${user.id}`
    )
    .addField("> `إسمك:`", ` ** ${name} ** `, true)
    .addField("> `عمرك:`", ` ** ${age} ** `, true)
    .addField("> `كم لك بالديسكورد:`", `** ${ask} ** `, true)
    .addField(
      "> ` لماذا تريد أن تصبح ضمن طاقم الإدارة:` ",
      ` ** ${ask2} ** `,
      true
    )
    .addField("> `مدة تفاعلك:`", ` ** ${ask3} ** `, true)
    .addField(
      "> __متى تم إنشاء حسابك: __",
      `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`,
      true
    );
  let doneBtn = new Discord.MessageButton()
    .setStyle("SUCCESS")
    .setLabel("قبول")
    .setEmoji("✅")
    .setCustomId(`done${user.id}`);
  let undoneBtn = new Discord.MessageButton()
    .setLabel("رفض")
    .setEmoji("❌")
    .setStyle("DANGER")
    .setCustomId(`undone${user.id}`);
  let donningRow = new Discord.MessageActionRow().addComponents(
    doneBtn,
    undoneBtn,
    new Discord.MessageButton()
      .setCustomId("applyButton")
      .setStyle("PRIMARY")
      .setLabel("تقديم")
      .setEmoji("📝")
  );
  endChannel
    .send({
      embeds: [embed],
      components: [donningRow],
    })
    .then(() => {
      if (endChannel.id === channel) return;
      else
        return channel.send({
          content: "**✅ | تم إرسال طلبك بنجاح**",
        });
    });
}
module.exports = {
  name: "قدم",
  aliases: ["قدم", "apply"],
  category: "أوامـر عـامـة",
  description: "للتقديم في المجتمع",
  expectedArgs: "[on/off/channel/role/info/button] [roleId/channelId]",
  minArgs: 0,
  maxArgs: 2,
  syntaxError: "",
  permissions: [],
  cooldown: "6h",
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
          value: "info",
          name: "رؤية_المعلومات",
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
        {
          value: "button",
          name: "إرسال_زر_التقديم",
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
    const db = require("../functions/database");
    const discordModals = require("discord-modals");
    client
      .on("interactionCreate", async (interaction) => {
        if (!interaction.isButton() || !interaction.guild) return;
        const { guild } = interaction;
        if (interaction.customId === "applyButton") {
          const db = require("../functions/database");
          const rolesDataFile = (await db.get("apply_data/roles")) || {};
          if (interaction.member.roles.cache.get(rolesDataFile[guild.id]))
            return interaction.reply({
              content: "**🧐 | أنت بالفعل ضمن طاقم الإدارة**",
              ephemeral: true,
            });
          const modal = new discordModals.Modal()
            .setCustomId("applyModal")
            .setTitle("إستمارة التقديم في خادم " + guild.name)
            .addComponents(
              new discordModals.TextInputComponent()
                .setCustomId("applyName")
                .setLabel("ما هوا إسمك؟")
                .setStyle("SHORT")
                .setMinLength(3)
                .setMaxLength(15)
                .setPlaceholder("إكتب هنا")
                .setRequired(true),
              new discordModals.TextInputComponent()
                .setCustomId("applyAge")
                .setLabel("ما هوا عمرك؟")
                .setStyle("SHORT")
                .setMinLength(1)
                .setMaxLength(4)
                .setPlaceholder("إكتب هنا")
                .setRequired(true),
              new discordModals.TextInputComponent()
                .setCustomId("applyTime")
                .setLabel("متى تم إنشاء حسابك؟")
                .setStyle("SHORT")
                .setMinLength(4)
                .setMaxLength(40)
                .setPlaceholder("إكتب هنا")
                .setRequired(true),
              new discordModals.TextInputComponent()
                .setCustomId("applyReason")
                .setLabel("لماذا تقدم في مجتمعنا بالتحديد؟")
                .setStyle("LONG")
                .setMaxLength(1000)
                .setPlaceholder("إكتب هنا")
                .setRequired(true),
              new discordModals.TextInputComponent()
                .setCustomId("applyOnline")
                .setLabel("كم مدة تفاعلك؟")
                .setStyle("SHORT")
                .setMinLength(4)
                .setMaxLength(40)
                .setPlaceholder("إكتب هنا")
                .setRequired(true)
            );
          return discordModals.showModal(modal, { client, interaction });
        } else if (!interaction.customId.includes("done")) return;
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
            content:
              "❌ | يجب أن تملك صلاحية `ADMINISTRATOR` أو `MANAGE_ROLES`",
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
      })
      .on("modalSubmit", async (modal) => {
        if (!modal.guild || modal.customId !== "applyModal") return;
        const { guild } = modal;
        const db = require("../functions/database");
        const rolesDataFile = (await db.get("apply_data/roles")) || {};
        await modal.deferReply({ ephemeral: true });
        if (modal.member.roles.cache.get(rolesDataFile[guild.id]))
          return modal.followUp("**🧐 | أنت بالفعل ضمن طاقم الإدارة**");
        const name = modal.getTextInputValue("applyName");
        const age = modal.getTextInputValue("applyAge");
        const ask = modal.getTextInputValue("applyTime");
        const ask2 = modal.getTextInputValue("applyReason");
        const ask3 = modal.getTextInputValue("applyOnline");
        const data = { name, age, ask, ask2, ask3 };
        const channelsDataFile = (await db.get("apply_data/channels")) || {};
        const endChannel = guild.channels.cache.get(channelsDataFile[guild.id]);
        if (!endChannel)
          return modal.followUp("**× حدث خطأ أثناء إرسال المعلومات ×**");
        modal
          .followUp(`**مبروك! تم تقديمك بنجاح ✅. \`\`\`${name}\`\`\`**`)
          .then(() => sendApply(modal.user, endChannel, modal.channel, data));
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
    const db = require("../functions/database");
    const wrongembed = new Discord.MessageEmbed()
      .addField(`\`${message ? prefix : "/"}apply\``, "للتقديم", false)
      .addField(
        `\`${message ? prefix : "/"}apply info\``,
        "رؤية معلومات التقديم",
        false
      )
      .addField(
        `\`${message ? prefix : "/"}apply button\``,
        "إرسال زر التقديم",
        false
      )
      .addField(
        `\`${message ? prefix : "/"}apply <on/off>\``,
        "فتح وإغلاق التقديم",
        false
      )
      .addField(
        `\`${message ? prefix : "/"}apply role <role>\``,
        "تحديد رتبة التقديم",
        false
      )
      .addField(
        `\`${message ? prefix : "/"}apply channel <channel>\``,
        "تحديد قناة التقديم",
        false
      )
      .setURL(config.support.server.invite.link)
      .setColor("RED")
      .setTitle(`إستخدام خطأ للأمر: ${message ? prefix : "/"}apply`);
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
        const targetedChannel = message
          ? guild.channels.cache.get(args[1]) ||
            guild.channels.cache.find(
              (channel) => channel.name.toLowerCase() === args[1]
            ) ||
            message.mentions.channels.first() ||
            channel
          : interaction.options.getChannel("غرفة");
        if (!targetedChannel || targetedChannel.type !== "GUILD_TEXT")
          return "**👀 | لم أصل للقناة**";
        if (!guild.channels.cache.get(targetedChannel.id))
          return "**❌ | لا يمكنك إستعمال قنوات من سيرفرات أخرى**";
        targetedChannel
          .send(
            `\\✅ | <#${targetedChannel.id}>\n**تم الوصول للقناة وجاري تدوين المعلومات**`
          )
          .then((msg) => {
            if (channelsDataFile[guild.id] == targetedChannel.id) {
              delete channelsDataFile[guild.id];
              db.set("apply_data/channels", channelsDataFile);
              msg.edit("**✅ | تم حذف قناة التقديم**");
            } else {
              channelsDataFile[guild.id] = targetedChannel.id;
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
      } else if (args[0] == "button") {
        if (
          !onOffDataFile ||
          !onOffDataFile[guild.id] ||
          onOffDataFile[guild.id] == "off"
        )
          return `**❌ | التقديم مغلق حاليا**`;
        if (!rolesDataFile[guild.id])
          return (
            "**⁉ | يرجى تحديد رتبة التقديم**\n`" +
            `${message ? prefix : "/"}` +
            "apply role <role>`"
          );
        if (!channelsDataFile[guild.id])
          return (
            "**يرجى تحديد قناة إستقبال طلبات التقديم**\n`" +
            `${message ? prefix : "/"}` +
            "apply channel <channel>`"
          );
        if (interaction)
          interaction.reply({ content: "**👍 | جار بدأ التحقيق**" });
        const row = new Discord.MessageActionRow().addComponents(
          new Discord.MessageButton()
            .setCustomId("applyButton")
            .setStyle("PRIMARY")
            .setLabel("تقديم")
            .setEmoji("📝")
        );
        const applyEmbed = new Discord.MessageEmbed()
          .setColor(config.bot.color.hex)
          .setTitle("التقديم في المجتمع")
          .setAuthor({
            name: guild.name,
            iconURL:
              guild.iconURL({ dynamic: true }) ||
              client.user.avatarURL({ dynamic: true }),
          });
        channel.send({
          embeds: [applyEmbed],
          components: [row],
        });
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
        return (
          "**⁉ | يرجى تحديد رتبة التقديم**\n`" +
          `${message ? prefix : "/"}` +
          "apply role <role>`"
        );
      if (!channelsDataFile[guild.id])
        return (
          "**يرجى تحديد قناة إستقبال طلبات التقديم**\n`" +
          `${message ? prefix : "/"}` +
          "apply channel <channel>`"
        );
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
                dispose: true,
                time: 60 * 1000,
                idle: 60 * 1000,
                errors: ["الزمن"],
              })
              .then((m1) => {
                m1 = m1.first();
                if (!m1 || !m1.content) return;
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
                      dispose: true,
                      time: 60 * 1000,
                      idle: 60 * 1000,
                      errors: ["الزمن"],
                    })
                    .then((m2) => {
                      m2 = m2.first();
                      if (!m2 || !m2.content) return;
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
                            dispose: true,
                            time: 60 * 1000,
                            idle: 60 * 1000,
                            errors: ["الزمن"],
                          })
                          .then((m3) => {
                            m3 = m3.first();
                            if (!m3 || !m3.content) return;
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
                                    dispose: true,
                                    time: 60 * 1000,
                                    idle: 60 * 1000,
                                    errors: ["الزمن"],
                                  })
                                  .then((m4) => {
                                    m4 = m4.first();
                                    if (!m4 || !m4.content) return;
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
                                            dispose: true,
                                            time: 60 * 1000,
                                            idle: 60 * 1000,
                                            errors: ["الزمن"],
                                          })
                                          .then((m5) => {
                                            m5 = m5.first();
                                            if (!m5 || !m5.content) return;
                                            var ask3 = m5.content;
                                            m5.delete();
                                            m.edit({
                                              content: `${user}, ***يتم إرسال البيانات***`,
                                            }).then((mtime) => {
                                              setTimeout(() => {
                                                sendApply(
                                                  user,
                                                  endChannel,
                                                  channel,
                                                  { name, age, ask, ask2, ask3 }
                                                );
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
