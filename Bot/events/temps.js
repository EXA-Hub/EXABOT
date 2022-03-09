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
      SEND_MESSAGES: true,
      EMBED_LINKS: null,
      ATTACH_FILES: false,
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
