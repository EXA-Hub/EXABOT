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
        client.distube.play(guildMember.voice.channel, string, {
          textChannel: musicChannel,
          member: guildMember,
        });
        return res.send({ message: `**⏯ | جار التشغيل**` });
      } catch (e) {
        console.log(e);
        return res
          .status(404)
          .send({ message: `${client.emotes.error} | × خطأ: \`${e}\`` });
      }
    } else {
      if (!guildMember.voice.channel)
        return res.status(403).send({
          message: `${client.emotes.error} | يجب أن تنضم لقناة صوتية!`,
        });
      const queue = client.distube.getQueue(guildMember.voice.channel);
      if (!queue)
        return res
          .status(404)
          .send({ message: `${client.emotes.error} | لا يوجد شئ!` });
      if (task === "stop") {
        client.distube.stop(queue);
        return res.send({ message: `${client.emotes.success} | توقف!` });
      } else if (task === "autoPlay") {
        const autoplay = queue.toggleAutoplay();
        return res.send({
          message: `${client.emotes.success} | التشغيل التلقائي: \`${
            autoplay ? "On" : "Off"
          }\``,
          autoPlay: autoplay,
        });
      } else if (task === "pause") {
        if (queue.paused) {
          client.distube.resume(queue);
          return res.send({ message: "أعدت تشغيل الأغنية من أجلك :)" });
        } else {
          client.distube.pause(queue);
          return res.send({ message: "أوقفت الأغنية مؤقتا من أجلك :)" });
        }
      } else if (task === "skip") {
        if (!queue.autoplay && queue.songs.length <= 1)
          return res.status(403).send({
            message: `${client.emotes.error} | لا يوجد المزيد من المحتوى!`,
          });
        client.distube.skip(queue);
        return res.send({
          message: `${client.emotes.success} | تخطي! حاليا يشغل:\n${queue.songs[0].name}`,
        });
      } else if (task === "filter") {
        const { filter } = req.query;
        if (!filter) return res.send({ message: queue.filters });
        if (!Object.keys(client.distube.filters).includes(filter))
          return res
            .status(404)
            .send({ message: `${client.emotes.error} | ليس مصفي متاح` });
        const status = client.distube.setFilter(queue, filter).includes(filter);
        return res.send({
          message: status
            ? `${client.emotes.success} | ${filter} يعمل الأن`
            : `${client.emotes.success} | ${filter} توقف الأن`,
          status,
        });
      } else if (task === "volume") {
        const volume = parseInt(req.query.volume);
        if (isNaN(volume))
          return res
            .status(404)
            .send({ message: `${client.emotes.error} | يرجى كتابة رقم متاح!` });
        client.distube.setVolume(queue, volume);
        return res.send({
          message: `${client.emotes.success} | تم تثبيت الصوت على \`${volume}\``,
        });
      } else if (task === "loop") {
        let mode = parseInt(req.query.mode);
        if (![0, 1, 2].includes(mode))
          return res.status(404).send({
            message: `${client.emotes.error} | نوعية جديدة دي ولا إيه 🤠`,
          });
        mode = client.distube.setRepeatMode(queue, mode);
        mode = mode
          ? mode === 2
            ? "تكرار القائمة"
            : "تكرار الأغنية"
          : "غير مفعل";
        return res.send({
          message: `${client.emotes.repeat} | تم تثبيت التكرار إلى \`${mode}\``,
        });
      } else
        return res
          .status(404)
          .send({ message: `${client.emotes.error} | مهمة غير معروفة!` });
    }
  }
});

module.exports = router;
