async function welcome(client, guildID, tag, name, avatar, memberCount) {
  const db = require("./database");
  let data = await db.get(`${guildID}/welcomeImageData`);
  if (Object.keys(data) === 0)
    data = {
      StageData: {
        width: 720,
        height: 480,
        background:
          "https://cdn.discordapp.com/attachments/865036175705112596/919683698851479592/20191115_213644.png",
      },
      AvatarData: {
        url: avatar,
        x: 60,
        y: 120,
        width: 128,
        height: 128,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        circle: true,
      },
      TextData: {
        text: tag,
        x: 60,
        y: 120,
        fontSize: 12,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        fill: "#ffff00",
      },
    };
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
        data.TextData.fill = encodeURI(data.TextData.fill).replace("#", "");
        let url = `https://exa-bot-api.exacom.repl.co/welcome/data?data=${JSON.stringify(
          data
        )
          .toString()
          .replace(" ", "")
          .replace("#", "")}&member=${JSON.stringify({
          memberCount,
          name,
          tag,
        })
          .toString()
          .replace(" ", "")
          .replace("#", "")}`;
        const welcomeEmbed = new MessageEmbed()
          .setImage(encodeURI(url))
          .setColor(require("../data/config").bot.color.hex)
          .setTitle(welcomeMessage);
        channel.send({ embeds: [welcomeEmbed] });
      } else return;
    } else return;
  } else return;
}

module.exports = welcome;
