module.exports = {
  name: "coins",
  aliases: ["c", "coin"],
  category: "أوامـر عـامـة",
  description: "أمر العملة",
  expectedArgs: "[@user/top]",
  minArgs: 0,
  maxArgs: 3,
  syntaxError: "",
  permissions: [],
  cooldown: "3s",
  // globalCooldown: '',
  hidden: false,
  ownerOnly: false,
  testOnly: false,
  guildOnly: true,
  slash: "both",
  options: [
    {
      name: "قائمة",
      description: "أختر نوع القائمة",
      required: false,
      type: 3,
      choices: [
        {
          name: "رؤية_أغنى_الناس",
          value: "top",
        },
      ],
    },
    {
      name: "عدد_العملات",
      description: "حدد عدد العملات المراد تحويلها",
      required: false,
      type: 10,
    },
    {
      name: "عضو",
      description: "الشخص المراد تحديده",
      required: false,
      type: 6,
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
    const config = require("../data/config.js");
    const db = require("../functions/database");
    const takeCoins = require("../functions/takeCoins");
    const giveCoins = require("../functions/giveCoins");
    const setCoins = require("../functions/setCoins");
    const getCoins = require("../functions/getCoins");
    const coins = (await db.get("coins")) || {};
    if (args[0] === "add") {
      if (user.id === config.owner) {
        const targetUser =
          client.users.cache.get(args[2]) ||
          message.mentions.members.first() ||
          user;
        if (!targetUser) return "**👀 | الرجاء تحديد العضو يا سيدي**";
        const added = Number(args[1]);
        if (isNaN(added)) return "**👀 | أحتاج إلى أرقام يا سيدي**";
        giveCoins(targetUser.id, added);
        return `**${targetUser} 🏧 | مبروك لقد حصلت على ${added} عملة ذهبية 🪙**`;
      } else return `**🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧**`;
    } else if (args[0] === "take") {
      if (user.id === config.owner) {
        const targetUser =
          client.users.cache.get(args[2]) ||
          message.mentions.members.first() ||
          user;
        if (!targetUser) return "**👀 | الرجاء تحديد العضو يا سيدي**";
        const taked = Number(args[1]);
        if (isNaN(taked)) return "**👀 | أحتاج إلى أرقام يا سيدي**";
        takeCoins(targetUser.id, taked);
        return `**${targetUser} 🏧 | لقد خسرت على ${taked} عملة ذهبية 🪙**`;
      } else return `**🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧**`;
    } else if (args[0] === "set") {
      if (user.id === config.owner) {
        const targetUser =
          client.users.cache.get(args[2]) ||
          message.mentions.members.first() ||
          user;
        if (!targetUser) return "**👀 | الرجاء تحديد العضو يا سيدي**";
        const seted = Number(args[1]);
        if (isNaN(seted)) return "**👀 | أحتاج إلى أرقام يا سيدي**";
        setCoins(targetUser.id, seted);
        return `**🏧 | عملات ${targetUser} الأن هي ${seted} عملة ذهبية 🪙**`;
      } else return `**🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧**`;
    } else if (args[0] === "top") {
      const pickHighest = require("../functions/pickHighest");
      const topNum = args[1] || 5;
      if (Number(topNum) > 20) return "**❌ | أقصى عدد مسموح به هوا 20**";
      const { MessageEmbed } = require("discord.js");
      const topEmbed = new MessageEmbed()
        .setTimestamp()
        .setColor(config.bot.color.hex)
        .setDescription("**🪙 أغنى أشخاص على مستوى العالم 🏧**\n")
        .setAuthor({
          name: `${guild.name}`,
          iconURL: guild.iconURL({ dynamic: true }),
          url: config.support.server.invite.link,
        })
        .setFooter({
          text: `${user.tag}`,
          iconURL: user.avatarURL({ dynamic: true }),
        })
        .setTitle("أغنى الأغنياء 🤑");
      const topObj = pickHighest(coins, topNum);
      if (!topObj) topEmbed.setTitle("لا يوجد عدد كافي");
      i = 1;
      Object.entries(topObj).forEach((x) => {
        const topUser = client.users.cache.get(x[0]);
        topEmbed.setDescription(
          topEmbed.description +
            `\n**\`#${i}\` 🏧*\`${x[1]}\`*🪙 **\n**\`»\`** **\`${
              topUser ? topUser.tag : "غير معروف"
            }\`**`
        );
        i++;
      });
      return { custom: true, embeds: [topEmbed] };
    } else {
      const targetUser = message
        ? guild.members.cache.get(args[0]) || message.mentions.members.first()
        : interaction.options.getMember("عضو");
      if (targetUser) {
        if (args[1]) {
          if (user.id === targetUser.id) return "**😂 | لا تحتاج لهذا حتى**";
          const gifted = Number(
            message ? args[1] : interaction.options.getNumber("عدد_العملات")
          );
          if (isNaN(gifted) || gifted < 0) return "**👀 | أحتاج إلى أرقام**";
          const userCoins = coins[user.id];
          if (gifted > userCoins)
            return "**🤨 | لكنك لا تمتلك هذا القدر من العملات الذهبية**";
          takeCoins(user.id, gifted);
          giveCoins(targetUser.id, gifted);
          targetUser
            .send(
              `**${targetUser} 🏧 | مبروك لقد حصلت على ${gifted} عملة ذهبية 🪙 من: ${user}**`
            )
            .catch((e) => {
              if (e)
                channel.send(
                  `**${targetUser} 🏧 | مبروك لقد حصلت على ${gifted} عملة ذهبية 🪙 من: ${user}**`
                );
            });
          return `**${targetUser} 🏧 | مبروك لقد حصلت على ${gifted} عملة ذهبية 🪙**`;
        } else {
          const targetUserCoins = await getCoins(targetUser.id);
          return `**🏧 | عملات ${targetUser} الأن هي \`${targetUserCoins}\` عملة ذهبية 🪙**`;
        }
      } else {
        const userCoins = await getCoins(user.id);
        return `**🏧 | أنت تمتلك \`${userCoins}\` عملة ذهبية 🪙**`;
      }
    }
  },
};
