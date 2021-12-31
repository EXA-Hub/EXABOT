require("dotenv").config();

// const token = "",
//   id = "";
const { token, id } = require("./data/config").bot;
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const rest = new REST({ version: "9" }).setToken(token);

(async () => {
  const cmds = await rest.get(Routes.applicationCommands(id));
  console.log(cmds);
  cmds.forEach(async (cmd) => {
    try {
      console.log("Started refreshing application (/) commands.");

      await rest.delete(Routes.applicationCommand(id, cmd.id));

      console.log("Successfully deleted application (/) commands.");
    } catch (error) {
      console.error(error);
    }
  });
})();
