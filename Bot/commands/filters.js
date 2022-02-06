const filtersMap = Object.keys(require("distube").defaultFilters)
  .map((f) => f)
  .join("/");
var keys = Object.keys(require("distube").defaultFilters);
var values = Object.values(require("distube").defaultFilters);
var result = [{ name: "إغلاق المرشحات", value: "off" }];
keys.forEach((key, i) =>
  result.push({
    name: `${key.replace(" ", "_")} => ${values[i].replace(" ", "_")}`,
    value: key,
  })
);
module.exports = {
  name: "filters",
  aliases: ["filter"],
  category: "أوامـر عـامـة",
  description: "تغيير فلاتر الصوت",
  expectedArgs: `<off/\`\`\`${filtersMap}\`\`\`>`,
  minArgs: 0,
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
      name: "نوع_التصفية",
      description: "يرجى إختيار نوع التصفية المراده",
      required: false,
      type: 3,
      choices: result,
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
    if (!queue)
      return (
        `${client.emotes.error} | لا يوجد شئ!` +
        "\n" +
        `\`\`\`${filtersMap}\`\`\``
      );
    if (args[0] === "off" && queue.filters.length > 0) {
      client.distube.setFilter(member.voice.channel, queue.filters);
    } else if (Object.keys(client.distube.filters).includes(args[0])) {
      client.distube.setFilter(member.voice.channel, args[0]);
    } else if (args[0]) {
      return (
        `${client.emotes.error} | ليس مصفي متاح` +
        "\n" +
        `\`\`\`${filtersMap}\`\`\``
      );
    }
    return `تصفية الصوت الحالية: **${
      queue.filters.join(", ") ||
      "غير مفعل" + "\n" + `\`\`\`${filtersMap}\`\`\``
    }**`;
  },
};
