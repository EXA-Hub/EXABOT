module.exports = {
  name: "mute",
  aliases: [],
  category: "الإداريـة",
  description: "حظر شخص كتابيا وتحديد رتبة الحظر",
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
      description: "الشخص المراد حظره كتابيا",
      required: false,
      type: 6,
    },
    {
      name: "رتبة",
      description: "إضافة رتبة الحظر",
      required: false,
      type: 8,
    },
    {
      name: "الرتبة",
      description: "معرفة رتبة الحظر",
      required: false,
      type: 3,
      choices: [
        {
          value: "role",
          name: "معرفة_رتبة_الحظر",
        },
      ],
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
    const mute = require("../functions/mute");
    const db = require("../functions/database");
    if (args[0] === "role") {
      const roles = (await db.get("mute_roles")) || {};
      return `رتبة الحظر: <@&${roles[guild.id]}>`;
    } else {
      const targetmember = message
        ? guild.members.cache.get(args[0]) ||
          guild.members.cache.filter(
            (member) =>
              member.user.username.toString().toLowerCase() === args[0]
          ) ||
          guild.members.cache.filter(
            (member) => member.tag.toString().toLowerCase() === args[0]
          ) ||
          message.mentions.members.first()
        : interaction.options.getMember("عضو");
      const targetrole = message
        ? guild.roles.cache.get(args[0]) ||
          guild.roles.cache.filter(
            (role) => role.name.toString().toLowerCase() === args[0]
          ) ||
          message.mentions.roles.first()
        : interaction.options.getRole("رتبة");
      if (!targetmember && !targetrole) {
        return "👀 | لا أستطيع العثور على العضو أو الرتبة";
      } else if (targetmember) {
        mute({ guild, channel }, targetmember);
        return "👍 | جاري الحظر";
      } else if (targetrole) {
        if (targetrole.permissions.has("ADD_REACTIONS" || "SEND_MESSAGES"))
          return (
            "🚧 | هذه الرتبة لا تصلح " +
            "\n" +
            "( الرتبة تمتلك صلاحيات للكتابة والتعليق )"
          );
        const saveData = async (saved, path) => {
          var datafile = (await db.get(path)) || {};
          datafile[guild.id] = saved;
          db.set(path, datafile);
          return Promise.resolve();
        };
        saveData(targetrole.id, "mute_roles");
        return `✅ | تم حفظ رتبة ${targetrole}`;
      }
    }
  },
};
