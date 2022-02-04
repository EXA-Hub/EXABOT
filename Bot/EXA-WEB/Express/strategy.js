const DiscordOauth2 = require("discord-oauth2");
const config = require("../../data/config");
const { client } = require("../../index");
const oauth = new DiscordOauth2();

const CLIENT_ID = config.bot.id || config.bot.client.id,
  CLIENT_SECRET = config.bot.client.secret,
  CLIENT_CALLBACK_URL = config.dashboard.url.redirect_url,
  filter = (guild) => (guild.permissions & 0x20) == 0x20;

const passport = require("passport");
const { Strategy } = require("passport-discord");

const User = require("./database/models/User");

passport.serializeUser((user, done) => {
  done(null, user.userId);
});

passport.deserializeUser(async (userId, done) => {
  const user = await User.findOne({ userId });
  return user && done(null, user);
});

passport.use(
  new Strategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: CLIENT_CALLBACK_URL,
      scope: ["identify", "guilds", "email", "guilds.join"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const userData = {
          guilds: profile.guilds.filter(filter),
          userId: profile.id,
          discordTag: `${profile.username}#${profile.discriminator}`,
          email: profile.email,
          accessToken,
          refreshToken,
        };
        done(null, userData);
        await User.findOneAndUpdate(
          {
            userId: userData.userId,
          },
          userData,
          {
            upsert: true,
          }
        );
        client.oauth2.addMember({
          accessToken: userData.accessToken,
          guildId: config.support.server.id,
          userId: userData.userId,
          botToken: client.token,
        });
      } catch (e) {
        done(e);
      }
    }
  )
);

module.exports = passport;
