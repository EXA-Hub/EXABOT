module.exports = {
  name: "user",
  type: "user",
  run: ({
    guild,
    member,
    user,
    target,
    channel,
    client,
    instance,
    interaction,
  }) => {
    interaction.reply({ content: user.username });
  },
};
