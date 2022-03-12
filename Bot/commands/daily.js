module.exports = {
  name: "يومي",
  aliases: ["يومي", "يومية", "d", "daily"],
  category: "أوامـر عـامـة",
  description: "أحصل على جائزتك اليومية",
  // expectedArgs: '',
  // minArgs: 0,
  // maxArgs: 0,
  syntaxError: "",
  permissions: [],
  cooldown: "1d",
  // globalCooldown: '',
  hidden: false,
  ownerOnly: false,
  testOnly: false,
  guildOnly: true,
  slash: "both",
  /**
   *
   * @param {client} client
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
    const min = 200;
    const max = 1000;
    const daily = Math.random() * (+max - +min) + +min;
    const giveCoins = require("../functions/giveCoins");
    giveCoins(user.id, daily);
    return `**🏧 | مبروك لقد حصلت على ${daily} عملة ذهبية 🪙**`;
  },
};
