(async () => {
  require("dotenv").config();
  const config = require("./data/config");
  const { REST } = require("@discordjs/rest");
  const { Routes } = require("discord-api-types/v9");
  const { token } = config.bot;
  const rest = new REST({ version: "9" }).setToken(token);
  const currentApps = await rest
    .get(Routes.applicationCommands(config.bot.id))
    .filter((app) => app.type !== 2 || app.type !== 3);
  await currentApps.forEach(async (cmd) => {
    await rest
      .delete(Routes.applicationCommand(cmd.application_id, cmd.id))
      .then(() => console.log("Successfully deleted old application command."))
      .catch(console.error)
      .finally(() => console.log("Done."));
  });
  console.log(currentApps);
})();
