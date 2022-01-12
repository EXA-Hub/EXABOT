module.exports = {
  name: "partner-info",
  aliases: ["pi"],
  category: "أوامـر عـامـة",
  description: "معلومات الشراكة في السيرفر",
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
    const config = require("../data/config");
    const db = require("../functions/database");
    const { MessageEmbed } = require("discord.js");
    const request = (await db.get("partner_requests")) || {};
    const channels = (await db.get("partner_channels")) || {};
    const role = (await db.get("partner_roles")) || {};
    const partner_message = (await db.get("partner_message")) || {};
    const partnerinfoembed = new MessageEmbed()
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.avatarURL({ dynamic: true }),
        url: config.support.server.invite.link,
      })
      .setDescription(
        `<#${request[guild.id]}> **روم طلبات الشراكة**\n<#${
          channels[guild.id]
        }> **روم إعلانات ونشر الشراكة**\n<@&${
          role[guild.id]
        }> **رتبة الشركاء**\n**رسالة الشراكة:**\n\`\`\`${
          partner_message[guild.id]
        }\`\`\``
      )
      .setTimestamp()
      .setColor(config.bot.color.hex)
      .setFooter({
        text: user.tag,
        iconURL: user.avatarURL({ dynamic: true }),
      });
    return {
      custom: true,
      embeds: [partnerinfoembed],
      allowedMentions: { repliedUser: false },
    };
  },
};
