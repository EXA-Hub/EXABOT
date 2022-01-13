const { Router } = require("express");
const { client } = require("../../../../../index");
const db = require("../../../../../functions/database");

const router = Router();

router.all("/:guildID/music/:task?", async (req, res) => {
  const { guildID, task } = req.params;
  const guildMusicData = ((await db.get("MusicChannels")) || {})[guildID];
  if (!guildMusicData)
    return res.status(403).send({ message: "يجب تفعيل نظام الغرف الموسيقية" });
  else {
    const guild = client.guilds.cache.get(guildID);
    const guildMember = guild.members.cache.get(req.user.userId);
    const musicChannel = guild.channels.cache.get(guildMusicData.channel);
    if (task === "play") {
      if (!guildMember.voice.channel)
        return res.status(403).send({
          message: `${client.emotes.error} | يجب أن تنضم لقناة صوتية!`,
        });
      const string = req.query.songName;
      if (!string)
        return res.status(404).send({
          message: `${client.emotes.error} | الرجاء إرسال رابط أو كلمة بحث.`,
        });
      if (!musicChannel)
        return res
          .status(404)
          .send({ message: "لا أستطيع العثور على قناة نظام الغرفة الموسيقية" });
      try {
        client.distube.playVoiceChannel(guildMember.voice.channel, string, {
          textChannel: musicChannel,
          member: guildMember,
        });
        return res.send({ message: `**⏯ | جار التشغيل**` });
      } catch (e) {
        console.log(e);
        return res.status(404).send(`${client.emotes.error} | × خطأ: \`${e}\``);
      }
    } else if (task === "stop") {
      if (!guildMember.voice.channel)
        return res
          .status(403)
          .send({
            message: `${client.emotes.error} | يجب أن تنضم لقناة صوتية!`,
          });
      const queue = client.distube.getQueue(guildMember.voice.channel);
      if (!queue)
        return res
          .status(404)
          .send({ message: `${client.emotes.error} | لا يوجد شئ!` });
      client.distube.stop(queue);
      return res.send({ message: `${client.emotes.success} | توقف!` });
    }
    return res.sendStatus(404);
  }
});

module.exports = router;
