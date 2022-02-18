async function setCoins(userId, num) {
  const db = require("./database");
  const coins = (await db.get("coins")) || {};
  coins[userId] = num;
  db.set("coins", coins);
}

module.exports = setCoins;
