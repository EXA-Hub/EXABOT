const Discord = require("discord.js");
/**
 * @param {Discord.Client} client
 */
module.exports = (client, instance) => {
    client.on("warn", (info) => {
        console.warn(`warn: ${info}`);
    });
}

module.exports.config = {
    displayName: 'WarnEvent',
    dbName: 'WARN DB' // This should NEVER be changed once set, and users cannot see it.
}