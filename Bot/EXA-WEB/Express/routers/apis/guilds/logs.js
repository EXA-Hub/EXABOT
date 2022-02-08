const moment = require("moment");
const { Router } = require("express");
const { client } = require("../../../../../index");

const router = Router();

router.all("/:guildID/logs/:type?", async (req, res) => {
  const { guildID, type } = req.params;
  const guild = client.guilds.cache.get(guildID);
  if (type === "labels") {
    const auditCC = await guild.fetchAuditLogs({
      type: "CHANNEL_CREATE",
    });
    const auditCD = await guild.fetchAuditLogs({
      type: "CHANNEL_DELETE",
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
    let CN = guild.channels.cache.size;
    auditC.forEach((e) => {
      if (e.action === "CHANNEL_CREATE") CN = CN - 1;
      else CN = CN + 1;
    });
    let ChannelsNumber = [];
    auditC.forEach((e) => {
      if (e.action === "CHANNEL_CREATE") CN = CN + 1;
      else CN = CN - 1;
      ChannelsNumber.push(CN);
    });
    res.send({
      labels,
      data: ChannelsNumber,
    });
  } else return res.send({ message: "No Thing here" });
});

module.exports = router;
