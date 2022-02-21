module.exports = {
  name: "unban",
  aliases: [],
  category: "الإداريـة",
  description: "فك حظر عضو من دخول السيرفر",
  // expectedArgs: '',
  // minArgs: 0,
  // maxArgs: 0,
  syntaxError: "",
  permissions: ["BAN_MEMBERS", "ADMINISTRATOR"],
  // cooldown: '',
  // globalCooldown: '',
  hidden: false,
  ownerOnly: false,
  testOnly: false,
  guildOnly: true,
  slash: "both",
  options: [
    {
      name: "أيدي_شخص",
      description: "أيدي الشخص المراد قك حظره",
      required: true,
      type: 3,
    },
    {
      name: "السبب",
      description: "سبب فك الحظر",
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
      if (member.permissions.has("BAN_MEMBERS" || "ADMINISTRATOR")) {
        let reason = message
          ? args.slice(1).join(" ")
          : interaction.options.getMember("السبب");
        if (!reason)
          return `❌ | الرجاء تحديد سبب حظر العضو\n\`${
            message ? prefix : "/"
          }unban <Member> <Reason>\``;
        const userID = message
          ? args[0]
          : interaction.options.getMember("أيدي_شخص");
        guild.fetchBans().then((bans) => {
          if (bans.size == 0) return "❌ | لا يوجد أعضاء لفك حظرهم";
          const bUser = bans.find((b) => b.user.id == userID);
          if (!bUser) return "❌ | لا أستطيع العثور على هذا العضو";
          guild.members.unban(bUser.user).then(() => {
            const targetUser = client.users.cache.get(userID);
            targetUser
              .send(
                `تم فك حظرك من دخول سيرفر: **${guild.name}**\nسبب فك الحظر: **${reason}**.`
              )
              .catch(() =>
                channel.send({
                  content: `😏 | قام ${m.user.username} بإغلاق الرسائل الخاصة لديه`,
                })
              );
            return `✅ | فُك حظر **${targetUser.username}** من سيرفر **${guild.name}**.`;
          });
        });
      } else {
        return `❌ | لا تمتلك أي صلاحية لفك حظر الأعضاء`;
      }
    } catch (err) {
      return `❌ | أنا لا أستطيع فك حظر أي عضو لعدم إمتلاكي أي صلاحيات أو رتب`;
    }
  },
};
