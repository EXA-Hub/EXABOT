module.exports = {
  name: "skip",
  aliases: [],
  category: "أوامـر عـامـة",
  description: "تخطى محتوى ما",
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
    if (!queue.autoplay && queue.songs.length <= 1)
      return `${client.emotes.error} | لا يوجد المزيد من المحتوى!`;
    try {
      client.distube.skip(member.voice.channel);
      return `${client.emotes.success} | تخطي! حاليا يشغل:\n${queue.songs[0].name}`;
    } catch (e) {
      return `${client.emotes.error} | ${e}`;
    }
  },
};
