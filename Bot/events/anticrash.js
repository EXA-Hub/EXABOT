const { Client } = require("discord.js");
const config = require("../data/config");
const errorsID = config.support.server.report.errors.channel.id;

/**
 * @param {Client} client
 */

module.exports = (client, instance) => {
  require("../EXA-WEB/server")(client, instance);
  console.log("[antiCrash] :: Working Fine");
  const channel = client.channels.cache.get(errorsID);
  process
    .on("unhandledRejection", async (reason) => {
      console.log(" [antiCrash] :: Unhandled Rejection/Catch");
      console.log(reason);
      channel.send({
        content: `[antiCrash] :: Unhandled Rejection/Catch \n\`\`\`${reason}\`\`\``,
      });
    })
    .on("uncaughtException", async (err, origin) => {
      console.log(" [antiCrash] :: Uncaught Exception/Catch");
      console.log(err, origin);
      channel.send({
        content: `[antiCrash] :: Uncaught Exception/Catch \n\`\`\`${err.name}: ${err.message}\`\`\``,
      });
    })
    .on("uncaughtExceptionMonitor", async (err, origin) => {
      console.log(" [antiCrash] :: Uncaught Exception/Catch (MONITOR)");
      console.log(err, origin);
      channel.send({
        content: `[antiCrash] :: Uncaught Exception/Catch (MONITOR) \n\`\`\`${err.name}: ${err.message}\`\`\``,
      });
    })
    .on("multipleResolves", async (type, promise, reason) => {
      console.log(" [antiCrash] :: Multiple Resolves");
      console.log(type, promise, reason);
      channel.send({
        content: `[antiCrash] :: Multiple Resolves \n\`\`\`${reason}\`\`\``,
      });
    })
    .on("warning", async (warning) => {
      console.log(" [antiCrash] :: Warning");
      console.log(warning);
      channel.send({
        content: `[antiCrash] :: Warning \n\`\`\`${warning.name}: ${warning.message}\`\`\``,
      });
    });
};

module.exports.config = {
  displayName: "AntiCrash",
  dbName: "ANTI CRASH", // This should NEVER be changed once set, and users cannot see it.
};
