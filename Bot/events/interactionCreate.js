const { client } = require("../index");
/**
 * @param {client} client
 */
module.exports = async (client, instance) => {
  client.on("interactionCreate", (interaction) => {
    if (!(interaction.isButton() || interaction.isSelectMenu())) return;

    if (interaction.customId.endsWith("Music")) {
      if (!interaction.member.voice.channel)
        return `${client.emotes.error} | يجب أن تنضم لقناة صوتية!`;

      const queue = client.distube.getQueue(interaction.member.voice.channel);
      if (!queue)
        return interaction.reply(`${client.emotes.error} | لا يوجد شئ!`);

      const cmd = interaction.customId.replace("Music", "");
      switch (cmd) {
        case "stop":
          if (!queue)
            return interaction.reply(`${client.emotes.error} | لا يوجد شئ!`);
          client.distube.stop(queue);
          interaction.reply(`${client.emotes.success} | توقف!`);
          break;

        case "play":
          if (!queue.paused) {
            client.distube.pause(interaction);
            return interaction.reply("أوقفت الأغنية مؤقتا من أجلك :)");
          }
          client.distube.resume(interaction);
          interaction.reply("أعدت تشغيل الأغنية من أجلك :)");
          break;

        case "filters":
          interaction.values.forEach((value) => {
            if (value == "off") {
              if (queue.filters && queue.filters.length > 0)
                client.distube.setFilter(
                  interaction.member.voice.channel,
                  queue.filters
                );
            } else if (Object.keys(client.distube.filters).includes(value)) {
              if (!queue.filters.includes(value))
                client.distube.setFilter(
                  interaction.member.voice.channel,
                  value
                );
            } else if (value) {
              const filtersMap = Object.keys(require("distube").defaultFilters)
                .map((f) => f)
                .join("/");
              return interaction.reply(
                `${client.emotes.error} | ليس مصفي متاح` +
                  "\n" +
                  `\`\`\`${filtersMap}\`\`\``
              );
            }
          });
          interaction.reply(
            `${client.emotes.success} | تم إضافة المؤثرات بنجاح`
          );
          break;

        default:
          interaction.reply(`${client.emotes.error} | أمر غير معروف`);
          break;
      }
    }
  });
};

module.exports.config = {
  displayName: "interactionCreate",
  dbName: "INTERACTION_CREATE",
};
