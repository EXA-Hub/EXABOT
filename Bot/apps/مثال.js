const {
  Guild,
  GuildMember,
  User,
  Channel,
  Interaction,
} = require("discord.js");
const WOKcommands = require("wokcommands");
const { client } = require("../index");
module.exports = {
  name: "",
  type: { message: 3, user: 2 },
  /**
   *
   * @param {{guild: Guild,member: GuildMember,user: User,target: { type: String, id: String },channel: Channel,client: client,instance: WOKcommands,interaction: Interaction}} data
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
