module.exports = {
  name: "ping",
  aliases: [],
  category: "أوامـر عـامـة",
  description: "سرعة إتصال البوت",
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
    const config = require("../data/config.js");
    const userping =
      Date.now() -
      (message ? message.createdTimestamp : interaction.createdTimestamp);
    const botping = Math.round(client.ws.ping);
    const bothping = userping + botping;
    let connection = "⚡ | جودة خرافية";
    if (Number(bothping) > 10) connection = "🔰 | جودة جيدة جدا";
    if (Number(bothping) > 200) connection = "👍 | جودة جيدة";
    if (Number(bothping) > 500) connection = "⁉ | جودة سيئة";
    if (Number(bothping) > 1000) connection = "💢 | جودة سيئة جدا";
    if (Number(bothping) > 10000) connection = "🚧 | جودة بنت كلب";
    const { MessageEmbed } = require("discord.js");
    const pingembed = new MessageEmbed()
      .setTimestamp()
      .setColor(config.bot.color.hex)
      .setTitle("سرعة إتصال البوت 📡")
      .addField("📶 جودة الإتصال", connection || "😴 | جودة غير معرفة")
      .setDescription(
        "🤖 سرعة إتصال البوت: **" +
          botping +
          "** مللي ثانية" +
          "\n" +
          "📥 سرعة وصول المعلومات: **" +
          userping +
          "** مللي ثانية" +
          "\n" +
          `\↔️ سرعة التواصل: **` +
          bothping +
          "** مللي ثانية"
      );
    return {
      custom: true,
      embeds: [pingembed],
      allowedMentions: { repliedUser: false },
    };
  },
};
