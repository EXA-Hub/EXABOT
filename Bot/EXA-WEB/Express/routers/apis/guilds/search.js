const { Router } = require("express");

const usetube = require("usetube");

const router = Router();

router.all("/:guildID/search/:songName", async (req, res) => {
  const { songName } = req.params;
  const { videos } = await usetube.searchVideo(songName);
  res.send(videos.slice(0, 4));
});

module.exports = router;
