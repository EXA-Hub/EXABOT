const { client } = require("../index");
const db = require("../functions/database");
const { ReactionRoleManager } = require("../functions/reactionRole");
/**
 * @param {client} client
 */
module.exports = async (client, instance) => {
  let data = (await db.get("reactionRoleData")) || [];
  if (data === {}) data = [];
  client.emit("reactionRoleUpdate", data);
  client.on("reactionRoleUpdate", async (configs) => {
    if (!configs || !Array.isArray(configs)) return;
    client.data.reactionRole = configs;
    configs.forEach(async (config) => {
      const channel = client.channels.cache.get(config.channelId);
      if (!channel.isText()) return;
      const message = await channel.messages.fetch(config.messageId);
      const emojis = Object.keys(config.emojiRoleMap);
      emojis.forEach((emoji) => {
        message.react(emoji);
      });
      const reactionCollector = message.createReactionCollector();
      reactionCollector.on("collect", (messageReaction, user) => {
        const configMap = new Map();
        configs.forEach((config) => {
          configMap.set(config.messageId, config);
        });
        function getConfig(message) {
          if (!configMap.has(message.id)) return;
          return configMap.get(message.id);
        }
        const config = getConfig(messageReaction.message);
        if (!config) return;
        const manager = new ReactionRoleManager(messageReaction, user, config);
        manager.setRoles();
      });
    });
    await db.set("reactionRoleData", client.data.reactionRole || []);
  });
};

module.exports.config = {
  displayName: "messageReaction",
  dbName: "MESSAGE_REACTION",
};
