module.exports = {
  name: "set-partner-role",
  aliases: ["spr"],
  category: "الإعـدادات",
  description: "تحديد رتبة الشراكة في السيرفر",
  expectedArgs: "<رتبة>",
  minArgs: 1,
  maxArgs: 1,
  syntaxError: "",
  permissions: ["ADMINISTRATOR"],
  cooldown: "3s",
  // globalCooldown: '',
  hidden: false,
  ownerOnly: false,
  testOnly: false,
  guildOnly: true,
  slash: "both",
  options: [
    {
      name: "الرتبة",
      description: "تحديد رتبة الشراكة",
      required: true,
      type: 8,
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
    const db = require("../functions/database");
    if (!args[0])
      return {
        custom: true,
        content: "**❌ | من فضلك حدد الرتبة**",
        allowedMentions: { repliedUser: false },
      };
    const role = message
      ? guild.roles.cache.get(args[0]) ||
        guild.roles.cache.find((role) => role.name.toLowerCase() === args[0]) ||
        message.mentions.roles.first()
      : interaction.options.getRole("الرتبة");
    if (!role)
      return {
        custom: true,
        content: "**❌ | لم أصل للرتبة**",
        allowedMentions: { repliedUser: false },
      };
    if (!guild.roles.cache.get(role.id))
      return {
        custom: true,
        content: "**لا يمكنك إستعمال رتب من سيرفرات أخرى**",
        allowedMentions: { repliedUser: false },
      };
    const datafile = (await db.get("partner_roles")) || {};
    datafile[guild.id] = role.id;
    db.set("partner_roles", datafile);
    return "**✅ | تم تحديد رتبة الشراكاء**";
  },
};
