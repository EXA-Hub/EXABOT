const { client } = require("../index");
const { MessageEmbed } = require("discord.js");
const { ICallbackObject } = require("wokcommands");
module.exports = {
  name: "backupServer",
  aliases: ["backup"],
  category: "الإداريـة",
  description: "حفظ المجتمع بالكامل من حيث رتب وغرف ورسائل",
  expectedArgs: "<info/create/load> [معرف حافظة]",
  minArgs: 1,
  maxArgs: 2,
  syntaxError: "× خطأ ×",
  permissions: ["ADMINISTRATOR", "MANAGE_MESSAGES"],
  // cooldown: '',
  globalCooldown: "30m",
  hidden: false,
  ownerOnly: true,
  testOnly: false,
  guildOnly: true,
  slash: "both",
  options: [
    {
      name: "create",
      description: "صنع حافظة جديدة لمجتمعك",
      type: 1,
    },
    {
      name: "info",
      description: "التعرف على حافظة ما",
      type: 1,
      options: [
        {
          name: "المعرف",
          description: "معرف الحافظة المطلوبة",
          required: true,
          type: 3,
        },
      ],
    },
    {
      name: "load",
      description: "إستدعاء وحذف حافظة ما",
      type: 1,
      options: [
        {
          name: "المعرف",
          description: "معرف الحافظة المطلوبة",
          required: true,
          type: 3,
        },
      ],
    },
  ],
  /**
   *
   * @param {client} client
   */
  init: (client, instance) => {},
  /**
   * @param {ICallbackObject} ICallbackObject
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
    const { backup } = client;
    const cmdType = message ? args[0] : interaction.options.getSubcommand();
    const backupID = message
      ? args[1]
      : interaction.options.getString("المعرف");
    if (!cmdType) return "**❌ | أمر خطأ**";
    else {
      if (interaction) interaction.reply("**▶ | جار التشغيل**");
      channel
        .send({ content: `**${client.emotes.loading} | يرجى الإنتظار**` })
        .then((msg) => {
          switch (cmdType) {
            case "create":
              backup
                .create(guild)
                .then((backupData) => {
                  return channel.send({
                    content: `تم الإنشاء! معرف الحافظة: \`${
                      backupData.id
                    }\`! إستخدم \`${
                      message
                        ? instance.getPrefix(guild) || client.config.prefix
                        : "/"
                    }backup load ${
                      backupData.id
                    }\` لإستدعاء الحافظة في خادم آخر!`,
                  });
                })
                .catch(() => {
                  return channel
                    .send({
                      content:
                        "**❌ | حدث خطأ ما الرجاء إعطاء البوت الصلاحيات المطلوبة `ADMINISTRATOR`!**",
                    })
                    .finally(() => msg.delete());
                });
              break;
            case "info":
              if (!backupID)
                return msg.edit({ content: "**❌ | معرف غير معروف**" });
              backup
                .fetch(backupID)
                .then((backup) => {
                  const date = new Date(backup.data.createdTimestamp);
                  const yyyy = date.getFullYear().toString(),
                    mm = (date.getMonth() + 1).toString(),
                    dd = date.getDate().toString();
                  const formattedDate = `${yyyy}/${mm[1] ? mm : "0" + mm[0]}/${
                    dd[1] ? dd : "0" + dd[0]
                  }`;
                  const embed = new MessageEmbed()
                    .setAuthor({
                      name: "ℹ️ الحافظة",
                      iconURL: backup.data.iconURL,
                    })
                    .addField("إسم الخادم", backup.data.name)
                    .addField("الحجم", backup.size + " kb")
                    .addField("تاريخ الإنشاء", formattedDate)
                    .setColor(client.config.bot.color.hex)
                    .setFooter({ text: "معرف الحافظة: " + backup.id });
                  return channel.send({ embeds: [embed] });
                })
                .catch((err) => {
                  if (err === "No backup found")
                    return channel.send({
                      content:
                        "**❌ لا بوجد حافظ بهذا المعرف `" + backupID + "`!**",
                    });
                  else
                    return channel.send(
                      "❌ × خطأ ×: " + (typeof err === "string")
                        ? err
                        : JSON.stringify(err)
                    );
                })
                .finally(() => msg.delete());
              break;
            case "load":
              if (!backupID)
                return msg.edit({ content: "**❌ | معرف غير معروف**" });
              backup
                .fetch(backupID)
                .then(() => {
                  channel.send({
                    content:
                      "⚠️ كل الرتب والغرف والإعدادات سيتم حذهفها. هل أنت متأكد من الإستمرار? أرسل `-تأكيد` أو `إلغاء`!",
                  });
                  const collector = channel.createMessageCollector({
                    filter: (m) =>
                      m.author.id === user.id &&
                      ["-تأكيد", "إلغاء"].includes(m.content),
                    time: 60000,
                    max: 1,
                  });
                  collector.on("collect", (m) => {
                    const confirm = m.content === "-تأكيد";
                    collector.stop();
                    if (confirm) {
                      backup
                        .load(backupID, guild)
                        .then(() => {
                          return user.send({
                            content: "**✅ | تم تحميل الحافظة بنجاح!**",
                          });
                        })
                        .catch((err) => {
                          if (err === "No backup found")
                            return channel.send({
                              content:
                                "**❌ لا بوجد حافظ بهذا المعرف `" +
                                backupID +
                                "`!**",
                            });
                          else
                            return channel.send(
                              "❌ × خطأ ×: " + (typeof err === "string")
                                ? err
                                : JSON.stringify(err)
                            );
                        });
                    } else {
                      return channel.send({ content: "**❌ تم الإلغاء.**" });
                    }
                  });
                  collector.on("end", (collected, reason) => {
                    if (reason === "time")
                      return channel.send({
                        content:
                          "**❌ إنتهى الوقت! حاول مجددا المرة القادمة.**",
                      });
                  });
                })
                .catch(() => {
                  return channel.send({
                    content:
                      "**❌ لا بوجد حافظ بهذا المعرف `" + backupID + "`!**",
                  });
                })
                .finally(() => msg.delete());
              break;
            default:
              msg.edit({ content: "**❌ | أمر خطأ**" });
              break;
          }
        });
    }
  },
};
