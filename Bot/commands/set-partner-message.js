module.exports = {
  name: "set-partner-message",
  aliases: ["spm"],
  category: "الإعـدادات",
  description: "تحديد رسالة الشراكة للسيرفر",
  expectedArgs: "<الرسالة>",
  minArgs: 1,
  maxArgs: -1,
  syntaxError: "",
  permissions: ["ADMINISTRATOR"],
  cooldown: "31s",
  // globalCooldown: '',
  hidden: false,
  ownerOnly: false,
  testOnly: false,
  guildOnly: true,
  slash: "both",
  options: [],
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
    if (interaction) interaction.reply({ content: "**يرجى إرسال الرسالة**" });
    else channel.send({ content: "**يرجى إرسال الرسالة**" });
    const db = require("../functions/database");
    const filter = (msg) => msg.author == user;
    channel
      .awaitMessages({ filter, max: 1, time: 60 * 1000, errors: ["الزمن"] })
      .then(async (m1) => {
        m1 = m1.first();
        const arg = m1.content;
        const datafile = (await db.get("partner_message")) || {};
        datafile[guild.id] = arg;
        db.set("partner_message", datafile);
        channel.send({ content: "**✅ | تم تحديد رسالة الشراكاء**" });
      });
  },
};
