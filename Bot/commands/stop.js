module.exports = {
  name: "stop",
  aliases: ["disconnect", "leave"],
  category: "أوامـر عـامـة",
  description: "إيقاف تشغيل المحتوى",
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
    client.distube.stop(queue);
    return `${client.emotes.success} | توقف!`;
  },
};
