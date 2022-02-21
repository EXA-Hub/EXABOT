module.exports = {
  name: "kick",
  aliases: [],
  category: "الإداريـة",
  description: "طرد العضو",
  expectedArgs: "<@Member> <Reason>",
  minArgs: 2,
  maxArgs: 2,
  syntaxError: "",
  permissions: ["KICK_MEMBERS"],
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
      description: "الشخص المراد طرده",
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
    try {
      const target = message
        ? message.mentions.members.first()
        : interaction.options.getMember("عضو");
      if (member.permissions.has("KICK_MEMBERS")) {
        if (message.mentions.users.size != 0) {
          if (message.mentions.members.first().kickable) {
            let reason = message ? args.slice(1).join(" ") : args[1];
            if (!reason) {
              return `❌ | الرجاء إعطاء سبب لطرد هذا العضو.\n\`${
                message ? prefix : "/"
              }${
                message.content.slice(prefix.length).split(/ +/g)[0]
              } <Member> <Reason>\``;
            } else {
              message.mentions.members
                .first()
                .kick()
                .then((m) => {
                  message.mentions.members
                    .first()
                    .send(
                      `تم طردك من سيرفر: **${guild.name}**\السبب: **${reason}**.`
                    )
                    .catch(() =>
                      channel.send({
                        allowedMentions: { repliedUser: false },
                        content: `😏 | ${m.user.username} قام بإغلاق الرسائل الخاصة!`,
                      })
                    );
                  return `✅ | **${m.user.username}** طُرد من سيرفر: **${guild.name}**.`;
                });
            }
          } else {
            return `❌ | لا أستطيع طرد ${
              message.mentions.user.first().username
            }!`;
          }
        } else {
          return "❌ | لا أستطيع العثور على هذا العضو!";
        }
      } else {
        return `❌ | أنت لا تمتلك أي صلاحيات لطرد الأعضاء!`;
      }
    } catch (err) {
      return `❌ | أنا لا أستطيع طرد أي عضو من السيرفر لعدم حوذتي على أي رتب أو صلاحيات!`;
    }
  },
};
