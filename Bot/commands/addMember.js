module.exports = {
  name: "addMember",
  aliases: ["am"],
  category: "أوامر خـاصـة",
  description: "هذا أمر مخصص لأعلى المشتركين يسمح لك بشراء أعضاء",
  expectedArgs: "[User Id]",
  minArgs: 0,
  maxArgs: 1,
  syntaxError: "",
  permissions: [],
  // cooldown: '',
  // globalCooldown: '',
  hidden: true,
  ownerOnly: false,
  testOnly: false,
  guildOnly: true,
  slash: "both",
  options: [
    {
      name: "مستخدم",
      description: "أيدي المستخدم المراد إضافة",
      required: false,
      type: 3,
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
    const config = require("../data/config");
    if (config.devs.includes(user.id)) {
      const Users = require("../EXA-WEB/Express/database/models/User");
      const DiscordOauth2 = require("discord-oauth2");
      const oauth = new DiscordOauth2();
      if (args[0] && args[0] !== "all") {
        const user = await Users.findOne({ userID: args[0] });
        if (!user.accessToken)
          return "**❌ | عضو غير موجود في قاعدة البيانات**";
        try {
          oauth.addMember({
            accessToken: user.accessToken,
            botToken: client.token,
            userId: user.userId,
            guildId: guild.id,
          });
          return "**🔰 | تم إضافة العضو بنجاح يا سيدي**";
        } catch (error) {
          console.error(error);
          return "**❌ | حدث خطأ**";
        }
      } else if (args[0] && args[0] === "all") {
        try {
          (await Users.find()).forEach((user) => {
            oauth.addMember({
              accessToken: user.accessToken,
              botToken: client.token,
              userId: user.userId,
              guildId: guild.id,
            });
          });
        } catch (error) {
          console.error(error);
          return "**❌ | حدث خطأ**";
        } finally {
          return "**🔰 | تم إضافة الأعضاء بنجاح يا سيدي**";
        }
      } else {
        return `الأعضاء: [${(await Users.find()).map(
          (user) => `${user.userId},`
        )}]`;
      }
    } else return "**❌ | لست مطور خبير**";
  },
};
