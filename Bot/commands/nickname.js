module.exports = {
  name: "nickname",
  aliases: ["nick"],
  category: "الإداريـة",
  description: "أمر تغيير الإسم الظاهري!",
  expectedArgs: "[@user] <nickName>",
  minArgs: 1,
  maxArgs: -1,
  syntaxError: "",
  permissions: ["MANAGE_NICKNAMES"],
  // cooldown: '',
  // globalCooldown: '',
  hidden: false,
  ownerOnly: false,
  testOnly: false,
  guildOnly: true,
  slash: "both",
  options: [
    {
      name: "الإسم_الجديد",
      description: "تحديد الإسم الجديد",
      required: true,
      type: 3,
    },
    {
      name: "العضو",
      description: "تحديد العضو رجائاً",
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
    const nickName = message
      ? args[1]
      : interaction.options.getString("الإسم_الجديد");
    const { MessageEmbed } = require("discord.js");
    let nickUser =
      (message
        ? client.users.cache.get(args[0]) || message.mentions.users.first()
        : interaction.options.getMember("العضو")) || user;
    if (!nickName.includes("{{UserName}}")) {
      channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(require("../data/config").bot.color.hex)
            .setTitle("يمكنك إستخدام القطع التالية")
            .addField("{{UserName}}", "تعبر عن إسم المستخدم", true),
        ],
      });
    }
    if (!member.permissions.has("MANAGE_NICKNAMES"))
      return "❌ | أنت لا تمتلك صلاحية!";
    if (!nickUser) return "❌ | من هذا العضو؟";
    nickUser.setNickname(nickName.replace("{{UserName}}", nickUser.username));
    return "✅ | تم.";
  },
};
