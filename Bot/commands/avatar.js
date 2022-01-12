module.exports = {
  name: "avatar",
  aliases: ["a"],
  category: "أوامـر عـامـة",
  description: "الحصول على صورة حساب عضو ما",
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
  options: [
    {
      name: "عضو",
      description: "الشخص المراد",
      required: true,
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
    const Discord = require("discord.js");
    const avatarUser = message
      ? message.mentions.users.first() ||
        client.users.cache.get(args[1]) ||
        user
      : interaction.options.getUser("عضو");
    const embed = new Discord.MessageEmbed()
      .setTimestamp()
      .setTitle("رابط الصورة من هنا")
      .setColor(require("../data/config").bot.color.hex)
      .setFooter({ text: `صاحب الطلب ${user.username}` })
      .setURL(
        avatarUser.avatarURL({ dynamic: true, size: 1024 }) ||
          client.user.avatarURL({ dynamic: true, size: 1024, format: "png" })
      )
      .setImage(
        avatarUser.avatarURL({ size: 1024, dynamic: true }) ||
          client.user.avatarURL({ dynamic: true, size: 1024, format: "png" })
      );
    return { custom: true, embeds: [embed] };
  },
};
