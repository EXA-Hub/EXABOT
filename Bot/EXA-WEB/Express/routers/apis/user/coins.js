const { Router } = require("express");
const getCoins = require("../../../../../functions/getCoins");

const router = Router();

router.all("/coins", async (req, res) => {
  const userId = req.user.id;
  const userCoins = await getCoins(userId);
  res.send(userCoins.toString());
});

module.exports = router;
