// require("dotenv").config();

// const token = "",
//   id = "";
// // const { token, id } = require("./data/config").bot;

// const fs = require("fs");
// const { Routes } = require("discord-api-types/v9");
// const { REST } = require("@discordjs/rest");
// const rest = new REST({ version: "9" }).setToken(token);

// // (async () => {
// //   const cmds = await rest.get(Routes.applicationCommands(id));
// //   console.log(JSON.stringify(cmds, 2, 2));
// //     fs.writeFile("./data/json.json", JSON.stringify(cmds), (e) => {
// //       console.log(e);
// //     });
// // })();

// // cmds.forEach((cmd) => {
// //   (async () => {
// //     try {
// //       console.log("Started refreshing application (/) commands.");

// //       await rest.delete(Routes.applicationCommand(id, cmd.id));

// //       console.log("Successfully deleted application (/) commands.");
// //     } catch (error) {
// //       console.error(error);
// //     }
// //   })();
// // });

// (async () => {
//   console.log("Started refreshing application (/) commands.");

//   await rest.put(Routes.applicationCommands(id), {
//     body: require("./data/json.json"),
//   });

//   console.log("Successfully deleted application (/) commands.");
// })();
