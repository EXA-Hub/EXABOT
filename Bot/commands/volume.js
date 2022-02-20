module.exports = {
  name: "volume",
  aliases: ["v", "set", "set-volume"],
  category: "أوامـر عـامـة",
  description: "تغيير الصوت",
  expectedArgs: "<رقم>",
  minArgs: 1,
  maxArgs: 1,
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
      name: "الصوت",
      description: "درجة الصوت اللتي تريدها",
      required: true,
      type: 3,
      choices: [
        {
          name: "كتم_الصوت_تماما",
          value: "0",
        },
        {
          name: "نصف_درجة_الصوت",
          value: "50",
        },
        {
          name: "درجة_الصوت_كاملة",
          value: "100",
        },
        {
          name: "مضاعفة_درجة_الصوت",
          value: "200",
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
    if (!member.voice.channel)
      return `${client.emotes.error} | يجب أن تنضم لقناة صوتية!`;
    const queue = client.distube.getQueue(member.voice.channel);
    if (!queue) return `${client.emotes.error} | لا يوجد شئ!`;
    const volume = parseInt(args[0]);
    if (isNaN(volume)) return `${client.emotes.error} | يرجى كتابة رقم متاح!`;
    client.distube.setVolume(member.voice.channel, volume);
    return `${client.emotes.success} | تم تثبيت الصوت على \`${volume}\``;
  },
};
