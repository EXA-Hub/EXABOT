const {
  Guild,
  GuildMember,
  User,
  Channel,
  Client,
  Interaction,
} = require("discord.js");
const WOKcommands = require("wokcommands");

module.exports = {
  name: "",
  type: { message: 3, user: 2 },
  /**
   *
   * @param {{guild: Guild,member: GuildMember,user: User,target: { type: String, id: String },channel: Channel,client: Client,instance: WOKcommands,interaction: Interaction}} data
   */
  run: ({
    guild,
    member,
    user,
    target,
    channel,
    client,
    instance,
    interaction,
  } = data) => {},
};
