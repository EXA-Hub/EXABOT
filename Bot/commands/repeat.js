module.exports = {
  name: "repeat",
  aliases: ["loop", "rp"],
  category: "أوامـر عـامـة",
  description: "repeatشغل تراكي على الـ",
  expectedArgs: "<off/song/queue>",
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
      name: "عملية_التكرار",
      description: "ماذا سأفعل مع عملية التكرار",
      required: false,
      type: 3,
      choices: [
        {
          name: "إيقاف_التكرار",
          value: "off",
        },
        {
          name: "تكرار_الأغنية",
          value: "song",
        },
        {
          name: "تكرار_القائمة",
          value: "queue",
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
    let mode = 1;
    switch (args[0]) {
      case "off":
        mode = 0;
        break;
      case "song":
        mode = 1;
        break;
      case "queue":
        mode = 2;
        break;
    }
    mode = client.distube.setRepeatMode(member.voice.channel, mode);
    mode = mode ? (mode === 2 ? "تكرار القائمة" : "تكرار الأغنية") : "غير مفعل";
    return `${client.emotes.repeat} | تم تثبيت التكرار إلى \`${mode}\``;
  },
};
