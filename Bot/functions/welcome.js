const { client } = require("../index");
/**
 *
 * @param {client} bot
 * @param {String} guildID
 * @param {String} tag
 * @param {String} name
 * @param {String} avatar
 * @param {Number} memberCount
 * @returns
 */
async function welcome(bot, guildID, tag, name, avatar, memberCount) {
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
  const Discord = require("discord.js");
  const onOffData = (await db.get("welcome_on-off")) || {};
  const onOff = onOffData[guildID];
  if (onOff === "on") {
    const messagesData = await db.get("welcome_message");
    const message = messagesData[guildID];
    if (message) {
      const guild = bot.guilds.cache.get(guildID);
      const channelsID = await db.get("welcome_channels");
      const channelID = channelsID[guildID];
      const channel = guild.channels.cache.get(channelID);
      if (channel) {
        const welcomeMessage = message
          .replace("{{name}}", name)
          .replace("{{memberCount}}", guild.memberCount)
          .replace("{{tag}}", tag);
        if (
          data &&
          data.TextData &&
          data.AvatarData &&
          data.TextData.fill &&
          data.AvatarData.url
        ) {
          data.TextData.fill = encodeURI(data.TextData.fill).replace("#", "");
          data.AvatarData.url = encodeURI(avatar);
        }
        let url = `https://canvas.exabot.ml/welcome/data?data=${JSON.stringify(
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
        const image = new Discord.MessageAttachment(
          encodeURI(url),
          "ترحيب.png"
        );
        channel.send({ content: welcomeMessage, files: [image] });
      } else return;
    } else return;
  } else return;
}

module.exports = welcome;
