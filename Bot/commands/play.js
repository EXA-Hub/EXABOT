module.exports = {
  name: "play",
  aliases: ["p"],
  category: "أوامـر عـامـة",
  description: "تشغيل أغنية",
  expectedArgs: "<الأغنية>",
  minArgs: 1,
  maxArgs: -1,
  syntaxError: "",
  permissions: [],
  // cooldown: '',
  // globalCooldown: '',
  hidden: false,
  ownerOnly: false,
  testOnly: false,
  guildOnly: true,
  slash: "both",
  options: [
    {
      name: "الأغنية",
      description:
        "الرجاء تحديد إسم أو رابط أغنية من يوتيوب أو سبوتيفاي أو سوند كلاود",
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
    if (!member.voice.channel)
      return `${client.emotes.error} | يجب أن تنضم لقناة صوتية!`;
    const string = message
      ? args.join(" ")
      : interaction.options.getString("الأغنية");
    if (!string)
      return `${client.emotes.error} | الرجاء إرسال رابط أو كلمة بحث.`;
    try {
      client.distube.play(member.voice.channel, string, {
        textChannel: channel,
        member,
      });
      return `**⏯ | جار التشغيل**`;
    } catch (e) {
      console.log(e);
      return `${client.emotes.error} | × خطأ: \`${e}\``;
    }
  },
};
