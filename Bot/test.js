require("dotenv").config();

// const token = "",
//   id = "";
const { ContextMenuCommandBuilder } = require("@discordjs/builders");
const { token, id } = require("./data/config").bot;
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const rest = new REST({ version: "9" }).setToken(token);

(async () => {
  const cmds = [
    new ContextMenuCommandBuilder().setName("cmdName").setType(2).toJSON(),
  ];
  await rest.put(Routes.applicationCommands(id), {
    body: cmds,
  });
})();
