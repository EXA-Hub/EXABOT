async function welcome(client, guildID, tag, name, avatar) {
  const db = require("./database");
  const { MessageEmbed } = require("discord.js");
  const onOffData = (await db.get("welcome_on-off")) || {};
  const onOff = onOffData[guildID];
  if (onOff === "on") {
    const messagesData = await db.get("welcome_message");
    const message = messagesData[guildID];
    if (message) {
      const guild = client.guilds.cache.get(guildID);
      const channelsID = await db.get("welcome_channels");
      const channelID = channelsID[guildID];
      const channel = guild.channels.cache.get(channelID);
      if (channel) {
        const welcomeMessage = message
          .replace("{{name}}", name)
          .replace("{{memberCount}}", guild.memberCount)
          .replace("{{tag}}", tag);
        const username = name;
        const avatarURL =
          avatar ||
          client.user.avatarURL({ dynamic: true, size: 128, format: "png" });
        let url = `https://exa-bot-api.exacom.repl.co/welcome/1?tag=${encodeURI(
          tag
        )}&name=${encodeURI(username)}&memberCount=${encodeURI(
          guild.memberCount
        )}&avatar=${encodeURI(avatarURL)}`;
        const welcomeEmbed = new MessageEmbed()
          .setImage(url)
          .setColor(require("../data/config").bot.color.hex)
          .setTitle(welcomeMessage);
        channel.send({ embeds: [welcomeEmbed] });
      } else return;
    } else return;
  } else return;
}

module.exports = welcome;
