module.exports = {
  name: "resume",
  aliases: ["resume", "unpause"],
  category: "أوامـر عـامـة",
  description: "إعادة تشغيل المحتوى",
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
    if (!queue.paused) {
      client.distube.pause(message);
      return "أوقفت الأغنية مؤقتا من أجلك :)";
    }
    client.distube.resume(message);
    return "أعدت تشغيل الأغنية من أجلك :)";
  },
};
