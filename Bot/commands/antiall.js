module.exports = {
  name: "antiall",
  aliases: [],
  category: "الإعـدادات",
  description: "التحكم في إعدادات الحماية بالكامل",
  expectedArgs: "<on/off/info/allowed> [@role]",
  minArgs: 1,
  maxArgs: 2,
  syntaxError: "",
  permissions: ["ADMINISTRATOR"],
  cooldown: "15s",
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
          name: "رؤية_المعلومات",
          value: "info",
        },
        {
          value: "on",
          name: "تشغيل_الحماية",
        },
        {
          value: "off",
          name: "إيقاف_الحماية",
        },
        {
          value: "allowed",
          name: "إضافة_رتبة_للحماية",
        },
      ],
    },
    {
      name: "رتبة",
      description: "إضافة رتبة لتخطي الحماية",
      required: false,
      type: 8,
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
    const { MessageEmbed } = require("discord.js");
    const config = require("../data/config");
    const db = require("../functions/database");
    const wrongembed = new MessageEmbed()
      .setColor("RED")
      .setURL(config.support.server.invite.link)
      .addField(
        `\`${message ? prefix : "/"}antiall info\``,
        "رؤية معلومات حماية",
        false
      )
      .addField(
        `\`${message ? prefix : "/"}antiall <on/off>\``,
        "تشغيل وإيقاف الحماية",
        false
      )
      .addField(
        `\`${message ? prefix : "/"}antiall allowed <role>\``,
        "تحديد الرتب المسموح لها",
        false
      )
      .setTitle(`إستخدام خطأ للأمر: ${message ? prefix : "/"}antiall`);
    if (!args[0]) return channel.send({ embeds: [wrongembed] });
    if (args[0]) {
      const saveData = async (saved, path) => {
        var datafile = (await db.get(path)) || {};
        datafile[guild.id] = saved;
        db.set(path, datafile);
        return Promise.resolve();
      };
      const all = [
        {
          name: "مانع الروابط",
          onOffPath: "antilink-on-off",
          rolePath: "antilink_protection/allowed",
          path: "antilink_protection/",
        },
        {
          name: "مانع الإزعاج",
          onOffPath: "antispam-on-off",
          rolePath: "antispam_protection/allowed",
          path: "antispam_protection/",
        },
        {
          name: "مانع الدعاية",
          onOffPath: "antiad-on-off",
          rolePath: "antiad_protection/allowed",
          path: "antiad_protection/",
        },
      ];
      if (args[0] === "on") {
        all.forEach((x) => {
          saveData(args[0], x.onOffPath).then(
            channel.send({ content: `**✅ | تم تفعيل ${x.name}**` })
          );
        });
        return "**👍 | تم تنفيذ العملية**";
      } else if (args[0] === "off") {
        all.forEach((x) => {
          saveData(args[0], x.onOffPath).then(
            channel.send({ content: `**✅ | تم إلغاء تفعيل ${x.name}**` })
          );
        });
        return "**👍 | تم تنفيذ العملية**";
      } else if (args[0] === "allowed") {
        const role = message
          ? guild.roles.cache.get(args[1]) ||
            guild.roles.cache.find(
              (role) => role.name.toLowerCase() === args[1]
            ) ||
            message.mentions.roles.first()
          : interaction.options.getRole("رتبة");
        if (!role) return channel.send({ content: "**👀 | لم أصل للرتبة**" });
        if (!guild.roles.cache.get(role.id))
          return channel.send({
            content: "**❌ | لا يمكنك إستعمال رتب من سيرفرات أخرى**",
          });
        const ID = role.id;
        all.forEach(async (x) => {
          let willsave;
          const alloweddatafile = (await db.get(x.rolePath)) || {};
          const checkarray = alloweddatafile[guild.id];
          if (!alloweddatafile[guild.id]) {
            willsave = [ID];
            channel.send({
              content: `**✅ | تم السماح لرتبة ${role} ب${x.name}**`,
            });
          }
          if (alloweddatafile[guild.id]) {
            if (checkarray.indexOf(ID) !== -1) {
              const willfilter = alloweddatafile[guild.id];
              const filtered = willfilter.filter(
                (filtering) => filtering !== ID
              );
              willsave = filtered;
              channel.send({
                content: `**❎ | تم إلغاء السماح لرتبة ${role} بـ${x.name}**`,
              });
            } else {
              const willedit = alloweddatafile[guild.id];
              willedit.push(ID);
              willsave = willedit;
              channel.send({
                content: `**✅ | تم السماح لرتبة ${role} ب${x.name}**`,
              });
            }
          }
          const allowedIDs = (alloweddatafile[guild.id] = willsave);
          saveData(allowedIDs, x.rolePath);
        });
        return "**👍 | تم تنفيذ العملية**";
      } else {
        channel.send({ embeds: [wrongembed] });
        return "**👍 | تم تنفيذ العملية**";
      }
    }
  },
};
