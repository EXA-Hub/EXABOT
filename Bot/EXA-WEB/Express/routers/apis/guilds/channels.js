const { Router } = require("express");
const { client } = require("../../../../../index");

const router = Router();

router.all("/:guildID/channels", async (req, res) => {
  const guildChannels = (await client.guilds.fetch(req.params.guildID)).channels
    .cache;
  res.send({ guildChannels });
});

module.exports = router;
