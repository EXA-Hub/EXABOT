/**
 *
 * @param {String} userId
 * @param {Number} num
 */
async function giveCoins(userId, num) {
  const db = require("./database");
  let coins = (await db.get("coins")) || {};
  if (!coins) {
    const setCoins = { userId: 50 + num };
    db.set("coins", setCoins);
  } else {
    let userCoins = coins[userId];
    if (!userCoins && userCoins !== 0) {
      coins[userId] = 50 + num;
      db.set("coins", coins);
    } else {
      coins[userId] = userCoins + (num - (num * 5) / 100);
      db.set("coins", coins);
    }
  }
}

module.exports = giveCoins;
