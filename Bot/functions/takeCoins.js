/**
 *
 * @param {String} userId
 * @param {Number} num
 */
async function takeCoins(userId, num) {
  const db = require("./database");
  let coins = (await db.get("coins")) || {};
  const userCoins = coins[userId];
  if (!userCoins && !userCoins === 0) {
    coins[userId] = 50;
    db.set("coins", coins);
  }
  coins[userId] = userCoins - num;
  db.set("coins", coins);
}

module.exports = takeCoins;
