const { Client } = require("discord.js");
const wok = require("wokcommands");
module.exports = {
  name: "autoplay",
  aliases: ["ap"],
  category: "أوامـر عـامـة",
  description: "تشغيل الأغنية التالية تلقائيا حسب الإقتراحات",
  // expectedArgs: '',
  // minArgs: 0,
  // maxArgs: 0,
  syntaxError: "× ؛خطأ ما؛ ×",
  permissions: [],
  cooldown: "3s",
  // globalCooldown: '',
  hidden: false,
  ownerOnly: false,
  testOnly: false,
  guildOnly: true,
  slash: "both",
  //   options: [
  //     {
  //       name: "",
  //       description: "",
  //       required: true,
  //       // https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type
  //       type: 0,
  //       choices: [
  //         {
  //           name: "",
  //           value: "",
  //         },
  //       ],
  //     },
  //   ],
  /**
   *
   * @param {Client} client
   */
  init: (client, instance) => {},
  /**
   * @param {wok.ICallbackObject} ICallbackObject
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
    if (!member.voice.channel)
      return `${client.emotes.error} | يجب أن تنضم لقناة صوتية!`;
    const queue = client.distube.getQueue(member.voice.channel);
    if (!queue) return `${client.emotes.error} | لا يوجد شئ!`;
    const autoplay = queue.toggleAutoplay();
    return `${client.emotes.success} | التشغيل التلقائي: \`${
      autoplay ? "On" : "Off"
    }\``;
  },
};
