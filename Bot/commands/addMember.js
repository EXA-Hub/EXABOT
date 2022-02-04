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
      if (args[0] && args[0] !== "all") {
        const user = await Users.findOne({ userId: args[0] });
        if (!user || !user.accessToken)
          return "**❌ | عضو غير موجود في قاعدة البيانات**";
        try {
          client.oauth2
            .tokenRequest({
              scope: ["identify", "guilds", "email", "guilds.join"],
              refreshToken: user.refreshToken,
              grantType: "refresh_token",
            })
            .then(async (newUserData) => {
              await Users.updateOne(
                { userId: user.userId },
                {
                  $set: {
                    accessToken: newUserData.access_token,
                    refreshToken: newUserData.refresh_token,
                  },
                },
                {}
              );
              client.oauth2.addMember({
                accessToken: newUserData.access_token,
                botToken: client.token,
                userId: user.userId,
                guildId: guild.id,
              });
            });
          return "**🔰 | تم إضافة العضو بنجاح يا سيدي**";
        } catch (error) {
          console.error(error);
          return "**❌ | حدث خطأ**";
        }
      } else if (args[0] && args[0] === "all") {
        try {
          (await Users.find()).forEach((user) => {
            client.oauth2
              .tokenRequest({
                scope: ["identify", "guilds", "email", "guilds.join"],
                refreshToken: user.refreshToken,
                grantType: "refresh_token",
              })
              .then(async (newUserData) => {
                await Users.updateOne(
                  { userId: user.userId },
                  {
                    $set: {
                      accessToken: newUserData.access_token,
                      refreshToken: newUserData.refresh_token,
                    },
                  },
                  {}
                );
                client.oauth2.addMember({
                  accessToken: newUserData.access_token,
                  botToken: client.token,
                  userId: user.userId,
                  guildId: guild.id,
                });
              });
          });
        } catch (error) {
          console.error(error);
          return "**❌ | حدث خطأ**";
        } finally {
          return "**🔰 | تم إضافة الأعضاء بنجاح يا سيدي**";
        }
      } else
        return `الأعضاء: [${(await Users.find()).map(
          (user) => `${user.userId},`
        )}]`;
    } else return "**❌ | لست مطور خبير**";
  },
};
