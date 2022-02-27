const { Router } = require("express");
const { client } = require("../../..");
const { react } = require("../../../data/config").dashboard;

const router = Router();

const passport = require("../strategy");

router.get("/discord/", passport.authenticate("discord"));

router.get(
  "/discord/redirect/",
  passport.authenticate("discord"),
  (req, res) => {
    req.session.user = req.user;
    res.redirect(react);
  }
);

router.get("/", async (req, res) => {
  req.user = req.session.user;
  if (!req.user) return res.sendStatus(401);
  res.send({
    guilds: req.user.guilds,
    userId: req.user.userId,
    discordTag: req.user.discordTag,
    coins: await require("../../../functions/getCoins")(req.user.userId),
    avatarURL: client.users.cache.get(req.user.userId)
      ? client.users.cache.get(req.user.userId).avatarURL({
          format: "jpg",
        })
      : client.user.avatarURL({ format: "jpg" }),
  });
});

// Logout endpoint.
router.get("/logout", function (req, res) {
  req.session.destroy(() => {
    req.logout();
    res.redirect(react);
  });
});

// Logout endpoint.
router.get("/add", function (req, res) {
  if (req.query.guildID) {
    res.redirect(
      `https://discord.com/api/oauth2/authorize?client_id=${
        require("../../../data/config").bot.id
      }&permissions=8&scope=bot&guild_id=${req.query.guildID}`
    );
  } else return res.sendStatus(404);
});

// eslint-disable-next-line eol-last
module.exports = router;
