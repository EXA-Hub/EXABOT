const { ContextMenuCommandBuilder } = require("@discordjs/builders");
const { Routes } = require("discord-api-types/v9");
const { token } = require("../data/config").bot;
const { REST } = require("@discordjs/rest");
const { client } = require("../index");
const path = require("path");
const fs = require("fs");

/**
 * @param {client} client
 */
module.exports = async (client, instance) => {
  const pathDir = path.join(__dirname, "..", "apps");
  const apps = fs.readdirSync(pathDir);
  const rest = new REST({ version: "9" }).setToken(token);
  const currentApps = (
    await rest.get(Routes.applicationCommands(client.application.id))
  ).filter((app) => app.type === 2 || app.type === 3);
  const commands = apps
    .map((file) => require(path.join(pathDir, file)))
    .filter(
      (x) =>
        (x.type === "message" ||
          x.type === "user" ||
          x.type === 3 ||
          x.type === 2) &&
        !currentApps
          .filter((app) => app.type === 2 || app.type === 3)
          .find((app) => app.name === x.name)
    )
    .map((cmd) =>
      new ContextMenuCommandBuilder()
        .setName(cmd.name)
        .setType(cmd.type === "message" ? 3 : 2)
        .toJSON()
    );
  if (commands.length > 0) {
    currentApps.forEach(async (cmd) => {
      await rest
        .delete(Routes.applicationCommand(cmd.application_id, cmd.id))
        .then(() =>
          console.log("Successfully deleted old application command.")
        )
        .catch(console.error);
    });
    await rest
      .put(Routes.applicationCommands(client.application.id), {
        body: apps
          .map((file) => require(path.join(pathDir, file)))
          .filter(
            (x) =>
              x.type === "message" ||
              x.type === "user" ||
              x.type === 3 ||
              x.type === 2
          )
          .map((cmd) =>
            new ContextMenuCommandBuilder()
              .setName(cmd.name)
              .setType(cmd.type === "message" ? 3 : 2)
              .toJSON()
          ),
      })
      .then(() => console.log("Successfully registered application commands."))
      .catch(console.error);
  }
  const filesAppsNamesFilter = (x) =>
    x.type === "message" || x.type === "user" || x.type === 3 || x.type === 2;
  const filesAppsNames = apps
    .map((file) => require(path.join(pathDir, file)))
    .filter(filesAppsNamesFilter)
    .map((app) => app.name);
  const deletedCommands = currentApps
    .filter((x) => x.type === 3 || x.type === 2)
    .filter((app) => !filesAppsNames.includes(app.name));
  if (deletedCommands.length > 0) {
    deletedCommands.forEach(async (cmd) => {
      await rest
        .delete(Routes.applicationCommand(cmd.application_id, cmd.id))
        .then(() =>
          console.log("Successfully deleted old application command.")
        )
        .catch(console.error);
    });
  }
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isContextMenu()) return;
    const cmds = apps
      .map((file) => require(path.join(pathDir, file)))
      .filter(
        (x) =>
          x.type === "message" ||
          x.type === "user" ||
          x.type === 3 ||
          x.type === 2
      );
    const { commandName } = interaction;
    const isIt = cmds.filter((cmd) => cmd.name === commandName);
    if (isIt.length === 0)
      return interaction.reply({
        content: "**💔 | يبدو أن هذا الأمر قد تم حذفه**",
      });
    isIt.forEach(async (cmd) => {
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
        instance: instance,
        interaction: interaction,
      };
      const response = await cmd.run(data);
      if (response && !interaction.replied) interaction.reply(response);
    });
  });
};

module.exports.config = {
  displayName: "Apps",
  dbName: "APPS", // This should NEVER be changed once set, and users cannot see it.
};
