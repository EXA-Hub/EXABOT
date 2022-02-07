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
      .filter(function (item, index, inputArray) {
        return inputArray.indexOf(item) == index;
      });
    let CN = guild.channels.cache.size;
    const ChannelsNumber = auditC
      .map((e) => {
        if (e.action === "CHANNEL_CREATE") {
          ++CN;
          return CN;
        } else {
          CN - 1;
          return CN;
        }
      })
      .filter(function (item, index, inputArray) {
        return inputArray.indexOf(item) == index;
      });
    const labels = auditC
      .map((e) => moment(e.createdTimestamp).locale("ar").format("LL"))
      .filter(function (item, index, inputArray) {
        return inputArray.indexOf(item) == index;
      });
    const obj = new Set(ChannelsNumber);
    const uniqueArrayChannelsNumber = Array.from(obj);
    res.send({
      labels,
      data: uniqueArrayChannelsNumber,
    });
  } else return res.send({ message: "No Thing here" });
});

module.exports = router;
