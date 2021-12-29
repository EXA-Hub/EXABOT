module.exports = {
  name: "guild",
  type: "message",
  run: ({
    guild,
    member,
    user,
    target,
    channel,
    client,
    prefix,
    instance,
    interaction,
  }) => {
    interaction.reply({ content: guild.name });
  },
};
