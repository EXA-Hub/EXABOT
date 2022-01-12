const Discord = require("discord.js");
/**
 * @param {Discord.Client} client
 */
module.exports = (client, instance) => {
  client.on("guildMemberAdd", async (member) => {
    const mute = require("../functions/mute");
    const db = require("../functions/database");
    const welcome = require("../functions/welcome");
    const getCoins = require("../functions/getCoins");
    const takeCoins = require("../functions/takeCoins");
    const giveCoins = require("../functions/giveCoins");
    const saveMutedDataFile = (await db.get("muted")) || {};
    const welcomeGiftData = (await db.get("welcomeGiftData")) || {};
    const avatar =
      member.user.avatarURL({ dynamic: true, size: 128, format: "png" }) ||
      client.user.avatarURL({ dynamic: true, size: 128, format: "png" });
    welcome(
      client,
      member.guild.id,
      member.user.discriminator,
      member.user.username,
      avatar
    );
    if (
      saveMutedDataFile &&
      !(
        !Array.isArray(saveMutedDataFile[member.guild.id]) ||
        saveMutedDataFile[member.guild.id].length === 0
      ) &&
      saveMutedDataFile[member.guild.id].includes(member.id)
    ) {
      mute(null, member, member.guild);
    } else if (welcomeGiftData && welcomeGiftData[member.guild.id]) {
      if (
        !welcomeGiftData[member.guild.id].on ||
        !Number.isNaN(welcomeGiftData[member.guild.id].gift) ||
        (welcomeGiftData[member.guild.id].done &&
          welcomeGiftData[member.guild.id].done.includes(member.id))
      )
        return;
      const welcomeCoins = parseInt(welcomeGiftData[member.guild.id].gift);
      const ownerCoins = await getCoins(member.guild.ownerId);
      if (ownerCoins < welcomeCoins) return;
      welcomeGiftData[member.guild.id].done.push(member.id);
      await db.set("welcomeGiftData", welcomeGiftData);
      takeCoins(member.guild.ownerId, welcomeCoins);
      giveCoins(member.id, welcomeCoins);
      const welcomeChannelsID = await db.get("welcome_channels");
      const welcomeChannelID = welcomeChannelsID[member.guild.id];
      const welcomeChannel = member.guild.channels.cache.get(welcomeChannelID);
      if (welcomeChannel) {
        welcomeChannel.send({
          content: `> **<@!${member.id}> مبروك لقد ربحت \`${welcomeCoins}\` عملة :coin:**`,
        });
      } else {
        try {
          member.user.send({
            content: `> **<@!${member.id}> مبروك لقد ربحت \`${welcomeCoins}\` عملة :coin:**`,
          });
        } catch (err) {
          console.error(err);
          (await member.guild.fetchOwner()).user.send({
            content: `**❤ | يرجى تحديد قناة الترحيب في السيرفر \`${member.guild.name}\`**`,
          });
        }
      }
    }
  });
};

module.exports.config = {
  displayName: "GuildMemberAddEvent",
  dbName: "GUILD MEMBER ADD EVENT", // This should NEVER be changed once set, and users cannot see it.
};
