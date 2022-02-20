const {
  Guild,
  GuildMember,
  User,
  Channel,
  Client,
  Interaction,
} = require("discord.js");
const takeCoins = require("../functions/takeCoins");
const getCoins = require("../functions/getCoins");
const db = require("../functions/database");
const WOKcommands = require("wokcommands");
module.exports = {
  name: "thx to",
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
    if (!thxMember)
      return interaction.reply({ content: "**❌ | يرجى تحديد العضو**" });
    let thxData = (await db.get("thx")) || {};
    if ((await getCoins(user.id)) < 50)
      return interaction.reply({
        content: "**❌ | لا تمتلك عدد كافي من العملات**",
      });
    await takeCoins(user.id, 50);
    if (thxData[thxMember.id]) {
      thxData[thxMember.id] = thxData[thxMember.id] + 1;
      db.set("thx", thxData);
      return interaction.reply({
        content: `**✅ | تم شكر <@!${thxMember.id}> بنجاح**\n||خصم من رصيدك مقدار \`50\` عملة||`,
      });
    } else {
      thxData[thxMember.id] = 1;
      db.set("thx", thxData);
      return interaction.reply({
        content: `**✅ | تم شكر <@!${thxMember.id}> بنجاح**\n||خصم من رصيدك مقدار \`50\` عملة||`,
      });
    }
  },
};
