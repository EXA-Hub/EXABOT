const { client } = require("../index");
const { ICallbackObject } = require("wokcommands");
const { fromS } = require("../functions/msForamt");
module.exports = {
  name: "seek",
  aliases: ["الى", "نقل", "انتقل", "seek"],
  category: "الـمـوسـيـقـى",
  description: "تغيير الوقت",
  expectedArgs: "<دقيقة> [ثانية]",
  minArgs: 0,
  maxArgs: 2,
  syntaxError: "× خطأ ×",
  permissions: [],
  cooldown: "3s",
  // globalCooldown: '',
  hidden: false,
  ownerOnly: false,
  testOnly: false,
  guildOnly: true,
  slash: "both",
  options: [
    {
      name: "دقائق",
      description: "الدقائق اللذي تريده",
      required: false,
      type: 4,
    },
    {
      name: "ثوان",
      description: "الثوان اللذي تريده",
      required: false,
      type: 4,
    },
  ],
  /**
   *
   * @param {client} client
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
    if (!member.voice.channel)
      return `${client.emotes.error} | يجب أن تنضم لقناة صوتية!`;
    const queue = client.distube.getQueue(member.voice.channel);
    if (!queue) return `${client.emotes.error} | لا يوجد شئ!`;
    const mm = parseInt(
      `${message ? args[0] : interaction.options.getInteger("دقائق")}`
    );
    if (!mm)
      return `${client.emotes.success} | الوقت الحالي هو \`${fromS(
        Math.floor(queue.currentTime),
        "mm:ss"
      )}\` من \`${fromS(queue.duration)}\``;
    if (isNaN(mm))
      return `${client.emotes.error} | يرجى كتابة رقم متاح للدقائق!`;
    const ss =
      parseInt(
        `${message ? args[1] : interaction.options.getInteger("ثوان")}`
      ) || 0;
    if (ss && isNaN(ss))
      return `${client.emotes.error} | يرجى كتابة رقم متاح للثوان!`;
    const seek = (mm || 0) * 60 + ss;
    if (isNaN(seek)) return `${client.emotes.error} | يرجى كتابة رقم متاح!`;
    if (seek > queue.duration)
      return `${client.emotes.error} | يرجى كتابة رقم أصغر!`;
    client.distube.seek(member.voice.channel, seek);
    return `${client.emotes.success} | تم تحويل الوقت الى \`${fromS(seek)}\``;
  },
};
