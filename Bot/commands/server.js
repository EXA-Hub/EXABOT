module.exports = {
  name: "server",
  aliases: [],
  category: "أوامـر عـامـة",
  description: "معلومات السيرفر!",
  // expectedArgs: '',
  // minArgs: 0,
  // maxArgs: 0,
  syntaxError: "",
  permissions: [],
  // cooldown: '',
  // globalCooldown: '',
  hidden: false,
  ownerOnly: false,
  testOnly: false,
  guildOnly: true,
  slash: "both",
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
    function convertHMS(value) {
      const sec = parseInt(value, 10); // convert value to number if it's string
      let hours = Math.floor(sec / 3600); // get hours
      let minutes = Math.floor((sec - hours * 3600) / 60); // get minutes
      let seconds = sec - hours * 3600 - minutes * 60; //  get seconds
      // add 0 if value < 10; Example: 2 => 02
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      return hours + ":" + minutes + ":" + seconds; // Return is HH : MM : SS
    }

    let inviteUsesCount = 0;
    let inviteCount = 0;

    const config = require("../data/config.js");
    const { MessageEmbed } = require("discord.js");
    if (user.bot || !guild) return "للسيرفرات فقط";
    const EMBED = new MessageEmbed()
      .setTimestamp()
      .setThumbnail(guild.iconURL())
      .setColor(config.bot.color.hex)
      .setDescription(
        (guild.description || "لا يوجد وصف للسيرفر") +
          "\n\n الغرف المميزة ⚜" +
          `\n🔇AFK: ${
            guild.afkChannelId
              ? "<#" + guild.afkChannelId + ">"
              : "**غير موجود**"
          } => **${
            guild.afkTimeout ? convertHMS(guild.afkTimeout) : "00:00:00"
          }**` +
          `\n📣غرفة التحديثات العامة: ${
            guild.publicUpdatesChannelId
              ? "<#" + guild.publicUpdatesChannelId + ">"
              : "**غير موجود**"
          }` +
          `\n⚠غرفة القوانين: ${
            guild.rulesChannelId
              ? "<#" + guild.rulesChannelId + ">"
              : "**غير موجود**"
          }` +
          `\n🎫غرفة الترحيب: ${
            guild.systemChannelId
              ? "<#" + guild.systemChannelId + ">"
              : "**غير موجود**"
          }` +
          `\n🎯غرفة نشر السيرفر: ${
            guild.widgetChannelId
              ? "<#" + guild.widgetChannelId + ">"
              : "**غير موجود**"
          } => ${
            guild.widgetEnabled ? guild.widgetEnabled : "**غير موجود**"
          }\n_ _\n_ _`
      )
      .setTitle(`معلومات سيرفر ${guild.name}`)
      .addField("إسم السيرفر 🎫", `${guild.name}`, true)
      .addField("أيدي السيرفر 🔖", `${guild.id}`, true)
      .addField("زعيم السيرفر 👑", `<@!${guild.ownerId}>`, true)
      .addField(
        "الأعضاء 👥",
        `***\`${guild.memberCount}\`*** 🎈${
          guild.large ? "السيرفر يعتبر كبير" : "السيرفر صغير نسبيا"
        }`,
        true
      )
      .addField("الرتب 🗺️", `${guild.roles.cache.size}`, true)
      .addField("الغرف 💬", `${guild.channels.cache.size}`, true)
      .addField("درجة حماية السيرفر 🔒", `${guild.verificationLevel}`, true)
      .addField("عدد الداعمين 💠", `${guild.premiumSubscriptionCount}`, true)
      .addField(
        "عدد الدعوات 📨",
        `📣عدد الدعوات: ${inviteCount}\n✅ مرات الإستخدام: ${inviteUsesCount}`,
        true
      )
      .addField(
        "تاريخ إنشاء السيرفر 📅",
        `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`,
        true
      )
      .setImage(guild.bannerURL({ format: "png", size: 2048 }))
      .setAuthor({
        name: user.tag,
        iconURL: user.avatarURL(),
        url: config.support.server.invite.link,
      })
      .setFooter({
        text: `صاحب الطلب ${user.username}`,
        iconURL: user.avatarURL({ dynamic: true }),
      });

    if (guild.vanityURLCode)
      EMBED.addField(
        "الرابط المخصص 💎",
        `💎الرابط المخصص: https://discord.gg/${guild.vanityURLCode}\n💰مرات الإستخدام: ${guild.vanityURLUses}`
      );
    if (guild.verified)
      EMBED.setTitle = EMBED.title + ` <:Discord_Verified:914252423382569070>`;
    if (guild.partnered)
      EMBED.setTitle = EMBED.title + ` <:Discord_Partner:914252455427067975>`;
    return { custom: true, embeds: [EMBED] };
  },
};
