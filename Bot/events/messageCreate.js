const Discord = require("discord.js");
/**
 * @param {Discord.Client} client
 */
module.exports = (client, instance) => {
  const mute = require("../functions/mute");
  const config = require("../data/config");
  const db = require("../functions/database");
  client.on("messageCreate", async (message) => {
    if (!message.guild) return;
    const guildMusicData = ((await db.get("MusicChannels")) || {})[
      message.guild.id
    ];
    if (guildMusicData && message.channel.id === guildMusicData.channel) {
      if (message.author.id === client.user.id) {
        setTimeout(() => {
          if (message.deletable) message.delete();
        }, 1000 * 5);
      } else {
        if (message.deletable) {
          message.delete();
        } else {
          musicChannel.send({
            content: "> 💢 **يرجى إعطاء البوت الصلاحيات المطلوبة** 💢",
          });
        }
        const musicChannel = message.guild.channels.cache.get(
          guildMusicData.channel
        );
        if (message.member.voice.channel) {
          client.distube.playVoiceChannel(
            message.member.voice.channel,
            message.content,
            {
              textChannel: musicChannel,
              member: message.member,
            }
          );
        } else {
          message.channel.send({ content: "**❌ | إنضم لغرفة صوتية أولا**" });
        }
      }
    }

    if (message.author.bot || message.webhookID) return;
    const letters = message.content.trim().split("");
    const giveCoins = require("../functions/giveCoins");
    giveCoins(message.author.id, letters.length);
    if (
      message.mentions.has(client.user.id) &&
      (!message.content.includes("@here") ||
        !message.content.includes("@everyone")) &&
      message.mentions.users.first() === client.user
    ) {
      const prefix = instance.getPrefix(message.guild) || config.prefix;
      message.channel.send({
        embeds: [
          new Discord.MessageEmbed()
            .setColor(config.bot.color.hex)
            .setTitle(`للحصول على المعلومات إكتب \`${prefix}help\``),
        ],
      });
    }
    if (!message.member.permissions.has("ADMINISTRATOR")) {
      if (
        (message.content.includes("discord.gg/") ||
          message.content.includes("discord.com/invite/")) &&
        !message.member.permissions.has("EMBED_LINKS")
      ) {
        const working = (await db.get("antiad-on-off")) || {};
        const antiCheck = working[message.guild.id];
        if (antiCheck && antiCheck === "on" && !antiCheck === "off") {
          const warnDeleteMsg = () => {
            message.delete();
            mute(message, message.member);
            message.channel.send({ content: "**ممنوع نشر الدعوات**" });
          };
          const allowed = (await db.get("antiad_protection/allowed")) || {};
          const allowedRolesInGuild = allowed[message.guild.id];
          if (!allowedRolesInGuild || allowedRolesInGuild.length === 0) {
            warnDeleteMsg();
          } else if (allowedRolesInGuild) {
            const allowedMemberPremsRoles = await allowedRolesInGuild.filter(
              (ID) => message.member.roles.cache.has(ID)
            );
            if (allowedMemberPremsRoles && allowedMemberPremsRoles.length > 0)
              warnDeleteMsg();
          }
        }
      } else if (!message.member.permissions.has("EMBED_LINKS")) {
        if (require("valid-url").isUri(message.content)) {
          const working = (await db.get("antilink-on-off")) || {};
          const antiCheck = working[message.guild.id];
          if (antiCheck && antiCheck === "on" && !antiCheck === "off") {
            const warnDeleteMsg = () => {
              message.delete();
              mute(message, message.member);
              channel.send("**ممنوع نشر الروابط**");
            };
            const allowed = (await db.get("antilink_protection/allowed")) || {};
            const allowedRolesInGuild = allowed[message.guild.id];
            if (!allowedRolesInGuild) {
              warnDeleteMsg();
            } else if (allowedRolesInGuild) {
              if (allowedRolesInGuild.length === 0) warnDeleteMsg();
              const allowedMemberPremsRoles = await allowedRolesInGuild.filter(
                (ID) => message.member.roles.cache.has(ID)
              );
              if (allowedMemberPremsRoles && allowedMemberPremsRoles.length > 0)
                warnDeleteMsg();
            }
          }
        }
      }
      const antiSpamChecker = (await db.get("antispam-on-off")) || {};
      if (
        antiSpamChecker[message.guild.id] &&
        antiSpamChecker[message.guild.id] == "on" &&
        !antiSpamChecker[message.guild.id] == "off"
      ) {
        const filter = (m) =>
          m.author.id != client.user.id && m.author == message.author;
        const spammerKiller = async (collected) => {
          if (collected) {
            message.channel.messages
              .fetch({
                limit: 20,
              })
              .then((messages) => {
                let spammerMessages = [];
                messages
                  .filter((m) => m.author.id === message.author.id)
                  .forEach((msg) => spammerMessages.push(msg));
                message.channel.bulkDelete(spammerMessages);
              });
          } else collected.forEach((m) => m.delete());
          const muteRole = await db.get("mute_roles")[message.guild.id];
          if (!message.member.roles.cache.has(muteRole)) {
            message.channel.send({ content: "إزعاج" });
            mute(message, message.member);
          }
        };
        const allowed = (await db.get("antispam_protection/allowed")) || {};
        const allowedRolesInGuild = allowed[message.guild.id];
        const spamCollector = message.channel.createMessageCollector(filter, {
          max: 3,
          time: 5 * 1000,
        });
        spamCollector.on("end", async (collected) => {
          if (collected.size == spamCollector.options.max) {
            if (!allowedRolesInGuild) {
              await spammerKiller(collected);
            } else if (allowedRolesInGuild) {
              if (allowedRolesInGuild.length === 0)
                await spammerKiller(collected);
              const allowedMemberPremsRoles = await allowedRolesInGuild.filter(
                (ID) => message.member.roles.cache.has(ID)
              );
              if (allowedMemberPremsRoles && allowedMemberPremsRoles.length > 0)
                await spammerKiller();
            }
          }
        });
      }
    }
  });
};

module.exports.config = {
  displayName: "MessageCreateEvent",
  dbName: "MESSAGE CREATE EVENT", // This should NEVER be changed once set, and users cannot see it.
};
