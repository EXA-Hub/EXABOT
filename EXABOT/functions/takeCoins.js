async function takeCoins(userId, num) {
    const db = require('./database');
    let coins = await db.get("coins") || {};
    let userCoins = coins[userId];
    if (!userCoins && !userCoins === 0) {
        coins[userId] = 50;
        db.set("coins", coins);
    }
    const take = num * -1;
    userCoins = coins[userId];
    coins[userId] = userCoins + take;
    db.set("coins", coins);
};

module.exports = takeCoins;