module.exports = {
  name: "pause",
  aliases: ["hold"],
  category: "أوامـر عـامـة",
  description: "إيقاف الأغنية",
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
    if (queue.paused) {
      client.distube.resume(member.voice.channel);
      return "أعدت تشغيل الأغنية من أجلك :)";
    }
    client.distube.pause(member.voice.channel);
    return "أوقفت الأغنية مؤقتا من أجلك :)";
  },
};
