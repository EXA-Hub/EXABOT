require("dotenv").config();
const path = require("path");
const Discord = require("discord.js");
const config = require("./data/config");
const client = new Discord.Client({
  intents: 32767,
  presence: {
    status: "online",
    activities: [
      {
        name: `Mention for help`,
        type: "STREAMING",
        url: config.status.url,
      },
      {
        name: `جرب الـ(/)ـسلاش لرؤية الأوامر`,
        type: "PLAYING",
      },
    ],
  },
});

const { dbName, dbUsername, dbPassword, dbEndPoint } = config.database;
const intoDataBase = `${dbUsername}:${dbPassword}@${dbName}.${dbEndPoint}`;
const mongoUri = `mongodb+srv://${intoDataBase}?retryWrites=true&w=majority`;
const WOKCommands = require("wokcommands");
const DisTube = require("distube");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { SpotifyPlugin } = require("@distube/spotify");
client.emotes = config.emojis;
client.distube = new DisTube.default(client, {
  searchSongs: 1,
  searchCooldown: 30,
  leaveOnEmpty: true,
  emptyCooldown: 3,
  leaveOnFinish: true,
  leaveOnStop: true,
  plugins: [new SoundCloudPlugin(), new SpotifyPlugin()],
});
client.on("ready", () => {
  const dbOptions = {
    keepAlive: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  const wok = new WOKCommands(client, {
    messagesPath: path.join(__dirname, "data/languages/messages.json"),
    commandsDir: path.join(__dirname, "commands"),
    featuresDir: path.join(__dirname, "events"),
    testServers: ["879062548551454740"],
    botOwners: ["635933198035058700"],
    owners: ["635933198035058700"],
    defaultLanguage: "arabic",
    mongoUri: mongoUri,
    typeScript: false,
    ignoreBots: false,
    ephemeral: true,
    showWarns: true,
    debug: false,
    dbOptions,
  })
    .setCategorySettings(
      require(path.join(__dirname, "data/CategorySettings.json"))
    )
    .setDisplayName(client.user.username)
    .setDefaultPrefix(config.prefix);
  wok.on("databaseConnected", async (connection, state) => {
    console.log(`DataBase ${state}`);
    client.mongo = await connection;
    require("./EXA-WEB/server")(client);
    const GiveawayManagerWithOwnDatabase =
      require("./functions/GiveawayManagerWithOwnDatabase")(connection);
    client.giveawaysManager = new GiveawayManagerWithOwnDatabase(client, {
      // storage: path.join(__dirname, 'data/giveaways.json'),
      endedGiveawaysLifetime: 60 * 1000,
      forceUpdateEvery: 1000,
      default: {
        botsCanWin: false,
        exemptPermissions: ["ADMINISTRATOR"],
        embedColor: "#FF0000",
        embedColorEnd: config.bot.color.hex,
        reaction: "🎉",
        lastChance: {
          enabled: true,
          content: "⚠️ **أخر فرصة للفوز** ⚠️",
          threshold: 5000,
          embedColor: "#ffff00",
        },
      },
    });
  });
});

client.login(config.bot.token);

module.exports = {
  client,
};
