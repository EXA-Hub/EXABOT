const { ContextMenuCommandBuilder } = require("@discordjs/builders");
const { Routes } = require("discord-api-types/v9");
const { token } = require("../data/config").bot;
const { REST } = require("@discordjs/rest");
const { Client } = require("discord.js");
const path = require("path");
const fs = require("fs");

/**
 * @param {Client} client
 */

module.exports = async (client, instance) => {
  const pathDir = path.join(__dirname, "..", "apps");
  const apps = fs.readdirSync(pathDir);
  const cmds = apps.map((file) => ({
    fileName: file,
    cmd: require(path.join(pathDir, file)),
  }));

  const commands = cmds.map((cmd) =>
    new ContextMenuCommandBuilder()
      .setName(cmd.cmd.name)
      .setType(cmd.cmd.type === "message" ? 3 : 2)
      .toJSON()
  );

  const rest = new REST({ version: "9" }).setToken(token);

  await rest
    .put(Routes.applicationCommands(client.application.id), {
      body: commands,
    })
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isContextMenu()) return;
    const { commandName } = interaction;
    const isIt = cmds.filter((cmd) => cmd.cmd.name === commandName);
    if (isIt.length === 0)
      return interaction.reply({
        content: "**💔 | يبدو أن هذا الأمر قد تم حذفه**",
      });
    isIt.forEach((cmd) => {
      const data = {
        guild: interaction.member.guild,
        member: interaction.member,
        user: interaction.user,
        target: {
          type: interaction.targetType,
          id: interaction.targetId,
        },
        channel: interaction.member.guild.channels.cache.get(
          interaction.channelId
        ),
        client: client,
        prefix: instance.getPrefix(interaction.member.guild.id),
        instance: instance,
        interaction: interaction,
      };
      cmd.cmd.run(data);
    });
  });
};

module.exports.config = {
  displayName: "Apps",
  dbName: "APPS", // This should NEVER be changed once set, and users cannot see it.
};