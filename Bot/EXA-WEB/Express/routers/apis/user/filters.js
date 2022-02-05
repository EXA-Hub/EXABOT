const { client } = require("../../../../../index");
const { Router } = require("express");
const router = Router();

router.all("/filters", async (req, res) => {
  res.send(client.distube.filters);
});

module.exports = router;
