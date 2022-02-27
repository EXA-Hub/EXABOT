const { Router } = require("express");
const { client } = require("../../../../../index");

const router = Router();

router.all("/:guildID/memberCount", async (req, res) => {
  const { guildID } = req.params;
  const guild = client.guilds.cache.get(guildID);
  return res.send(`${guild.memberCount}`);
});

module.exports = router;
