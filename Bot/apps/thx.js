const {
  Guild,
  GuildMember,
  User,
  Channel,
  Client,
  Interaction,
} = require("discord.js");
const db = require("../functions/database");
const WOKcommands = require("wokcommands");
module.exports = {
  name: "thx",
  type: 2,
  /**
   *
   * @param {{guild: Guild,member: GuildMember,user: User,target: { type: String, id: String },channel: Channel,client: Client,instance: WOKcommands,interaction: Interaction}} data
   */
  run: async ({
    guild,
    member,
    user,
    target,
    channel,
    client,
    instance,
    interaction,
  } = data) => {
    const thxMember = guild.members.cache.get(target.id);
    if (!thxMember) return "**❌ | يرجى تحديد العضو**";
    let thxData = (await db.get("thx")) || {};
    if (thxData[thxMember.id]) {
      thxData[thxMember.id] = Math.floor(thxData[thxMember.id] + 1);
      db.set("thx", thxData);
      return `✅ | تم شكر <@!${thxMember.id}> بنجاح`;
    } else {
      thxData[thxMember.id] = 1;
      db.set("thx", thxData);
      return `✅ | تم شكر <@!${thxMember.id}> بنجاح`;
    }
  },
};
