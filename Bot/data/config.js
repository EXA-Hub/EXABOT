module.exports = {
  prefix: ".",
  devs: ["635933198035058700"],
  owner: "635933198035058700",
  youtube: {
    music: {
      banner:
        "https://cdn.discordapp.com/attachments/865036175705112596/929499104709574676/xa.png",
    },
    API_KEY: "" || process.env.API_KEY,
  },
  status: {
    url: "https://www.twitch.tv/exa4real",
    // UC9-qS_Jj-rG1I_Nfza6fT4w
  },
  dashboard: {
    port: 2323 || process.env.port,
    secret: "" || process.env.DASHBOARD_SECRET,
    DISCORD_OAUTH_CLIENT_ID: "" || process.env.DISCORD_OAUTH_CLIENT_ID,
    DISCORD_OAUTH_SECRET: "" || process.env.DISCORD_OAUTH_SECRET,
    react: "" || process.env.REACT_URL,
    url: {
      redirect_url: "/api/auth/discord/redirect" || process.env.redirect_url,
      url: "" || process.env.web_url,
    },
  },
  bot: {
    token: "" || process.env.token,
    id: `${process.env.DISCORD_OAUTH_CLIENT_ID}`,
    invite: `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_OAUTH_CLIENT_ID}&permissions=8&scope=bot`,
    client: {
      secret: "" || process.env.CLIENT_SECRET,
      id: `${process.env.DISCORD_OAUTH_CLIENT_ID}`,
    },
    color: {
      hex: "#092D82",
      rgb: {
        red: 9,
        green: 45,
        blue: 130,
        all: (9, 45, 130),
      },
    },
  },
  support: {
    server: {
      id: "864025710507065345",
      invite: {
        code: "n9AQZ6qjNc",
        link: "https://discord.gg/n9AQZ6qjNc",
      },
      suggestion: {
        channel: {
          id: "865036180688732191",
        },
      },
      report: {
        channel: {
          id: "880177793051267083",
        },
        errors: {
          channel: {
            id: "919271265666224128",
          },
        },
      },
    },
  },
  database: {
    dbUsername: "" || process.env.DB_USERNAME,
    dbPassword: "" || process.env.DB_PASSWORD,
    dbName: "" || process.env.DB_NAME,
    dbEndPoint: "" || process.env.DB_ENDPOINT,
  },
  emojis: {
    play: "▶️",
    stop: "⏹️",
    queue: "📄",
    success: "☑️",
    repeat: "🔁",
    error: "❌",
    loading: "<a:8685325406617108681:946479057170751539>",
  },
};
