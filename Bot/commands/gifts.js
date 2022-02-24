const { Client } = require("discord.js");
const getCoins = require("../functions/getCoins");
const { ICallbackObject } = require("wokcommands");
const giveCoins = require("../functions/giveCoins");
const takeCoins = require("../functions/takeCoins");
module.exports = {
  name: "gifts",
  aliases: ["gift"],
  category: "أوامـر عـامـة",
  description: "الحصول على هدية مجانا بإستعمال رمز خاص",
  expectedArgs: "<رمز الهدية/add> [هدية خاصة بك] [رمز الهدية]",
  minArgs: 1,
  maxArgs: 3,
  syntaxError: "× خطأ ×",
  permissions: [],
  cooldown: "1h",
  // globalCooldown: '',
  hidden: false,
  ownerOnly: false,
  testOnly: false,
  guildOnly: true,
  slash: "both",
  options: [
    {
      name: "رمز",
      description: "رمز الهدية الخاصة بك",
      required: true,
      type: 3,
    },
    {
      name: "هدية_جديدة",
      description: "الهدية الجديدة على حسابك",
      required: false,
      type: 4,
    },
    {
      name: "رمز_الهدية_الجديدة",
      description: "رمز الهدية الجديدة",
      required: false,
      type: 3,
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
    const db = require("../functions/database");
    let { gifts } = (await db.get("gifts")) || {};
    if (!gifts) gifts = [];
    const giftCode = message ? args[0] : interaction.options.getString("رمز");
    if (giftCode === "add") {
      const gift = message
        ? parseInt(args[1])
        : interaction.options.getInteger("هدية_جديدة");
      const coins = await getCoins(user.id);
      if (isNaN(gift) || coins < gift || gift < 0) return "**❌ | هدية خطأ**";
      const code = message
        ? args[2]
        : interaction.options.getInteger("رمز_الهدية_الجديدة");
      if (!code || gifts.find((gift) => gift.code === code) || code === "add")
        return "**❌ | رمز خطأ**";
      await takeCoins(user.id, gift);
      gifts.push({ gift, code });
      await db.set("gifts", { gifts });
      return `😇 مبروك لقد أضفت \`${gift}\`🪙 عملة ذهبية 🥳`;
    } else {
      const gift = gifts.find((gift) => gift.code === giftCode);
      if (!gift) return "**❌ | رمز خطأ**";
      gifts = gifts.filter((gift) => gift.code !== giftCode);
      await db.set("gifts", { gifts });
      await giveCoins(user.id, gift.gift);
      return `😇 مبروك حصلت على \`${gift.gift}\`🪙 عملة ذهبية 🥳`;
    }
  },
};
