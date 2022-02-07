const { Router } = require("express");
const { client } = require("../../../../../index");
const prefixes = require("../../../APIfunctions/prefixes");

const router = Router();

router.all("/:guildID/prefix/:task", async (req, res) => {
  const { guildID, task } = req.params;
  const { prefix } = req.query;
  if (task === "get") {
    const guildPrefix = await prefixes.get(guildID);
    return res.send({ prefix: guildPrefix });
  } else if (task === "set") {
    if (!prefix) return res.send({ message: req.url + "?prefix=" });
    req.wok.instance.setPrefix(client.guilds.cache.get(guildID), prefix);
    const newPrefix = await prefixes.set(guildID, prefix);
    return res.send(newPrefix);
  } else return res.send({ message: "get & set" });
});

module.exports = router;
