/**
 *
 * @param {String} userId
 * @returns
 */
async function getCoins(userId) {
  const db = require("./database");
  let coins = (await db.get("coins")) || {};
  let userCoins = coins[userId];
  if (!userCoins && userCoins !== 0) {
    coins[userId] = 50;
    db.set("coins", coins);
  }
  return coins[userId];
}

module.exports = getCoins;
