module.exports = {
  name: "ban",
  aliases: [],
  category: "الإداريـة",
  description: "حظر عضو من دخول السيرفر",
  expectedArgs: "<@Member> <Reason>",
  minArgs: 2,
  maxArgs: 2,
  syntaxError: "",
  permissions: ["BAN_MEMBERS" || "ADMINISTRATOR"],
  cooldown: "10s",
  // globalCooldown: '',
  hidden: false,
  ownerOnly: false,
  testOnly: false,
  guildOnly: true,
  slash: "both",
  options: [
    {
      name: "عضو",
      description: "الشخص المراد حظره",
      required: true,
      type: 6,
    },
    {
      name: "السبب",
      description: "سبب الطرد",
      required: true,
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
    try {
      if (member.permissions.has()) {
        const target = message
          ? message.mentions.members.first()
          : interaction.options.getMember("عضو");
        try {
          let reason = message ? args.slice(1).join(" ") : args[1];
          if (!target) {
            return `❌ | الرجاء تحديد العضو\n\`${
              message ? prefix : "/"
            }ban <Member> <Reason>\``;
          } else if (!reason) {
            return `❌ | الرجاء تحديد سبب حظر العضو\n\`${
              message ? prefix : "/"
            }ban <Member> <Reason>\``;
          } else {
            target
              .ban({
                reason:
                  reason || `تم الحظر بواسطة: ${user.tag} // ID: ${user.id}`,
              })
              .then((m) => {
                target
                  .send({
                    content: `تم حظرك من دخول سيرفر: **${guild.name}**\nسبب الحظر: **${reason}**.`,
                  })
                  .catch(() => {
                    channel.send({
                      content: `😏 | قام ${m.user.username} بإغلاق الرسائل الخاصة لديه`,
                    });
                  });
              });
            return `✅ | حُظر **${target.user.username}** من سيرفر **${guild.name}**.`;
          }
        } catch (err) {
          console.error(err);
          return `❌ | لا أستطيع حظر ${target.username}!`;
        }
      } else {
        return "❌ | لا أستطيع العثور على هذا العضو";
      }
    } catch (err) {
      console.error(err);
      return `❌ | أنا لا أستطيع حظر أي عضو لعدم إمتلاكي أي صلاحيات أو رتب`;
    }
  },
};
