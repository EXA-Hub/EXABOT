const express = require("express");
const db = require("quick.db");
const http = require("http");
const app = express();

app.set("view engine", "ejs");
function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function getStatus(host) {
  let returns;
  http.get({ host }, function (res) {
    if (res.statusCode == 308) returns = "green";
    else returns = "yellow";
  });
  const notFound = await sleep(1000 * 3);
  if (notFound) returns = "red";
  await returns;
  return returns;
}

app.get("/", async (req, res) => {
  res.render("status", {
    apps: [
      {
        name: "api.exabot.ml",
        status: await getStatus("api.exabot.ml"),
      },
      { name: "bot", status: db.get("status") === "online" ? "green" : "red" },
      {
        name: "canvas.exabot.ml",
        status: await getStatus("canvas.exabot.ml"),
      },
      {
        name: "www.exabot.ml",
        status: await getStatus("www.exabot.ml"),
      },
    ],
  });
});

app.listen(3000, () => {
  console.log("server started");
});

const { Client } = require("discord.js");
const client = new Client();

const channelID = "952640766843420742";
const botID = "865052410841792532";
const reportID = "952642098249760848";
const msgID = "952648181433384982";

client.on("ready", () => {
  console.log("ready");
  setInterval(async () => {
    var bot = client.users.cache.get(`${botID}`);
    var channel = client.channels.cache.get(`${channelID}`);
    if (bot.presence.status == "offline") {
      db.set("status", "offline");
      channel.messages.fetch(msgID).then((message) => {
        message.edit({
          embed: {
            description: `**<@!${botID}> توقف عن العمل قليلا**`,
            color: "#FF0000",
          },
        });
      });
    } else {
      db.set("status", "online");
      channel.messages.fetch(msgID).then((message) => {
        message.edit({
          embed: {
            description: `**<@!${botID}> شغال 24/7**`,
            color: "#00FF00",
          },
        });
      });
    }
  }, 1000 * 10);
});

client.on("message", (msg) => {
  if (msg.author.bot) return;
  if (msg.channel.id == reportID) {
    return msg.channel.send(
      "**شكرا لإبلاغك عن المشاكل سوف يتم التححق منها وإصلاحها 🟢**"
    );
  }
});

client.login(process.env.TOKEN);
