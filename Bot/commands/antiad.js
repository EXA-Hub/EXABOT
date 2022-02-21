module.exports = {
  name: "antiad",
  aliases: [],
  category: "الإعـدادات",
  description: "التحكم في إعدادات مانع الدعوات",
  expectedArgs: "<on/off/info/allowed> [@role]",
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
          value: "info",
          name: "رؤية_المعلومات",
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
    const config = require("../data/config.js");
    const db = require("../functions/database");
    const wrongembed = new MessageEmbed()
      .setColor("RED")
      .setURL(config.support.server.invite.link)
      .addField(
        `\`${message ? prefix : "/"}antiad info\``,
        "رؤية معلومات مانع الدعوات",
        false
      )
      .addField(
        `\`${message ? prefix : "/"}antiad <on/off>\``,
        "تشغيل وإيقاف مانع من الدعوات",
        false
      )
      .addField(
        `\`${message ? prefix : "/"}antiad allowed <role>\``,
        "تحديد الرتب المسموح لها بنشر الدعوات",
        false
      )
      .setTitle(`إستخدام خطأ للأمر: ${message ? prefix : "/"}antiad`);
    if (!args[0]) return { custom: true, embeds: [wrongembed] };
    if (args[0]) {
      const saveData = async (saved, path) => {
        var datafile = (await db.get(path)) || {};
        datafile[guild.id] = saved;
        db.set(path, datafile);
        return Promise.resolve();
      };
      const onoffpath = "antiad-on-off";
      if (args[0] === "on") {
        saveData(args[0], onoffpath);
        return `**✅ | تم تفعيل مانع الدعوات**`;
      } else if (args[0] === "off") {
        saveData(args[0], onoffpath);
        return `**❎ | تم إلغاء تفعيل مانع الدعوات**`;
      } else if (args[0] === "allowed") {
        const role = message
          ? guild.roles.cache.get(args[1]) ||
            guild.roles.cache.find(
              (role) => role.name.toLowerCase() === args[1]
            ) ||
            message.mentions.roles.first()
          : interaction.options.getRole("رتبة");
        if (!role) return "**لم أصل للرتبة**";
        if (!guild.roles.cache.get(role.id))
          return "**❌ | لا يمكنك إستعمال رتب من سيرفرات أخرى**";
        const ID = role.id;
        let willsave;
        const allowedpath = "antiad_protection";
        const alloweddatafile =
          (await db.get(allowedpath + `/${args[0]}`)) || {};
        const checkarray = alloweddatafile[guild.id];
        if (!alloweddatafile[guild.id]) {
          willsave = [ID];
          return `✅ | تم السماح لرتبة ${role} بنشر الدعوات`;
        }
        if (alloweddatafile[guild.id]) {
          if (checkarray.indexOf(ID) !== -1) {
            const willfilter = alloweddatafile[guild.id];
            const filtered = willfilter.filter((filtering) => filtering !== ID);
            willsave = filtered;
            return `❎ | تم إلغاء السماح لرتبة ${role} بنشر الدعوات`;
          } else {
            const willedit = alloweddatafile[guild.id];
            willedit.push(ID);
            willsave = willedit;
            return `✅ | تم السماح لرتبة ${role} بنشر الدعوات`;
          }
        }
        const allowedIDs = (alloweddatafile[guild.id] = willsave);
        saveData(allowedIDs, allowedpath + `/${args[0]}`);
      } else if (args[0] === "info") {
        const allowed = (await db.get("antiad_protection/allowed")) || {};
        const working = (await db.get("antiad-on-off")) || {};
        let roles;
        if (allowed[guild.id]) {
          allowed[guild.id].forEach((roleID) => {
            if (!roles) return (roles = `• <@&${roleID}> •`);
            roles = roles + `• <@&${roleID}> •`;
          });
        }
        const infoembed = new MessageEmbed()
          .setURL(config.support.server.invite.link)
          .setTitle(`إستخدام خطأ للأمر: ${message ? prefix : "/"}antiad`)
          .addField(`مانع الدعوات:`, `${working[guild.id]} حاليا`, true)
          .addField(`الرتب المسموح لها:`, roles || "لا توجد رتب", true)
          .setTitle(`معلومات مانع الدعوات في السيرفر`);
        return { custom: true, embeds: [infoembed] };
      } else return { custom: true, embeds: [wrongembed] };
    }
  },
};
