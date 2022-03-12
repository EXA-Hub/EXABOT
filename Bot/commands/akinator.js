module.exports = {
  name: "الجني",
  aliases: ["الجني", "akinator"],
  category: "الألـعـاب",
  description: "لعبة الجني الأزرق",
  // expectedArgs: '',
  // minArgs: 0,
  // maxArgs: 0,
  syntaxError: "",
  permissions: [],
  cooldown: "1m",
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
    if (!message) return `أستعمل الأوامر العادية أفضل`;
    const config = require("../data/config");
    const akinator = require("discord.js-akinator");
    const language = "ar";
    const childMode = true;
    const gameType = "character";
    const useButtons = true;
    const embedColor = config.bot.color.hex;
    akinator(message, {
      language,
      childMode,
      gameType,
      useButtons,
      embedColor,
    });
  },
};
