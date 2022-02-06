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
    const prefix = instance.getPrefix(message.guild) || config.prefix;
    const guildMusicData = ((await db.get("MusicChannels")) || {})[
      message.guild.id
    ];
    if (guildMusicData && message.channel.id === guildMusicData.channel) {
      if (message.author.id === client.user.id) {
        if (message.id === guildMusicData.message) return;
        setTimeout(() => {
          if (message.deletable) message.delete();
        }, 1000 * 5);
      } else {
        if (message.deletable) {
          message.channel.messages.fetch().then((msgs) => {
            msgs
              .filter((msg) => msg.author.id !== client.user.id)
              .forEach((msg) => {
                if (msg) msg.delete();
              });
          });
        } else {
          musicChannel.send({
            content: "> 💢 **يرجى إعطاء البوت الصلاحيات المطلوبة** 💢",
          });
        }
        if (message.content.startsWith(prefix)) return;
        const musicChannel = message.guild.channels.cache.get(
          guildMusicData.channel
        );
        if (message.member.voice.channel) {
          client.distube.play(message.member.voice.channel, message.content, {
            textChannel: musicChannel,
            member: message.member,
          });
        } else
          return message.channel.send({
            content: "**❌ | إنضم لغرفة صوتية أولا**",
          });
      }
    }
    if (message.author.bot || message.webhookId) return;
    if (message.content.includes("@someone")) {
      message.channel
        .fetchWebhooks((webhook) => webhook.name === message.member.displayName)
        .then((webhooks) => {
          if (webhooks.size < 1) {
            message.channel
              .createWebhook(message.member.displayName, {
                avatar: message.member.displayAvatarURL({ dynamic: true }),
                reason: "😂 | بندور على شخص عشوائي",
              })
              .then((webhook) => {
                if (message.deletable) message.delete();
                const memberID = message.guild.members.cache.random().id;
                webhook.send({
                  content: message.content.replace(
                    "@someone",
                    `<@!${memberID}>`
                  ),
                });
              })
              .catch(console.error);
          } else {
            if (webhooks.size > 1) {
              const selected = webhooks.toJSON().pop();
              if (message.deletable) message.delete();
              const memberID = message.guild.members.cache.random().id;
              selected
                .send({
                  content: message.content.replace(
                    "@someone",
                    `<@!${memberID}>`
                  ),
                })
                .then(() => {
                  webhooks.forEach((webhook) => {
                    webhook.delete("😭 | عفى عليه الزمن");
                  });
                });
            } else {
              webhooks.forEach((webhook) => {
                if (message.deletable) message.delete();
                const memberID = message.guild.members.cache.random().id;
                webhook.send({
                  content: message.content.replace(
                    "@someone",
                    `<@!${memberID}>`
                  ),
                });
              });
            }
          }
        });
    }
    const letters = message.content.trim().split("");
    const giveCoins = require("../functions/giveCoins");
    giveCoins(message.author.id, letters.length);
    if (
      message.mentions.has(client.user.id) &&
      (!message.content.includes("@here") ||
        !message.content.includes("@everyone")) &&
      message.mentions.users.first() === client.user
    ) {
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
      const AntiSpam = require("discord-anti-spam");
      const antiSpam = new AntiSpam({
        warnThreshold: 3,
        muteThreshold: 4,
        kickThreshold: 7,
        banThreshold: 7,
        maxInterval: 2000,
        warnMessage: "{@user}, أوقف الإزعاج.",
        kickMessage: "**{user_tag}** أزعجني فتم طرده.",
        muteMessage: "**{user_tag}** أزعجني فتم حظرة كتابيا.",
        banMessage: "**{user_tag}** أزعجني غتم حظره.",
        maxDuplicatesWarning: 6,
        maxDuplicatesKick: 10,
        maxDuplicatesBan: 12,
        maxDuplicatesMute: 8,
        ignoredPermissions: ["ADMINISTRATOR"],
        ignoreBots: true,
        verbose: true,
        ignoredMembers: config.devs,
        unMuteTime: 10,
        removeMessages: true,
        modLogsEnabled: false,
        modLogsChannelName: "المدونة",
        modLogsMode: "embed",
      });
      if (
        antiSpamChecker[message.guild.id] &&
        antiSpamChecker[message.guild.id] == "on" &&
        !antiSpamChecker[message.guild.id] == "off"
      ) {
        const allowed = (await db.get("antispam_protection/allowed")) || {};
        const allowedRolesInGuild = allowed[message.guild.id];
        if (!allowedRolesInGuild) {
          antiSpam.message(message);
        } else {
          if (allowedRolesInGuild.length === 0) antiSpam.message(message);
          if (
            allowedRolesInGuild.some((ID) => message.member.roles.cache.has(ID))
          )
            antiSpam.message(message);
        }
      }
    }
  });
};

module.exports.config = {
  displayName: "MessageCreateEvent",
  dbName: "MESSAGE CREATE EVENT", // This should NEVER be changed once set, and users cannot see it.
};
