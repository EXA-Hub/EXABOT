const { Router } = require("express");

const router = Router();

const passport = require("../strategy");

router.get("/discord/", passport.authenticate("discord"));

router.get(
  "/discord/redirect/",
  passport.authenticate("discord"),
  (req, res) => {
    req.session.user = req.user;
    res.redirect("/api");
  }
);

router.get("/", async (req, res) => {
  req.user = req.session.user;
  if (!req.user) return res.sendStatus(401);
  res.send({
    guilds: req.user.guilds,
    userId: req.user.userId,
    discordTag: req.user.discordTag,
  });
});

// Logout endpoint.
router.get("/logout", function (req, res) {
  // We destroy the session.
  req.session.destroy(() => {
    // We logout the user.
    req.logout();
    // We redirect user to index.
    res.redirect("/");
  });
});

// eslint-disable-next-line eol-last
module.exports = router;
