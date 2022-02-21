module.exports = {
  name: "queue",
  aliases: ["q"],
  category: "أوامـر عـامـة",
  description: "الأغاني الحالية",
  // expectedArgs: '',
  // minArgs: 0,
  // maxArgs: 0,
  syntaxError: "",
  permissions: [],
  // cooldown: '',
  // globalCooldown: '',
  hidden: false,
  ownerOnly: false,
  testOnly: false,
  guildOnly: true,
  slash: "both",
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
    const q = queue.songs
      .map(
        (song, i) =>
          `${i === 0 ? "مشغل:" : `${i}.`} ${song.name} - \`${
            song.formattedDuration
          }\``
      )
      .join("\n");
    return `${client.emotes.queue} | **قائمة السيرفر**\n${q}`;
  },
};
