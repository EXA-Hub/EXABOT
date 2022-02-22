const { Client } = require("discord.js");
const { ICallbackObject } = require("wokcommands");
module.exports = {
  name: "clear",
  aliases: [],
  category: "الإداريـة",
  description: "حذف الرسائل",
  expectedArgs: "[عدد الرسائل]",
  minArgs: 0,
  maxArgs: 1,
  syntaxError: "× خطأ ×",
  permissions: ["MANAGE_MESSAGES"],
  cooldown: "3s",
  // globalCooldown: '',
  hidden: false,
  ownerOnly: false,
  testOnly: false,
  guildOnly: true,
  slash: "both",
  options: [
    {
      name: "عدد",
      description: "عدد الرسائل المراد حذفها",
      required: false,
      type: 10,
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
    const number = parseInt(
      (interaction ? interaction.options.getNumber("عدد") : args[0]) || 50
    );
    if (isNaN(number)) return `**❌ | عدد غير معروف**`;
    const messagesDeleted = await channel.bulkDelete(number, true);
    if (messagesDeleted)
      return channel
        .send(`**✅ | تم حذف: \`${messagesDeleted.size}\`**`)
        .then((msg) => {
          setTimeout(() => {
            if (msg && msg.deletable) msg.delete();
          }, 3000);
        });
    return `**❌ | لا يمكنني حذف الرسائل**`;
  },
};
