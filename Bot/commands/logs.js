module.exports = {
  name: "logs",
  aliases: ["log"],
  category: "الإعـدادات",
  description: "التحكم في إعدادات التدوين",
  expectedArgs: "<on/off/info/channel> [channel]",
  minArgs: 1,
  maxArgs: 2,
  syntaxError: "",
  permissions: ["ADMINISTRATOR"],
  cooldown: "5s",
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
      required: true,
      type: 3,
      choices: [
        {
          name: "رؤية_المعلومات_عن_التدوين",
          value: "info",
        },
        {
          value: "on",
          name: "تشغيل_التدوين",
        },
        {
          value: "off",
          name: "إيقاف_التدوين",
        },
        {
          value: "channel",
          name: "إضافة_غرفة_التدوين",
        },
      ],
    },
    {
      name: "غرفة",
      description: "إضافة غرفة التدوين",
      required: false,
      type: 7,
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
    const db = require("../functions/database");
    const { MessageEmbed } = require("discord.js");
    const config = require("../data/config");
    const wrongembed = new MessageEmbed()
      .setColor("RED")
      .setURL(config.support.server.invite.link)
      .addField(
        `\`${message ? prefix : "/" + "logs"} info\``,
        "رؤية معلومات التدوين",
        false
      )
      .addField(
        `\`${message ? prefix : "/" + "logs"} <on/off>\``,
        "تشغيل وإيقاف التدوين",
        false
      )
      .addField(
        `\`${message ? prefix : "/" + "logs"} channel <channel>\``,
        "تحديد قناة تدوين المعلومات",
        false
      )
      .setTitle(`إستخدام خطأ للأمر: ${message ? prefix : "/" + "logs"}`);
    if (!args[0]) return { custom: true, embeds: [wrongembed] };
    if (!member.permissions.has("ADMINISTRATOR"))
      return "❌ | لا تمتلك صلاحية `ADMINISTRATOR`";
    if (args[0]) {
      const saveData = async (saved, path) => {
        const datafile = (await db.get(path)) || {};
        const ID = guild.id;
        datafile[ID] = saved;
        db.set(path, datafile);
        return Promise.resolve();
      };
      const onoffpath = "logs_on-off";
      if (args[0] === "on") {
        saveData(args[0], onoffpath);
        return `**✅ | تم تفعيل المدون**`;
      } else if (args[0] === "off") {
        saveData(args[0], onoffpath);
        return `**❎ | تم إلغاء تفعيل المدون**`;
      } else if (args[0] === "channel") {
        const selectedChannel = message
          ? guild.channels.cache.get(args[1]) ||
            message.mentions.channels.first() ||
            selectedChannel
          : interaction.options.getChannel("غرفة");
        if (!selectedChannel || selectedChannel.type !== "GUILD_TEXT")
          return "💢 | لا يمكن تحديد القناة";
        if (!guild.channels.cache.get(selectedChannel.id))
          return "❌ | لا يمكن إستخدام قنوات من مجتمعات أخرى";
        const logsChannelsData = (await db.get("logs_channels")) || {};
        const willSave = selectedChannel.id;
        const saveChannel = () => {
          const logsChannelPath = "logs_channels";
          selectedChannel.send({
            content: `> هنا قناة تدوين المعلومات عن المجتمع`,
          });
          saveData(willSave, logsChannelPath);
          return `> **قناة التدوين => ${selectedChannel}**`;
        };
        if (logsChannelsData[guild.id]) {
          if (logsChannelsData[guild.id] == willSave) {
            const deleteData = async () => {
              var datafile = (await db.get("logs_channels")) || {};
              if (!datafile[guild.id]) return "🙄 | لا توجد قناة لحذفها";
              delete datafile[guild.id];
              db.set("logs_channels", datafile);
              return Promise.resolve();
            };
            deleteData();
            return `تم حذف قناة التدوين ${selectedChannel}`;
          } else if (logsChannelsData[guild.id] !== willSave) {
            return saveChannel();
          } else
            return (
              "1× حدث خطأ أثناء تدوين المعلومات ×\nيرجى التواصل مع الإدارة\n" +
              config.support.server.invite.link
            );
        } else if (!logsChannelsData[guild.id]) {
          return saveChannel();
        } else
          return (
            "2× حدث خطأ أثناء تدوين المعلومات ×\nيرجى التواصل مع الإدارة\n" +
            config.support.server.invite.link
          );
      } else if (args[0] === "info") {
        const working = (await db.get("logs_on-off")) || {};
        const logChannel = (await db.get("logs_channels")) || {};
        const channel = logChannel[guild.id]
          ? guild.channels.cache.get(logChannel[guild.id])
          : "لا توجد قناة لتدوين المعلومات";
        const infoembed = new MessageEmbed()
          .setColor(config.bot.color.hex)
          .setURL(config.support.server.invite.link)
          .addField(`التدوين:`, `${working[guild.id]} حاليا`, true)
          .addField(`قناة تدوين المعلومات:`, `${channel} حاليا`, true)
          .setTitle(`معلومات التدوين في السيرفر`);
        return {
          custom: true,
          embeds: [infoembed],
          allowedMentions: { repliedUser: false },
        };
      } else return { custom: true, embeds: [wrongembed] };
    }
  },
};
