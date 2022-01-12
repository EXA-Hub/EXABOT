const Discord = require("discord.js");
/**
 * @param {Discord.Client} client
 */
module.exports = (client, instance) => {
  const config = require("../data/config");
  client.on("guildCreate", async (guild) => {
    const { MessageEmbed } = require("discord.js");
    const { stripIndents } = require("common-tags");
    const botOwner = await client.users.fetch(config.owner);
    const guildOwner = guild.members.cache.get(guild.ownerID);
    const [bots, users] = guild.members.cache.partition(
      (member) => member.user.bot
    );
    const embedMsg = new MessageEmbed()
      .setColor("GREEN")
      .setTimestamp()
      .setFooter({ text: guild.name, iconURL: guild.iconURL() })
      .setAuthor({ name: "تم الإنضمام لسيرفر :)", iconURL: guild.iconURL() })
      .addField(
        "معلومات السيرفر",
        stripIndents`\\> **الأيدي:** ${guild.id}
            \\> **الإسم:** ${guild.name}
            \\> **عدد الأعضاء:** ${guild.memberCount}
            \\> **عدد الناس:** ${users.size}
            \\> **عدد البوتات:** ${bots.size}
            \\> **تاريخ الإنشاء:** <t:${Math.floor(
              guild.createdTimestamp / 1000
            )}:d>
            \\> **تاريخ الإنضمام:** <t:${Math.floor(
              guild.joinedTimestamp / 1000
            )}:R>`
      );
    if (guildOwner) {
      embedMsg.addField(
        "معلومات أونر السيرفر",
        stripIndents`\\> **ID:** ${guildOwner.id}
            \\> **الإسم:** ${guildOwner.username}
            \\> **التاج:** ${guildOwner.tag}
            \\> **تاريخ الإنشاء:** <t:${Math.floor(
              guildOwner.createdTimestamp / 1000
            )}:F>`,
        true
      );
    }
    botOwner.send(embedMsg);
    if (users.size < "250") {
      (await guild.fetchOwner()).user.send(
        "> أنا أسف يجب أن يضم سيرفر 250 عضو لكي أنضم\nهذا أقل عدد ممكن للبوتات غير الموثقة"
      );
      guild.leave();
    } else if (guildOwner) {
      const num = users.size * 50;
      const giveCoins = require("../../functions/giveCoins");
      giveCoins(guildOwner.id, num);
      guildOwner.send(`**🪙 مبروك لقد حصلت على ${num} عملة ذهبية 🥳**`);
    }
  });
};

module.exports.config = {
  displayName: "GuildCreateEvent",
  dbName: "GUILD CREATE EVENT", // This should NEVER be changed once set, and users cannot see it.
};
