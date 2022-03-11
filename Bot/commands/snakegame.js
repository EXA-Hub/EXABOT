module.exports = {
  name: "snakegame",
  aliases: ["الحنش", "الثعبان", "sgame", "snake", "snakegame"],
  category: "الألـعـاب",
  description: "لعبة الثعبان والتفاح",
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
    const config = require("../data/config.js");
    const SnakeGame = require("snakecord");
    const snakeGame = new SnakeGame({
      title: "لعبة الثعبان",
      color: config.bot.color.hex,
      timestamp: true,
      gameOverTitle: "إنتهت اللعبة",
    });
    await snakeGame.newGame(message);
  },
};
