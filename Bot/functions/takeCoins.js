async function takeCoins(userId, num) {
  const db = require("./database");
  let coins = (await db.get("coins")) || {};
  let userCoins = coins[userId];
  if (!userCoins && !userCoins === 0) {
    coins[userId] = 50;
    db.set("coins", coins);
  }
  userCoins = coins[userId];
  coins[userId] = userCoins - num;
  db.set("coins", coins);
}

module.exports = takeCoins;
