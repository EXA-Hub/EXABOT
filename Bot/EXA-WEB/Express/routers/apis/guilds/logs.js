const moment = require("moment");
const { Router } = require("express");
const { client } = require("../../../../../index");

const router = Router();

router.all("/:guildID/logs/:type?", async (req, res) => {
  const { guildID, type } = req.params;
  const guild = client.guilds.cache.get(guildID);
  const routsTypes = [
    "CHANNEL",
    "CHANNEL_OVERWRITE",
    "ROLE",
    "INVITE",
    "WEBHOOK",
    "EMOJI",
    "INTEGRATION",
    "STAGE_INSTANCE",
    "STICKER",
    "GUILD_SCHEDULED_EVENT",
    "THREAD",
  ];
  const routsNames = [
    "غرف",
    "تغير في صلاحيات الغرف الخاصة",
    "رتب",
    "دعوات",
    "خطافات في الشبكة",
    "تعبيرات",
    "تطبيقات",
    "أحداث",
    "ملصقات",
    "أحداث مجدولة",
    "مواضيع",
  ];
  const typeIndex = routsTypes.indexOf(type);
  if (typeIndex < 0)
    return res.send(
      require("../../../APIfunctions/combineArrays")(routsTypes, routsNames)
    );
  const auditCC = await guild.fetchAuditLogs({
    type: `${routsTypes[typeIndex]}_CREATE`,
  });
  const auditCD = await guild.fetchAuditLogs({
    type: `${routsTypes[typeIndex]}_DELETE`,
  });
  const auditC = auditCD.entries
    .toJSON()
    .concat(auditCC.entries.toJSON())
    .sort(function (x, y) {
      return x.createdTimestamp - y.createdTimestamp;
    })
    .map((e) => {
      e.date = moment(e.createdTimestamp)
        .locale("ar")
        .format("MMMM Do YYYY, h:mm:ss a");
      return e;
    });
  const labels = auditC.map((e) => e.date);
  let CN = 0;
  switch (type) {
    case "CHANNEL":
      CN = CN + guild.channels.cache.size;
      break;
    case "CHANNEL_OVERWRITE":
      guild.channels.cache.forEach((channel) => {
        if (channel.permissionOverwrites)
          CN = CN + channel.permissionOverwrites.cache.size;
      });
      break;
    case "ROLE":
      CN = CN + guild.roles.cache.size;
      break;
    case "INVITE":
      CN = CN + (await guild.invites.fetch()).size;
      break;
    case "WEBHOOK":
      CN = CN + (await guild.fetchWebhooks()).size;
      break;
    case "EMOJI":
      CN = CN + guild.emojis.cache.size;
      break;
    case "INTEGRATION":
      CN = CN + (await guild.fetchIntegrations()).size;
      break;
    case "STAGE_INSTANCE":
      CN = CN + guild.stageInstances.cache.size;
      break;
    case "STICKER":
      CN = CN + guild.stickers.cache.size;
      break;
    case "GUILD_SCHEDULED_EVENT":
      CN = CN + guild.scheduledEvents.cache.size;
      break;
    case "THREAD":
      CN =
        CN +
        guild.channels.cache.size -
        guild.channels.channelCountWithoutThreads;
      break;
  }
  auditC.forEach((e) => {
    if (e.action === `${routsTypes[typeIndex]}_CREATE`) CN = CN - 1;
    else CN = CN + 1;
  });
  let ChannelsNumber = [];
  auditC.forEach((e) => {
    if (e.action === `${routsTypes[typeIndex]}_CREATE`) CN = CN + 1;
    else CN = CN - 1;
    ChannelsNumber.push(CN);
  });
  res.send({
    labels,
    data: ChannelsNumber,
  });
});

module.exports = router;
