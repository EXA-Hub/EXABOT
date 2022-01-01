const { Router } = require("express");
const getCoins = require("../../../../../functions/getCoins");

const router = Router();

router.all("/coins", async (req, res) => {
  res.send((await getCoins(req.user.userId)).toString());
});

module.exports = router;
