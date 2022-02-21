module.exports = {
  name: "unmute",
  aliases: [],
  category: "الإداريـة",
  description: "فك حظر شخص كتابيا حذف رتبة الحظر",
  expectedArgs: "<رتبة/عضو>",
  minArgs: 0,
  maxArgs: 1,
  syntaxError: "",
  permissions: ["MANAGE_ROLES", "ADMINISTRATOR"],
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
      description: "الشخص المراد فك حظره كتابيا",
      required: false,
      type: 6,
    },
    {
      name: "رتبة",
      description: "إزالة رتبة الحظر",
      required: false,
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
    const unmute = require("../functions/unmute");
    const targetmember = message
      ? guild.members.cache.get(args[0]) || message.mentions.members.first()
      : interaction.options.getMember("عضو");
    const targetrole = message
      ? guild.roles.cache.get(args[0]) ||
        guild.roles.cache.find((role) => role.name.toLowerCase() === args[0]) ||
        message.mentions.roles.first()
      : interaction.options.getRole("رتبة");
    if (!targetmember && !targetrole) {
      return "👀 | لا أستطيع العثور على العضو أو الرتبة";
    } else if (targetmember) {
      unmute({ guild, channel }, targetmember);
      return `👍 | جاري فك الحظر`;
    } else if (targetrole) {
      if (targetrole.permissions.has("ADD_REACTIONS" || "SEND_MESSAGES"))
        return (
          "🚧 | هذه الرتبة لا تصلح " +
          "\n" +
          "( الرتبة تمتلك صلاحيات للكتابة والتعليق )"
        );
      const deleteData = async (deleted, path) => {
        var datafile = (await db.get(path)) || {};
        if (!datafile[guild.id]) return "🚧 | لا توجد رتبة للحذف";
        delete datafile[guild.id];
        db.set(path, datafile);
        return Promise.resolve();
      };
      deleteData(targetrole.id, "mute_roles");
      return `❎ | تم حذف رتبة ${targetrole}`;
    }
  },
};
