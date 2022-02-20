const { Client, MessageEmbed } = require("discord.js");
const takeCoins = require("../functions/takeCoins");
const { ICallbackObject } = require("wokcommands");
const getCoins = require("../functions/getCoins");
const db = require("../functions/database");
const config = require("../data/config");
module.exports = {
  name: "thx",
  aliases: [],
  category: "أوامـر عـامـة",
  description: "التشكرات",
  expectedArgs: "<top/to> <عضو/guild/all> [رقم]",
  minArgs: 1,
  maxArgs: 3,
  syntaxError: "× خطأ ×",
  permissions: [],
  cooldown: "5s",
  // globalCooldown: '',
  hidden: false,
  ownerOnly: false,
  testOnly: false,
  guildOnly: true,
  slash: "both",
  options: [
    {
      name: "to",
      description: "شكر عضو ما",
      type: 1,
      options: [
        {
          name: "العضو",
          description: "شكر هذا العضو",
          required: true,
          type: 6,
        },
      ],
    },
    {
      name: "top",
      description: "شكر عضو ما",
      type: 1,
      options: [
        {
          name: "نوع",
          description: "نوع القائمة",
          required: true,
          type: 3,
          choices: [
            {
              name: "كل_الأعضاء",
              value: "all",
            },
            {
              name: "المجتمع",
              value: "guild",
            },
          ],
        },
        {
          name: "عدد_الأعضاء",
          description: "عدد الأعضاء في القائمة",
          required: false,
          type: 10,
        },
      ],
    },
  ],
  /**
   *
   * @param {Client} client
   */
  init: (client, instance) => {},
  /**
   * @param {ICallbackObject} ICallbackObject
   *
   */ callback: async ({
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
    const type = interaction ? interaction.options.getSubcommand() : args[0];
    if (type === "to") {
      const thxMember = interaction
        ? interaction.options.getMember("العضو")
        : message.mentions.members.first() ||
          guild.members.cache.get(args[1]) ||
          guild.members.cache.find((member) => member.displayName === args[1]);
      if (!thxMember) return "**❌ | يرجى تحديد العضو**";
      let thxData = (await db.get("thx")) || {};
      if ((await getCoins(user.id)) < 50)
        return "**❌ | لا تمتلك عدد كافي من العملات**";
      await takeCoins(user.id, 50);
      if (thxData[thxMember.id]) {
        thxData[thxMember.id] = Math.floor(thxData[thxMember.id] + 1);
        db.set("thx", thxData);
        return `**✅ | تم شكر <@!${thxMember.id}> بنجاح**\n||خصم من رصيدك مقدار \`50\` عملة||`;
      } else {
        thxData[thxMember.id] = 1;
        db.set("thx", thxData);
        return `**✅ | تم شكر <@!${thxMember.id}> بنجاح**\n||خصم من رصيدك مقدار \`50\` عملة||`;
      }
    } else if (type === "top") {
      const topType = interaction
        ? interaction.options.getString("نوع")
        : args[1];
      const topNum =
        parseInt(
          interaction ? interaction.options.getNumber("عدد_الأعضاء") : args[2]
        ) || 5;
      if (isNaN(topNum) || topNum > 10 || topNum < 1)
        return "**❌ | أختر رقم صحيح وأقل من `10`**";
      const thxData =
        topType === "guild"
          ? Object.fromEntries(
              Object.entries(await db.get("thx")).filter(([key, value]) =>
                guild.members.cache.has(key)
              )
            )
          : await db.get("thx");
      if (Object.keys(thxData).length < topNum)
        return `**❌ | أختر رقم صحيح وأقل من \`${
          Object.keys(thxData).length
        }\`**`;
      const pickHighest = require("../functions/pickHighest");
      const top = pickHighest(thxData, topNum);
      const embed = new MessageEmbed()
        .setTitle("أفضل الأعضاء 🌟")
        .setColor(config.bot.color.hex);
      Object.entries(top).forEach(([key, value], index) => {
        const member = client.users.cache.get(key) || { tag: "غير معروف" };
        embed.addField(
          `${index > 0 ? "🔰" : "👑"} ${member.tag}`,
          `❤ التشكرات: **\`${value}\`**`,
          false
        );
      });
      return { custom: true, embeds: [embed] };
    } else return "**❌ | أمر غير معروف**";
  },
};
