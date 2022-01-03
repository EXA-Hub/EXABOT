const { Router } = require("express");
const prefixes = require("../../../APIfunctions/prefixes");

const router = Router();

router.all("/:guildID/prefix/:task", async (req, res) => {
  const { guildID, task } = req.params;
  const { prefix } = req.query;
  if (task === "get") {
    return res.send(await prefixes.get(guildID));
  } else if (task === "set") {
    if (!prefix) return res.send({ message: req.url + "?prefix=" });
    return res.send(await prefixes.set(guildID, prefix));
  } else return res.send({ message: "get & set" });
});

module.exports = router;
