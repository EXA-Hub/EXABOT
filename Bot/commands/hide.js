const { Client } = require("discord.js");
const { ICallbackObject } = require("wokcommands");
module.exports = {
  name: "hide",
  aliases: [],
  category: "الإداريـة",
  description: "إخفاء وإظهار الغرفة",
  expectedArgs: "[رتبة]",
  minArgs: 0,
  maxArgs: 1,
  syntaxError: "× خطأ ×",
  permissions: ["MANAGE_CHANNELS"],
  //   cooldown: '',
  //   globalCooldown: "3s",
  hidden: false,
  ownerOnly: false,
  testOnly: false,
  guildOnly: true,
  slash: "both",
  options: [
    {
      name: "عضو",
      description: "تحديد عضو واحد لتفعيل تعديل الغرفة عليه",
      required: false,
      type: 6,
    },
    {
      name: "رتبة",
      description: "تحديد رتبة واحدة لتفعيل تعديل الغرفة عليها",
      required: false,
      type: 8,
    },
  ],
  /**
   *
   * @param {Client} client
   */
  init: (client, instance) => {},
  /**
   * @param {ICallbackObject} ICallbackObject
   *
   */ callback: async ({
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
    const target =
      (interaction
        ? interaction.options.getRole("رتبة") ||
          interaction.options.getMember("عضو")
        : guild.roles.cache.get(args[0]) ||
          guild.roles.cache.find((role) => role.name === args[0]) ||
          message.mentions.roles.first() ||
          message.mentions.members.first() ||
          guild.members.cache.get(args[0]) ||
          guild.members.cache.find(
            (member) => member.displayName === args[0]
          )) || guild.roles.everyone;
    if (channel.permissionsFor(target, true).has("VIEW_CHANNEL")) {
      channel.permissionOverwrites.edit(target, {
        VIEW_CHANNEL: false,
      });
      return `**🔒 | تم الإخفاء لـ\`${target.name || target.user.tag}\`**`;
    } else {
      channel.permissionOverwrites.edit(target, {
        VIEW_CHANNEL: true,
      });
      return `**🔓 | تم الإظهار لـ\`${target.name || target.user.tag}\`**`;
    }
  },
};
