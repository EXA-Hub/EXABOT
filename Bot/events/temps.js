const {
  TempChannelsManagerEvents,
} = require("@hunteroi/discord-temp-channels");
const db = require("../functions/database");
const config = require("../data/config");
const { client } = require("../index");
/**
 * @param {client} client
 */
module.exports = async (client, instance) => {
  let tempChannelData = {
    childCategory: "",
    // إختياري
    childMaxUsers: 3,
    // textChannelAsThreadParent: "",
    // ثوابت
    threadArchiveDuration: "MAX",
    childAutoDeleteIfEmpty: true,
    childAutoDeleteIfOwnerLeaves: false,
    childTextFormat: (str, count) => `#${count} - ${str}`,
    childTextFormatRegex: /^#\d+ \-/,
    childVoiceFormat: (str, count) => `#${count} - ${str}`,
    childVoiceFormatRegex: /^#\d+ \-/,
    childBitrate: 64 * 1000,
    childCanBeRenamed: true,
    childOverwriteRolesAndUsers: config.devs.map((dav) =>
      client.users.cache.get(dav)
    ),
    childPermissionOverwriteOptions: {
      VIEW_CHANNEL: true,
      SEND_MESSAGES: true,
      EMBED_LINKS: false,
      ATTACH_FILES: true,
      READ_MESSAGE_HISTORY: true,
      MENTION_EVERYONE: false,
      MANAGE_MESSAGES: false,
      SEND_TTS_MESSAGES: true,
      ADD_REACTIONS: true,
      SEND_MESSAGES_IN_THREADS: true,
      MANAGE_THREADS: false,
      USE_EXTERNAL_EMOJIS: true,
      USE_PRIVATE_THREADS: true,
      USE_PUBLIC_THREADS: true,
      USE_EXTERNAL_STICKERS: true,
      CREATE_PRIVATE_THREADS: true,
      CREATE_PUBLIC_THREADS: true,
      USE_APPLICATION_COMMANDS: true,
      MANAGE_CHANNELS: true,
      MANAGE_WEBHOOKS: false,
    },
  };
  let { data } = await db.get("temp-channels");
  if (!data || !Array.isArray(data)) {
    db.set("temp-channels", { data: [] });
    data = [];
  }
  data.forEach(
    ({
      channelID,
      childCategory,
      childMaxUsers,
      textChannelAsThreadParent,
    }) => {
      tempChannelData.childCategory = childCategory;
      if (childMaxUsers) tempChannelData.childMaxUsers = childMaxUsers;
      if (textChannelAsThreadParent)
        tempChannelData.textChannelAsThreadParent = textChannelAsThreadParent;
      client.temps.registerChannel(channelID, tempChannelData);
    }
  );
  client.temps
    .on(TempChannelsManagerEvents.error, (err, message) => {
      console.log(err);
      console.log(message);
    })
    .on(
      TempChannelsManagerEvents.childCreate,
      async (member, child, parent) => {
        setTimeout(() => {
          client.temps.emit("createText", { guild: member.guild, member });
        }, 1000);
      }
    );
};
module.exports.config = {
  displayName: "Temps",
  dbName: "TEMPS", // This should NEVER be changed once set, and users cannot see it.
};
