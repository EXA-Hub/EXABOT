const Discord = require("discord.js");

/**
 * @param {Discord.Client} client
 */

module.exports = async (client, instance) => {
  console.log(
    `${client.channels.cache.size} channels on ${client.guilds.cache.size} servers, for a total of ${client.users.cache.size} users.`
  );
  const db = require("../functions/database");
  const config = require("../data/config");

  //   client.on("messageCreate", async (message) => {
  //     if (!message.guild) return;
  // const logsCheck = (await db.get("logs_on-off")) || {};
  // const logsChannel = (await db.get("logs_channels")) || {};
  //     if (!logsCheck[message.guild.id] || logsCheck[message.guild.id] == "off")
  //       return;
  //     if (!logsChannel[message.guild.id]) return;
  //     const owner = client.users.cache.get(config.owner);
  //     const logChannel = message.guild.channels.cache.get(
  //       logsChannel[message.guild.id]
  //     );
  //     const logEmbed = new Discord.MessageEmbed().setTimestamp().setFooter({
  //       text: `Bot Developer: ${owner.tag}`,
  //       iconURL: owner.avatarURL({ dynamic: true }),
  //     });
  //     // return logChannel.send({embeds:[logEmbed]});
  //   });

  client.on("channelCreate", async (channel) => {
    if (!channel.guild) return;
    const logsCheck = (await db.get("logs_on-off")) || {};
    const logsChannel = (await db.get("logs_channels")) || {};
    if (!logsCheck[channel.guild.id] || logsCheck[channel.guild.id] == "off")
      return;
    if (!logsChannel[channel.guild.id]) return;
    const owner = client.users.cache.get(config.owner);
    const logChannel = channel.guild.channels.cache.get(
      logsChannel[channel.guild.id]
    );
    const channelDeleted = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle("تم إنشاء قناة")
      .setURL(config.support.server.invite.link)
      .setDescription(`${channel}`)
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      });
    return logChannel.send({ embeds: [channelDeleted] });
  });

  client.on("channelDelete", async (channel) => {
    if (!channel.guild) return;
    const logsCheck = (await db.get("logs_on-off")) || {};
    const logsChannel = (await db.get("logs_channels")) || {};
    if (!logsCheck[channel.guild.id] || logsCheck[channel.guild.id] == "off")
      return;
    if (!logsChannel[channel.guild.id]) return;
    const owner = client.users.cache.get(config.owner);
    const logChannel = channel.guild.channels.cache.get(
      logsChannel[channel.guild.id]
    );
    const channelDeleted = new Discord.MessageEmbed()
      .setColor("RED")
      .setTitle("تم حذف قناة")
      .setURL(config.support.server.invite.link)
      .setDescription(`${channel.name}`)
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      });
    return logChannel.send({ embeds: [channelDeleted] });
  });

  client.on("channelUpdate", async (oldChannel, newChannel) => {
    if (!oldChannel.guild) return;
    if (
      oldChannel.name === newChannel.name &&
      oldChannel.topic === newChannel.topic &&
      oldChannel.type === newChannel.type
    )
      return;
    const logsCheck = (await db.get("logs_on-off")) || {};
    const logsChannel = (await db.get("logs_channels")) || {};
    if (
      !logsCheck[oldChannel.guild.id] ||
      logsCheck[oldChannel.guild.id] == "off"
    )
      return;
    if (!logsChannel[oldChannel.guild.id]) return;
    const owner = client.users.cache.get(config.owner);
    const logChannel = oldChannel.guild.channels.cache.get(
      logsChannel[oldChannel.guild.id]
    );
    const channelDeleted = new Discord.MessageEmbed()
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
    return logChannel.send({ embeds: [channelDeleted] });
  });

  client.on("emojiCreate", async (emoji) => {
    if (!emoji.guild) return;
    const logsCheck = (await db.get("logs_on-off")) || {};
    const logsChannel = (await db.get("logs_channels")) || {};
    if (!logsCheck[emoji.guild.id] || logsCheck[emoji.guild.id] == "off")
      return;
    if (!logsChannel[emoji.guild.id]) return;
    const owner = client.users.cache.get(config.owner);
    const logChannel = emoji.guild.channels.cache.get(
      logsChannel[emoji.guild.id]
    );
    const logEmbed = new Discord.MessageEmbed()
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
    return logChannel.send({ embeds: [logEmbed] });
  });

  client.on("emojiDelete", async (emoji) => {
    if (!emoji.guild) return;
    const logsCheck = (await db.get("logs_on-off")) || {};
    const logsChannel = (await db.get("logs_channels")) || {};
    if (!logsCheck[emoji.guild.id] || logsCheck[emoji.guild.id] == "off")
      return;
    if (!logsChannel[emoji.guild.id]) return;
    const owner = client.users.cache.get(config.owner);
    const logChannel = emoji.guild.channels.cache.get(
      logsChannel[emoji.guild.id]
    );
    const logEmbed = new Discord.MessageEmbed()
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
    return logChannel.send({ embeds: [logEmbed] });
  });

  client.on("emojiUpdate", async (oldEmoji, newEmoji) => {
    if (!oldEmoji.guild) return;
    const logsCheck = (await db.get("logs_on-off")) || {};
    const logsChannel = (await db.get("logs_channels")) || {};
    if (!logsCheck[oldEmoji.guild.id] || logsCheck[oldEmoji.guild.id] == "off")
      return;
    if (!logsChannel[oldEmoji.guild.id]) return;
    const owner = client.users.cache.get(config.owner);
    const logChannel = oldEmoji.guild.channels.cache.get(
      logsChannel[oldEmoji.guild.id]
    );
    const channelDeleted = new Discord.MessageEmbed()
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
    return logChannel.send({ embeds: [channelDeleted] });
  });

  client.on("guildBanAdd", async (guild, user) => {
    const logsCheck = (await db.get("logs_on-off")) || {};
    const logsChannel = (await db.get("logs_channels")) || {};
    if (!logsCheck[guild.id] || logsCheck[guild.id] == "off") return;
    if (!logsChannel[guild.id]) return;
    const owner = client.users.cache.get(config.owner);
    const logChannel = guild.channels.cache.get(logsChannel[guild.id]);
    const logEmbed = new Discord.MessageEmbed()
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
    return logChannel.send({ embeds: [logEmbed] });
  });

  client.on("guildBanRemove", async (guild, user) => {
    const logsCheck = (await db.get("logs_on-off")) || {};
    const logsChannel = (await db.get("logs_channels")) || {};
    if (!logsCheck[guild.id] || logsCheck[guild.id] == "off") return;
    if (!logsChannel[guild.id]) return;
    const owner = client.users.cache.get(config.owner);
    const logChannel = guild.channels.cache.get(logsChannel[guild.id]);
    const logEmbed = new Discord.MessageEmbed()
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
    return logChannel.send({ embeds: [logEmbed] });
  });

  client.on("messageDelete", async (message) => {
    if (!message.guild) return;
    const logsCheck = (await db.get("logs_on-off")) || {};
    const logsChannel = (await db.get("logs_channels")) || {};
    if (!logsCheck[message.guild.id] || logsCheck[message.guild.id] == "off")
      return;
    if (!logsChannel[message.guild.id]) return;
    if (!message.author) return;
    if (
      message.author.id == client.user.id &&
      message.channel.id == logsChannel[message.guild.id]
    )
      return;
    if (message.channel.id == message.guild.systemChannel.id) return;
    const owner = client.users.cache.get(config.owner);
    const logChannel = message.guild.channels.cache.get(
      logsChannel[message.guild.id]
    );
    const messageDeleted = new Discord.MessageEmbed()
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
    return logChannel.send({ embeds: [messageDeleted] });
  });

  client.on("guildMemberUnboost", async (member) => {
    if (!member.guild) return;
    const logsCheck = (await db.get("logs_on-off")) || {};
    const logsChannel = (await db.get("logs_channels")) || {};
    if (!logsCheck[member.guild.id] || logsCheck[member.guild.id] == "off")
      return;
    if (!logsChannel[member.guild.id]) return;
    const owner = client.users.cache.get(config.owner);
    const logChannel = member.guild.channels.cache.get(
      logsChannel[member.guild.id]
    );
    const logEmbed = new Discord.MessageEmbed()
      .setTimestamp()
      .setColor("LUMINOUS_VIVID_PINK")
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      })
      .setTitle("نرقية جديدة في المجتمع <:emoji_71:944938505975504956>")
      .setDescription(`قام ${member.user.tag} بترقية المجتمع`);
    return logChannel.send({ embeds: [logEmbed] });
  });

  client.on("guildMemberBoost", async (member) => {
    if (!member.guild) return;
    const logsCheck = (await db.get("logs_on-off")) || {};
    const logsChannel = (await db.get("logs_channels")) || {};
    if (!logsCheck[member.guild.id] || logsCheck[member.guild.id] == "off")
      return;
    if (!logsChannel[member.guild.id]) return;
    const owner = client.users.cache.get(config.owner);
    const logChannel = member.guild.channels.cache.get(
      logsChannel[member.guild.id]
    );
    const logEmbed = new Discord.MessageEmbed()
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
    return logChannel.send({ embeds: [logEmbed] });
  });

  client.on("guildMemberRoleAdd", async (member, role) => {
    if (!member.guild) return;
    const logsCheck = (await db.get("logs_on-off")) || {};
    const logsChannel = (await db.get("logs_channels")) || {};
    if (!logsCheck[member.guild.id] || logsCheck[member.guild.id] == "off")
      return;
    if (!logsChannel[member.guild.id]) return;
    const owner = client.users.cache.get(config.owner);
    const logChannel = member.guild.channels.cache.get(
      logsChannel[member.guild.id]
    );
    const logEmbed = new Discord.MessageEmbed()
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      })
      .setColor("GREEN")
      .setTitle("`" + member.user.tag + "` حصل على رتبة: `" + role.name + "`");
    return logChannel.send({ embeds: [logEmbed] });
  });

  client.on("guildMemberRoleRemove", async (member, role) => {
    if (!member.guild) return;
    const logsCheck = (await db.get("logs_on-off")) || {};
    const logsChannel = (await db.get("logs_channels")) || {};
    if (!logsCheck[member.guild.id] || logsCheck[member.guild.id] == "off")
      return;
    if (!logsChannel[member.guild.id]) return;
    const owner = client.users.cache.get(config.owner);
    const logChannel = member.guild.channels.cache.get(
      logsChannel[member.guild.id]
    );
    const logEmbed = new Discord.MessageEmbed()
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      })
      .setColor("RED")
      .setTitle("`" + member.user.tag + "` خسر رتبة: `" + role.name + "`");
    return logChannel.send({ embeds: [logEmbed] });
  });

  client.on(
    "guildMemberNicknameUpdate",
    async (member, oldNickname, newNickname) => {
      if (!member.guild) return;
      const logsCheck = (await db.get("logs_on-off")) || {};
      const logsChannel = (await db.get("logs_channels")) || {};
      if (!logsCheck[member.guild.id] || logsCheck[member.guild.id] == "off")
        return;
      if (!logsChannel[member.guild.id]) return;
      const owner = client.users.cache.get(config.owner);
      const logChannel = member.guild.channels.cache.get(
        logsChannel[member.guild.id]
      );
      const logEmbed = new Discord.MessageEmbed()
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
      return logChannel.send({ embeds: [logEmbed] });
    }
  );

  client.on("guildBoostLevelUp", async (guild, oldLevel, newLevel) => {
    if (!message.guild) return;
    const logsCheck = (await db.get("logs_on-off")) || {};
    const logsChannel = (await db.get("logs_channels")) || {};
    if (!logsCheck[message.guild.id] || logsCheck[message.guild.id] == "off")
      return;
    if (!logsChannel[message.guild.id]) return;
    const owner = client.users.cache.get(config.owner);
    const logChannel = message.guild.channels.cache.get(
      logsChannel[message.guild.id]
    );
    const logEmbed = new Discord.MessageEmbed()
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      })
      .setColor(config.bot.color.hex)
      .setTitle(
        guild.name + " وصل للمستوى: " + newLevel + " من المستوى: " + oldLevel
      );
    return logChannel.send({ embeds: [logEmbed] });
  });

  client.on("guildBoostLevelDown", async (guild, oldLevel, newLevel) => {
    if (!guild) return;
    const logsCheck = (await db.get("logs_on-off")) || {};
    const logsChannel = (await db.get("logs_channels")) || {};
    if (!logsCheck[guild.id] || logsCheck[guild.id] == "off") return;
    if (!logsChannel[guild.id]) return;
    const owner = client.users.cache.get(config.owner);
    const logChannel = guild.channels.cache.get(logsChannel[guild.id]);
    const logEmbed = new Discord.MessageEmbed()
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      })
      .setColor("RED")
      .setTitle(
        guild.name + " وصل للمستوى: " + newLevel + " من المستوى: " + oldLevel
      );
    return logChannel.send({ embeds: [logEmbed] });
  });

  client.on("guildBannerAdd", async (guild, bannerURL) => {
    if (!guild) return;
    const logsCheck = (await db.get("logs_on-off")) || {};
    const logsChannel = (await db.get("logs_channels")) || {};
    if (!logsCheck[guild.id] || logsCheck[guild.id] == "off") return;
    if (!logsChannel[guild.id]) return;
    const owner = client.users.cache.get(config.owner);
    const logChannel = guild.channels.cache.get(logsChannel[guild.id]);
    const logEmbed = new Discord.MessageEmbed()
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      })
      .setColor(config.bot.color.hex)
      .setTitle(guild.name + " حصل على لافتة!")
      .setImage(bannerURL);
    return logChannel.send({ embeds: [logEmbed] });
  });

  client.on("guildAfkChannelAdd", async (guild, afkChannel) => {
    if (!guild) return;
    const logsCheck = (await db.get("logs_on-off")) || {};
    const logsChannel = (await db.get("logs_channels")) || {};
    if (!logsCheck[guild.id] || logsCheck[guild.id] == "off") return;
    if (!logsChannel[guild.id]) return;
    const owner = client.users.cache.get(config.owner);
    const logChannel = guild.channels.cache.get(logsChannel[guild.id]);
    const logEmbed = new Discord.MessageEmbed()
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      })
      .setColor("DARK_GOLD")
      .setTitle(guild.name + " حصل على غرفة صمت!")
      .setDescription(`🔇 غرفة الصمت هي: ${afkChannel}`);
    return logChannel.send({ embeds: [logEmbed] });
  });

  client.on("guildVanityURLAdd", async (guild, vanityURL) => {
    if (!guild) return;
    const logsCheck = (await db.get("logs_on-off")) || {};
    const logsChannel = (await db.get("logs_channels")) || {};
    if (!logsCheck[guild.id] || logsCheck[guild.id] == "off") return;
    if (!logsChannel[guild.id]) return;
    const owner = client.users.cache.get(config.owner);
    const logChannel = guild.channels.cache.get(logsChannel[guild.id]);
    const logEmbed = new Discord.MessageEmbed()
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      })
      .setColor(config.bot.color.hex)
      .setTitle(guild.name + " لديه رابط مخصص بإسم: " + vanityURL);
    return logChannel.send({ embeds: [logEmbed] });
  });

  client.on("guildVanityURLRemove", async (guild, vanityURL) => {
    if (!guild) return;
    const logsCheck = (await db.get("logs_on-off")) || {};
    const logsChannel = (await db.get("logs_channels")) || {};
    if (!logsCheck[guild.id] || logsCheck[guild.id] == "off") return;
    if (!logsChannel[guild.id]) return;
    const owner = client.users.cache.get(config.owner);
    const logChannel = guild.channels.cache.get(logsChannel[guild.id]);
    const logEmbed = new Discord.MessageEmbed()
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      })
      .setColor("DARK_RED")
      .setTitle(guild.name + " خسر رابط مخصص بإسم: " + vanityURL);
    return logChannel.send({ embeds: [logEmbed] });
  });

  client.on(
    "guildVanityURLUpdate",
    async (guild, oldVanityURL, newVanityURL) => {
      if (!guild) return;
      const logsCheck = (await db.get("logs_on-off")) || {};
      const logsChannel = (await db.get("logs_channels")) || {};
      if (!logsCheck[guild.id] || logsCheck[guild.id] == "off") return;
      if (!logsChannel[guild.id]) return;
      const owner = client.users.cache.get(config.owner);
      const logChannel = guild.channels.cache.get(logsChannel[guild.id]);
      const logEmbed = new Discord.MessageEmbed()
        .setTimestamp()
        .setFooter({
          text: `Bot Developer: ${owner.tag}`,
          iconURL: owner.avatarURL({ dynamic: true }),
        })
        .setColor("YELLOW")
        .setTitle(
          `${guild.name} غير رابطه المخصص من ${oldVanityURL} إلى ${newVanityURL} !`
        );
      return logChannel.send({ embeds: [logEmbed] });
    }
  );

  client.on("guildFeaturesUpdate", async (oldGuild, newGuild) => {
    if (!oldGuild) return;
    const logsCheck = (await db.get("logs_on-off")) || {};
    const logsChannel = (await db.get("logs_channels")) || {};
    if (!logsCheck[oldGuild.id] || logsCheck[oldGuild.id] == "off") return;
    if (!logsChannel[oldGuild.id]) return;
    const owner = client.users.cache.get(config.owner);
    const logChannel = oldGuild.channels.cache.get(logsChannel[oldGuild.id]);
    const logEmbed = new Discord.MessageEmbed()
      .setTimestamp()
      .setFooter({
        text: `Bot Developer: ${owner.tag}`,
        iconURL: owner.avatarURL({ dynamic: true }),
      })
      .setColor("DARK_GOLD")
      .setTitle("تغير في خصائص المجتمع")
      .addField("⚙️ الخصائص القديمة", oldGuild.features.join(", "))
      .addField("🚀 الخصائص الجديدة", newGuild.features.join(", "));
    return logChannel.send({ embeds: [logEmbed] });
  });

  client.on("guildOwnerUpdate", async (oldGuild, newGuild) => {
    if (!oldGuild) return;
    const logsCheck = (await db.get("logs_on-off")) || {};
    const logsChannel = (await db.get("logs_channels")) || {};
    if (!logsCheck[oldGuild.id] || logsCheck[oldGuild.id] == "off") return;
    if (!logsChannel[oldGuild.id]) return;
    const owner = client.users.cache.get(config.owner);
    const logChannel = oldGuild.channels.cache.get(logsChannel[oldGuild.id]);
    const logEmbed = new Discord.MessageEmbed()
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
    return logChannel.send({ embeds: [logEmbed] });
  });

  client.on("guildPartnerAdd", async (guild) => {
    if (!guild) return;
    const logsCheck = (await db.get("logs_on-off")) || {};
    const logsChannel = (await db.get("logs_channels")) || {};
    if (!logsCheck[guild.id] || logsCheck[guild.id] == "off") return;
    if (!logsChannel[guild.id]) return;
    const owner = client.users.cache.get(config.owner);
    const logChannel = guild.channels.cache.get(logsChannel[guild.id]);
    const logEmbed = new Discord.MessageEmbed()
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
    return logChannel.send({ embeds: [logEmbed] });
  });

  client.on("guildPartnerRemove", async (guild) => {
    if (!guild) return;
    const logsCheck = (await db.get("logs_on-off")) || {};
    const logsChannel = (await db.get("logs_channels")) || {};
    if (!logsCheck[guild.id] || logsCheck[guild.id] == "off") return;
    if (!logsChannel[guild.id]) return;
    const owner = client.users.cache.get(config.owner);
    const logChannel = guild.channels.cache.get(logsChannel[guild.id]);
    const logEmbed = new Discord.MessageEmbed()
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
    return logChannel.send({ embeds: [logEmbed] });
  });

  client.on("guildVerificationAdd", async (guild) => {
    if (!guild) return;
    const logsCheck = (await db.get("logs_on-off")) || {};
    const logsChannel = (await db.get("logs_channels")) || {};
    if (!logsCheck[guild.id] || logsCheck[guild.id] == "off") return;
    if (!logsChannel[guild.id]) return;
    const owner = client.users.cache.get(config.owner);
    const logChannel = guild.channels.cache.get(logsChannel[guild.id]);
    const logEmbed = new Discord.MessageEmbed()
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
    return logChannel.send({ embeds: [logEmbed] });
  });

  client.on("guildVerificationRemove", async (guild) => {
    if (!guild) return;
    const logsCheck = (await db.get("logs_on-off")) || {};
    const logsChannel = (await db.get("logs_channels")) || {};
    if (!logsCheck[guild.id] || logsCheck[guild.id] == "off") return;
    if (!logsChannel[guild.id]) return;
    const owner = client.users.cache.get(config.owner);
    const logChannel = guild.channels.cache.get(logsChannel[guild.id]);
    const logEmbed = new Discord.MessageEmbed()
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
    return logChannel.send({ embeds: [logEmbed] });
  });

  client.on("messagePinned", async (message) => {
    if (!message.guild) return;
    const logsCheck = (await db.get("logs_on-off")) || {};
    const logsChannel = (await db.get("logs_channels")) || {};
    if (!logsCheck[message.guild.id] || logsCheck[message.guild.id] == "off")
      return;
    if (!logsChannel[message.guild.id]) return;
    const owner = client.users.cache.get(config.owner);
    const logChannel = message.guild.channels.cache.get(
      logsChannel[message.guild.id]
    );
    const logEmbed = new Discord.MessageEmbed()
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
    return logChannel.send({ embeds: [logEmbed] });
  });

  client.on("messageContentEdited", async (message, oldContent, newContent) => {
    if (!message.guild) return;
    const logsCheck = (await db.get("logs_on-off")) || {};
    const logsChannel = (await db.get("logs_channels")) || {};
    if (!logsCheck[message.guild.id] || logsCheck[message.guild.id] == "off")
      return;
    if (!logsChannel[message.guild.id]) return;
    const owner = client.users.cache.get(config.owner);
    const logChannel = message.guild.channels.cache.get(
      logsChannel[message.guild.id]
    );
    const logEmbed = new Discord.MessageEmbed()
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
    return logChannel.send({ embeds: [logEmbed] });
  });
};

module.exports.config = {
  displayName: "LogsEvents",
  dbName: "LOGS EVENTS", // This should NEVER be changed once set, and users cannot see it.
};
