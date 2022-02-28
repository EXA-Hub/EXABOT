const { MessageEmbed, TextChannel, Guild } = require("discord.js");
const { client } = require("../index");
/**
 *
 * @param {MessageEmbed} logEmbed
 * @param {TextChannel} logChannel
 */
const webhook = (logChannel, logEmbed) => {
  const bot = client.user;
  logChannel
    .fetchWebhooks((webhook) => webhook.name === bot.username)
    .then((webhooks) => {
      if (webhooks.size < 1) {
        logChannel
          .createWebhook(bot.username, {
            avatar: bot.avatarURL({ dynamic: true }),
            reason: "Logs channel",
          })
          .then((webhook) => {
            webhook.send({ embeds: [logEmbed] });
          })
          .catch(console.error);
      } else {
        if (webhooks.size > 1) {
          const selected = webhooks.toJSON().pop();
          selected.send({ embeds: [logEmbed] }).then(() => {
            webhooks.forEach((webhook) => {
              webhook.delete("😭 | عفى عليه الزمن");
            });
          });
        } else {
          webhooks.forEach((webhook) => {
            webhook.send({ embeds: [logEmbed] });
          });
        }
      }
    });
};
/**
 * @param {client} client
 */
module.exports = async (client, instance) => {
  console.log(
    `${client.channels.cache.size} channels on ${client.guilds.cache.size} servers, for a total of ${client.users.cache.size} users.`
  );
  const db = require("../functions/database");
  const config = require("../data/config");
  const owner = client.users.cache.get(config.owner);
  /**
   *
   * @param {Guild} guild
   * @returns
   */
  const getLogChannel = async (guild) => {
    if (!guild) return false;
    const logsCheck = (await db.get("logs_on-off")) || {};
    const logsChannel = (await db.get("logs_channels")) || {};
    if (!logsCheck[guild.id] || logsCheck[guild.id] == "off") return false;
    if (!logsChannel[guild.id]) return false;
    const logChannel = guild.channels.cache.get(logsChannel[guild.id]);
    return logChannel;
  };

  client.on("channelCreate", async (channel) => {
    if (!channel.guild) return;
    const logChannel = await getLogChannel(channel.guild);
    if (!logChannel) return;
    const logEmbed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("تم إنشاء قناة")
      .setURL(config.support.server.invite.link)
      .setDescription(`${channel}`)
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      });
    return webhook(logChannel, logEmbed);
  });

  client.on("channelDelete", async (channel) => {
    if (!channel.guild) return;
    const logChannel = await getLogChannel(channel.guild);
    if (!logChannel) return;
    const logEmbed = new MessageEmbed()
      .setColor("RED")
      .setTitle("تم حذف قناة")
      .setURL(config.support.server.invite.link)
      .setDescription(`${channel.name}`)
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      });
    return webhook(logChannel, logEmbed);
  });

  client.on("channelUpdate", async (oldChannel, newChannel) => {
    if (!oldChannel.guild) return;
    if (
      oldChannel.name === newChannel.name &&
      oldChannel.topic === newChannel.topic &&
      oldChannel.type === newChannel.type
    )
      return;
    const logChannel = await getLogChannel(oldChannel.guild);
    if (!logChannel) return;
    const logEmbed = new MessageEmbed()
      .setTitle("تعديل على قناة")
      .setURL(config.support.server.invite.link)
      .setColor("GREEN")
      .setDescription(`${newChannel}`)
      .addField(
        "⚙️ قبل التعديل:",
        `**الإسم: \`${oldChannel.name}\`**\n**الوصف: \`${oldChannel.topic}\`**\n**النوع: \`${oldChannel.type}\`**`,
        true
      )
      .addField(
        "🚀 بعد التعديل:",
        `**الإسم: \`${newChannel.name}\`**\n**الوصف: \`${newChannel.topic}\`**\n**النوع: \`${newChannel.type}\`**`,
        true
      )
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      });
    return webhook(logChannel, logEmbed);
  });

  client.on("emojiCreate", async (emoji) => {
    if (!emoji.guild) return;
    const logChannel = await getLogChannel(emoji.guild);
    if (!logChannel) return;
    const logEmbed = new MessageEmbed()
      .setTitle("تم إضافة إيموجي")
      .setColor("#0099ff")
      .setURL(config.support.server.invite.link)
      .setDescription(`\`${emoji}\``)
      .setImage(emoji.url)
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      });
    return webhook(logChannel, logEmbed);
  });

  client.on("emojiDelete", async (emoji) => {
    if (!emoji.guild) return;
    const logChannel = await getLogChannel(emoji.guild);
    if (!logChannel) return;
    const logEmbed = new MessageEmbed()
      .setTitle("تم حذف إيموجي")
      .setColor("RED")
      .setURL(config.support.server.invite.link)
      .setDescription(`\`${emoji}\``)
      .setImage(emoji.url)
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      });
    return webhook(logChannel, logEmbed);
  });

  client.on("emojiUpdate", async (oldEmoji, newEmoji) => {
    if (!oldEmoji.guild) return;
    const logChannel = await getLogChannel(oldEmoji.guild);
    if (!logChannel) return;
    const logEmbed = new MessageEmbed()
      .setTitle(`تعديل على إيموجي ${newEmoji}`)
      .setURL(config.support.server.invite.link)
      .setColor("GREEN")
      .addField("⚙️ قبل التعديل:", `\`${oldEmoji.name}\``, true)
      .addField("🚀 بعد التعديل:", `\`${newEmoji.name}\``, true)
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      });
    return webhook(logChannel, logEmbed);
  });

  client.on("guildBanAdd", async (guild, user) => {
    const logChannel = await getLogChannel(guild);
    if (!logChannel) return;
    const logEmbed = new MessageEmbed()
      .setTimestamp()
      .setColor("RED")
      .setTitle("تم حظر عضو")
      .setURL(config.support.server.invite.link)
      .setAuthor({
        name: user.username,
        iconURL: user.avatarURL({ dynamic: true }),
      })
      .setDescription(`${user}`)
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      });
    return webhook(logChannel, logEmbed);
  });

  client.on("guildBanRemove", async (guild, user) => {
    const logChannel = await getLogChannel(guild);
    if (!logChannel) return;
    const logEmbed = new MessageEmbed()
      .setTimestamp()
      .setColor("BLUE")
      .setTitle("تم فك حظر عضو")
      .setURL(config.support.server.invite.link)
      .setAuthor({
        name: user.username,
        iconURL: user.avatarURL({ dynamic: true }),
      })
      .setDescription(`${user}`)
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      });
    return webhook(logChannel, logEmbed);
  });

  client.on("messageDelete", async (message) => {
    if (!message.guild) return;
    const logChannel = await getLogChannel(message.guild);
    if (!logChannel) return;
    // if (message.channel.id === message.guild.systemChannel.id) return;
    const logEmbed = new MessageEmbed()
      .setColor("RED")
      .setTitle("تم حذف رسالة")
      .setURL(config.support.server.invite.link)
      .setAuthor({
        name: message.author.tag,
        iconURL: message.author.avatarURL({ dynamic: true }),
      })
      .setDescription(`\`${message.content}\``)
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      });
    return webhook(logChannel, logEmbed);
  });

  client.on("guildMemberBoost", async (member) => {
    if (!member.guild) return;
    const logChannel = await getLogChannel(member.guild);
    if (!logChannel) return;
    const logEmbed = new MessageEmbed()
      .setTimestamp()
      .setColor("LUMINOUS_VIVID_PINK")
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      })
      .setTitle("نرقية جديدة في المجتمع <:emoji_71:944938505975504956>")
      .setDescription(`قام ${member.user.tag} بترقية المجتمع`);
    return webhook(logChannel, logEmbed);
  });

  client.on("guildMemberUnboost", async (member) => {
    if (!member.guild) return;
    const logChannel = await getLogChannel(member.guild);
    if (!logChannel) return;
    const logEmbed = new MessageEmbed()
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      })
      .setColor("DARK_VIVID_PINK")
      .setTitle(
        "إزالة ترقية المجتمع نرقية في المجتمع <:emoji_71:944938505975504956>"
      )
      .setDescription(`قام ${member.user.tag} بإزالة ترقية المجتمع`);
    return webhook(logChannel, logEmbed);
  });

  client.on("guildMemberRoleAdd", async (member, role) => {
    if (!member.guild) return;
    const logChannel = await getLogChannel(member.guild);
    if (!logChannel) return;
    const logEmbed = new MessageEmbed()
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      })
      .setColor("GREEN")
      .setTitle("`" + member.user.tag + "` حصل على رتبة: `" + role.name + "`");
    return webhook(logChannel, logEmbed);
  });

  client.on("guildMemberRoleRemove", async (member, role) => {
    if (!member.guild) return;
    const logChannel = await getLogChannel(member.guild);
    if (!logChannel) return;
    const logEmbed = new MessageEmbed()
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      })
      .setColor("RED")
      .setTitle("`" + member.user.tag + "` خسر رتبة: `" + role.name + "`");
    return webhook(logChannel, logEmbed);
  });

  client.on(
    "guildMemberNicknameUpdate",
    async (member, oldNickname, newNickname) => {
      if (!member.guild) return;
      const logChannel = await getLogChannel(member.guild);
      if (!logChannel) return;
      const logEmbed = new MessageEmbed()
        .setTimestamp()
        .setFooter({
          text: `Bot Developer: ${owner.tag}`,
          iconURL: owner.avatarURL({ dynamic: true }),
        })
        .setColor("DARK_GREY")
        .setTitle(member.user.tag + "تغير في اللقب")
        .setDescription(
          "**🚀 لقبه الأن: `" +
            newNickname +
            "`\n⚙ سابقا: `" +
            oldNickname +
            "`**"
        );
      return webhook(logChannel, logEmbed);
    }
  );

  client.on("guildBoostLevelUp", async (guild, oldLevel, newLevel) => {
    const logChannel = await getLogChannel(guild);
    if (!logChannel) return;
    const logEmbed = new MessageEmbed()
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      })
      .setColor(config.bot.color.hex)
      .setTitle(
        guild.name + " وصل للمستوى: " + newLevel + " من المستوى: " + oldLevel
      );
    return webhook(logChannel, logEmbed);
  });

  client.on("guildBoostLevelDown", async (guild, oldLevel, newLevel) => {
    if (!guild) return;
    const logChannel = await getLogChannel(guild);
    if (!logChannel) return;
    const logEmbed = new MessageEmbed()
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      })
      .setColor("RED")
      .setTitle(
        guild.name + " وصل للمستوى: " + newLevel + " من المستوى: " + oldLevel
      );
    return webhook(logChannel, logEmbed);
  });

  client.on("guildBannerAdd", async (guild, bannerURL) => {
    if (!guild) return;
    const logChannel = await getLogChannel(guild);
    if (!logChannel) return;
    const logEmbed = new MessageEmbed()
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      })
      .setColor(config.bot.color.hex)
      .setTitle(guild.name + " حصل على لافتة!")
      .setImage(bannerURL);
    return webhook(logChannel, logEmbed);
  });

  client.on("guildAfkChannelAdd", async (guild, afkChannel) => {
    if (!guild) return;
    const logChannel = await getLogChannel(guild);
    if (!logChannel) return;
    const logEmbed = new MessageEmbed()
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      })
      .setColor("DARK_GOLD")
      .setTitle(guild.name + " حصل على غرفة صمت!")
      .setDescription(`🔇 غرفة الصمت هي: ${afkChannel}`);
    return webhook(logChannel, logEmbed);
  });

  client.on("guildVanityURLAdd", async (guild, vanityURL) => {
    if (!guild) return;
    const logChannel = await getLogChannel(guild);
    if (!logChannel) return;
    const logEmbed = new MessageEmbed()
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      })
      .setColor(config.bot.color.hex)
      .setTitle(guild.name + " لديه رابط مخصص بإسم: " + vanityURL);
    return webhook(logChannel, logEmbed);
  });

  client.on("guildVanityURLRemove", async (guild, vanityURL) => {
    if (!guild) return;
    const logChannel = await getLogChannel(guild);
    if (!logChannel) return;
    const logEmbed = new MessageEmbed()
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      })
      .setColor("DARK_RED")
      .setTitle(guild.name + " خسر رابط مخصص بإسم: " + vanityURL);
    return webhook(logChannel, logEmbed);
  });

  client.on(
    "guildVanityURLUpdate",
    async (guild, oldVanityURL, newVanityURL) => {
      if (!guild) return;
      const logChannel = await getLogChannel(guild);
      if (!logChannel) return;
      const logEmbed = new MessageEmbed()
        .setTimestamp()
        .setFooter({
          text: `Bot Developer: ${owner.tag}`,
          iconURL: owner.avatarURL({ dynamic: true }),
        })
        .setColor("YELLOW")
        .setTitle(
          `${guild.name} غير رابطه المخصص من ${oldVanityURL} إلى ${newVanityURL} !`
        );
      return webhook(logChannel, logEmbed);
    }
  );

  client.on("guildFeaturesUpdate", async (oldGuild, newGuild) => {
    if (!oldGuild) return;
    const logChannel = await getLogChannel(oldGuild);
    if (!logChannel) return;
    const logEmbed = new MessageEmbed()
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      })
      .setColor("DARK_GOLD")
      .setTitle("تغير في خصائص المجتمع")
      .addField("⚙️ الخصائص القديمة", oldGuild.features.join(", "))
      .addField("🚀 الخصائص الجديدة", newGuild.features.join(", "));
    return webhook(logChannel, logEmbed);
  });

  client.on("guildOwnerUpdate", async (oldGuild, newGuild) => {
    if (!oldGuild) return;
    const logChannel = await getLogChannel(oldGuild);
    if (!logChannel) return;
    const logEmbed = new MessageEmbed()
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      })
      .setColor("RED")
      .setTitle("☣ تغير مالك المجتمع ☣")
      .setDescription(
        `☣المالك القديم: <@${oldGuild.owner.id}>☣\n☣المالك الجديد:<@${newGuild.owner.id}>☣`
      );
    return webhook(logChannel, logEmbed);
  });

  client.on("guildPartnerAdd", async (guild) => {
    if (!guild) return;
    const logChannel = await getLogChannel(guild);
    if (!logChannel) return;
    const logEmbed = new MessageEmbed()
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      })
      .setColor(config.bot.color.hex)
      .setTitle(
        "<:emoji_63:944716459584679977>" +
          guild.name +
          " حصل على شراكة مع ديسكورد! 🥳"
      );
    return webhook(logChannel, logEmbed);
  });

  client.on("guildPartnerRemove", async (guild) => {
    if (!guild) return;
    const logChannel = await getLogChannel(guild);
    if (!logChannel) return;
    const logEmbed = new MessageEmbed()
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      })
      .setColor("DARK_RED")
      .setTitle(
        "<:emoji_63:944716459584679977>" +
          guild.name +
          " خسر الشراكة مع ديسكورد!"
      );
    return webhook(logChannel, logEmbed);
  });

  client.on("guildVerificationAdd", async (guild) => {
    if (!guild) return;
    const logChannel = await getLogChannel(guild);
    if (!logChannel) return;
    const logEmbed = new MessageEmbed()
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      })
      .setColor(config.bot.color.hex)
      .setTitle(
        "<:emoji_55:944715850689171548>" +
          guild.name +
          " حصل على توثيق من ديسكورد! 🥳"
      );
    return webhook(logChannel, logEmbed);
  });

  client.on("guildVerificationRemove", async (guild) => {
    if (!guild) return;
    const logChannel = await getLogChannel(guild);
    if (!logChannel) return;
    const logEmbed = new MessageEmbed()
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      })
      .setColor("DARK_RED")
      .setTitle(
        "<:emoji_55:944715850689171548>" +
          guild.name +
          " خسر التوثيق من الديسكورد!"
      );
    return webhook(logChannel, logEmbed);
  });

  client.on("messagePinned", async (message) => {
    if (!message.guild) return;
    const logChannel = await getLogChannel(message.guild);
    if (!logChannel) return;
    const logEmbed = new MessageEmbed()
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      })
      .setColor("NAVY")
      .setTitle("تم تثبيت رسالة")
      .setURL(message.url)
      .setDescription(
        "**📌 هذه الرسالة قد ثبتت: `" +
          message +
          `\`\nفي هذه الغرفة: <#${message.channel.id}>**`
      );
    return webhook(logChannel, logEmbed);
  });

  client.on("messageContentEdited", async (message, oldContent, newContent) => {
    if (!message.guild) return;
    const logChannel = await getLogChannel(message.guild);
    if (!logChannel) return;
    const logEmbed = new MessageEmbed()
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      })
      .setColor("YELLOW")
      .setTitle("تغير في محتوى الرسالة")
      .setURL(message.url)
      .addField("⚙️ المحتوى القديم:", oldContent)
      .addField("🚀 المحتوى الجديد:", newContent);
    return webhook(logChannel, logEmbed);
  });
};

module.exports.config = {
  displayName: "LogsEvents",
  dbName: "LOGS EVENTS", // This should NEVER be changed once set, and users cannot see it.
};
