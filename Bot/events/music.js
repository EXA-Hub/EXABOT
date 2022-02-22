const config = require("../data/config");
const Discord = require("discord.js");
const Distube = require("distube");
const { MessageEmbed } = Discord;
/**
 * @param {Discord.Client} client
 */
module.exports = (client, instance) => {
  const status = (queue) =>
    `درجة الصوت: \`${queue.volume}%\` | المصفى: \`${
      queue.filters.join(", ") || "Off"
    }\` | التكرار: \`${
      queue.repeatMode
        ? queue.repeatMode === 2
          ? "القائمة بالكامل"
          : "الأغنية"
        : "Off"
    }\` | التشغيل التلقائي: \`${queue.autoplay ? "On" : "Off"}\``;
  client.distube
    .on(
      "playSong",
      /**
       *
       * @param {Distube.Queue} queue
       * @param {Distube.Song} song
       * @returns
       */ async (queue, song) => {
        queue.textChannel.send({
          content: `يشغل \`${song.name}\` - \`${
            song.formattedDuration
          }\`\nبواسطة: ${song.user}\n${status(queue)}`,
        });
        const db = require("../functions/database");
        const guildMusicData = ((await db.get("MusicChannels")) || {})[
          queue.textChannel.guild.id
        ];
        if (
          guildMusicData &&
          guildMusicData.channel &&
          guildMusicData.message &&
          queue.textChannel.id === guildMusicData.channel
        ) {
          queue.textChannel.messages
            .fetch(guildMusicData.message)
            .then((message) => {
              if (message.editable) {
                const botOwner = client.users.cache.get(config.owner);
                const description = `> \\🎫 الأغنية من: \`${
                  song.source
                }\`\n> \\👁️ المشاهدات: \`${song.views}\`\n> \\👍 الإعجابات: \`${
                  song.likes
                }\` \\🆚 \\👎 عدم الإعجاب: \`${
                  song.dislikes
                }\`\n> \\🎥 بث مباشر: \`${
                  song.isLive ? "🔴 مباشر الأن" : "غير مباشر"
                }\`\n> \\⏳ مدة الأغنية: \`${
                  song.formattedDuration || "0:00"
                }\`\n> \\🎤 المغنى: [\`${
                  song.uploader.name || "غير معروف"
                }\`](${
                  song.uploader.url || config.support.server.invite.link
                } '${song.source}')`;
                const musicMessageEmbed = new MessageEmbed()
                  .setTitle(song.name || "لم أستطيع العثور على إسم الأغنية")
                  .setColor(config.bot.color.hex)
                  .setURL(
                    song.url ||
                      `${config.dashboard.react}/?guild=${queue.textChannel.guild.id}`
                  )
                  .setDescription(description)
                  .setFooter({
                    text: `Bot Developer: ${botOwner.tag}`,
                    iconURL: botOwner.avatarURL({
                      dynamic: true,
                      size: 256,
                    }),
                  })
                  .setAuthor({
                    name: song.user ? song.user.tag : guild.name,
                    iconURL: song.user
                      ? song.user.avatarURL({
                          dynamic: true,
                          size: 256,
                        })
                      : guild.iconURL({
                          dynamic: true,
                          size: 256,
                        }),
                    url: config.support.server.invite.link,
                  })
                  .setImage(song.thumbnail || config.youtube.music.banner)
                  .setTimestamp();
                const musicFormatsEmbedVideo = new MessageEmbed().setColor(
                  config.bot.color.hex
                );
                const musicFormatsEmbedAudio = new MessageEmbed().setColor(
                  config.bot.color.hex
                );
                if (song.formats) {
                  try {
                    musicFormatsEmbedVideo.addFields(
                      song.formats
                        .filter((video) => video.hasVideo && video.hasAudio)
                        .map((video) => {
                          return {
                            name: "▶ " + video.qualityLabel,
                            value: `[رابط التحميل \\✅](${video.url})`,
                          };
                        })
                    );
                  } catch (error) {
                    console.error(error);
                  }
                  try {
                    musicFormatsEmbedAudio.addFields(
                      song.formats
                        .filter((audio) => !audio.hasVideo && audio.hasAudio)
                        .map((audio) => {
                          return {
                            name: "🔉 " + audio.audioQuality,
                            value: `[رابط التحميل \\✅](${audio.url})`,
                          };
                        })
                    );
                  } catch (error) {
                    console.error(error);
                  }
                }
                message.edit({
                  embeds: [
                    musicFormatsEmbedVideo,
                    musicFormatsEmbedAudio,
                    musicMessageEmbed,
                  ],
                });
              }
            });
        }
      }
    )
    .on("addSong", (queue, song) =>
      queue.textChannel.send({
        content: `أضيف ${song.name} - \`${song.formattedDuration}\` لقائمة الإنتظار بواسطة ${song.user}`,
      })
    )
    .on("addList", (queue, playlist) =>
      queue.textChannel.send({
        content: `أضيف \`${playlist.name}\` قائمة التشغيل (${
          playlist.songs.length
        } أغنية) لقائمة الإنتظار\n${status(queue)}`,
      })
    )
    // DisTubeOptions.searchSongs = true
    .on("searchResult", (message, result) => {
      let i = 0;
      message.channel.send({
        content: `**أختر من التالى**\n${result
          .map(
            (song) => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``
          )
          .join("\n")}\n*أرسل أي شئ مختلف أو أنتظر 30 ثانية للإلغاء`,
      });
    })
    // DisTubeOptions.searchSongs = true
    .on("searchCancel", (message) =>
      message.channel.send({ content: `تم الألغاء` })
    )
    .on("searchInvalidAnswer", (message) =>
      message.channel.send({ content: `لا توجد إجابة!` })
    )
    .on("searchNoResult", (message) =>
      message.channel.send({ content: `لا توجد نتيجة!` })
    )
    .on("error", (channel, error) => {
      console.error(error);
      channel.send(`An error encoutered: ${error.slice(0, 1979)}`);
    })
    .on("finish", (queue) =>
      queue.textChannel.send({ content: "أنتهت قائمة الإنتظار!" })
    )
    .on("finishSong", (queue) =>
      queue.textChannel.send({ content: "أنتهت الأغنية!" })
    )
    .on("disconnect", async (queue) => {
      queue.textChannel.send({ content: "خرج!" });
      const db = require("../functions/database");
      const guildMusicData = ((await db.get("MusicChannels")) || {})[
        queue.textChannel.guild.id
      ];
      if (
        guildMusicData &&
        guildMusicData.channel &&
        guildMusicData.message &&
        queue.textChannel.id === guildMusicData.channel
      ) {
        queue.textChannel.messages
          .fetch(guildMusicData.message)
          .then((message) => {
            if (message.editable) {
              const botOwner = client.users.cache.get(config.owner);
              message.edit({
                embeds: [
                  new MessageEmbed()
                    .setTitle("أرسل إسم أغنية")
                    .setColor(config.bot.color.hex)
                    .setURL(
                      `${config.dashboard.react}/?guild=${queue.textChannel.guild.id}`
                    )
                    .setDescription("أرسل إسم أغنية وسيقوم البوت فورا بتشغيلها")
                    .setFooter({
                      text: `Bot Developer: ${botOwner.tag}`,
                      iconURL: botOwner.avatarURL({ dynamic: true, size: 256 }),
                    })
                    .setAuthor({
                      name: queue.textChannel.guild.name,
                      iconURL: queue.textChannel.guild.iconURL({
                        dynamic: true,
                        size: 256,
                      }),
                      url: config.support.server.invite.link,
                    })
                    .setImage(config.youtube.music.banner)
                    .setTimestamp(),
                ],
              });
            }
          });
      }
    })
    .on("empty", (queue) => queue.textChannel.send({ content: "فارغ!" }));
};

module.exports.config = {
  displayName: "Music Events",
  dbName: "MUSIC EVENTS", // This should NEVER be changed once set, and users cannot see it.
};
