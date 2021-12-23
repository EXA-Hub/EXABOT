const { Client } = require('discord.js');
const config = require('../data/config');
const errorsID = config.support.server.report.errors.channel.id;

/**
 * @param {Client} client
 */

module.exports = (client, instance) => {
    console.log('[antiCrash] :: Working Fine');
    const channel = client.channels.cache.get(errorsID);
    process.on("unhandledRejection", async(reason, p) => {
        console.log(' [antiCrash] :: Unhandled Rejection/Catch');
        console.log(reason, p);
        channel.send({
            content: `[antiCrash] :: Unhandled Rejection/Catch \n\`\`\`${reason, p.finally.toString()}\`\`\``,
        });
    }).on("uncaughtException", async(err, origin) => {
        console.log(' [antiCrash] :: Uncaught Exception/Catch');
        console.log(err, origin);
        channel.send({
            content: `[antiCrash] :: Uncaught Exception/Catch \n\`\`\`${err, origin.toString()}\`\`\``,
        });
    }).on("uncaughtExceptionMonitor", async(err, origin) => {
        console.log(' [antiCrash] :: Uncaught Exception/Catch (MONITOR)');
        console.log(err, origin);
        channel.send({
            content: `[antiCrash] :: Uncaught Exception/Catch (MONITOR) \n\`\`\`${err, origin.toString()}\`\`\``,
        });
    }).on("multipleResolves", async(type, promise, reason) => {
        console.log(' [antiCrash] :: Multiple Resolves');
        console.log(type, promise, reason);
        channel.send({
            content: `[antiCrash] :: Multiple Resolves \n\`\`\`${type.toString(), promise.finally.toString(), reason}\`\`\``,
        });
    }).on("warning", async(warning) => {
        console.log(' [antiCrash] :: Warning');
        console.log(warning);
        channel.send({
            content: `[antiCrash] :: Warning \n\`\`\`${warning}\`\`\``,
        });
    });
}

module.exports.config = {
    displayName: 'AntiCrash',
    dbName: 'ANTI CRASH' // This should NEVER be changed once set, and users cannot see it.
}