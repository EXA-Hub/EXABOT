require("dotenv").config();
const path = require("path");
const DisTube = require("distube");
const Discord = require("discord.js");
const config = require("./data/config");
const { connection } = require("mongoose");
const WOKCommands = require("wokcommands");
const discordBackup = require("discord-backup");
const DiscordOauth2 = require("discord-oauth2");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const GiveawayManagerWithOwnDatabase =
  require("./functions/GiveawayManagerWithOwnDatabase")(connection);

const { url, redirect_url } = config.dashboard.url;
const { dbName, dbUsername, dbPassword, dbEndPoint } = config.database;
const intoDataBase = `${dbUsername}:${dbPassword}@${dbName}.${dbEndPoint}`;
const mongoUri = `mongodb+srv://${intoDataBase}?retryWrites=true&w=majority`;
const oauth2Data = {
  clientId: config.bot.client.id,
  clientSecret: config.bot.client.secret,
  redirectUri: `${url + redirect_url}`,
};

class Client extends Discord.Client {
  constructor(options) {
    super(options);
    discordBackup.setStorageFolder(path.join(process.cwd(), "data/backups/"));
    this._backup = discordBackup;
    this._emotes = config.emojis;
    this._config = config;
    this._distube = new DisTube.default(this, {
      plugins: [new SoundCloudPlugin(), new SpotifyPlugin()],
      emitNewSongOnly: true,
      leaveOnEmpty: true,
      leaveOnFinish: true,
      leaveOnStop: true,
      savePreviousSongs: true,
      searchSongs: 10,
      searchCooldown: 60,
      emptyCooldown: 3,
      nsfw: false,
      emitAddListWhenCreatingQueue: true,
      emitAddSongWhenCreatingQueue: true,
      youtubeDL: false,
    });
    this._oauth2 = new DiscordOauth2(oauth2Data);
    this._mongo = connection;
    this._giveawaysManager = new GiveawayManagerWithOwnDatabase(this, {
      storage: path.join(__dirname, "data/giveaways.json"),
      endedGiveawaysLifetime: 24 * 60 * 60 * 1000,
      forceUpdateEvery: 60 * 1000,
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
  }
  get backup() {
    return this._backup;
  }
  set backup(backup) {
    this._backup = backup;
  }
  get emotes() {
    return this._emotes;
  }
  set emotes(emotes) {
    this._emotes = emotes;
  }
  get config() {
    return this._config;
  }
  set config(config) {
    this._config = config;
  }
  get distube() {
    return this._distube;
  }
  set distube(distube) {
    this._distube = distube;
  }
  get oauth2() {
    return this._oauth2;
  }
  set oauth2(oauth2) {
    this._oauth2 = oauth2;
  }
  get mongo() {
    return this._mongo;
  }
  set mongo(mongo) {
    this._mongo = mongo;
  }
  get giveawaysManager() {
    return this._giveawaysManager;
  }
  set giveawaysManager(giveawaysManager) {
    this._giveawaysManager = giveawaysManager;
  }
}

const client = new Client({
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

// https://www.npmjs.com/package/discord-logs
require("discord-logs")(client);

client.on("ready", () => {
  const dbOptions = {
    keepAlive: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  new WOKCommands(client, {
    disabledDefaultCommands: [
      // "requiredrole",
      // "language",
      // "command",
      // "prefix",
      // "help",
    ],
    messagesPath: path.join(__dirname, "data/languages/messages.json"),
    commandsDir: path.join(__dirname, "commands"),
    featuresDir: path.join(__dirname, "events"),
    testServers: ["879062548551454740"],
    botOwners: ["635933198035058700"],
    owners: ["635933198035058700"],
    defaultLanguage: "arabic",
    delErrMsgCooldown: 5,
    mongoUri: mongoUri,
    typeScript: false,
    ignoreBots: true,
    ephemeral: true,
    showWarns: true,
    // debug: true,
    dbOptions,
  })
    .setCategorySettings(
      require(path.join(__dirname, "data/CategorySettings.json"))
    )
    .setDisplayName(client.user.username)
    .setColor(config.bot.color.hex)
    .setDefaultPrefix(config.prefix);
});

client.login(config.bot.token);
module.exports = { client };
