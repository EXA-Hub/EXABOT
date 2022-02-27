const { client } = require("../../../../index");
const { Router } = require("express");
const router = Router();

router.use("/:guildID", (req, res, next) => {
  const { guildID } = req.params;
  if (!guildID) return res.status(404).json({ message: "guildID مطلوب" });
  const guild = client.guilds.cache.get(guildID);
  if (!guild) return res.status(404).send({ message: "لا يوجد سيرفر" });
  const member = guild.members.cache.get(req.user.userId);
  if (!member) return res.status(403).send({ message: "لست عضو في السيرفر" });
  const idMod = member.permissions.has("MANAGE_GUILD"),
    isOwner = guild.ownerId === member.user.id;
  if (!idMod && !isOwner)
    return res.status(403).send({
      message: 'يجب أن تمتلك صلاحية "MANAGE_GUILD"',
    });
  next();
});

router.all("/", async (req, res) => {
  res.send(req.user.guilds);
});

router.all("/:guildID", async (req, res) => {
  const { guildID } = req.params;
  const discordGuild = client.guilds.cache.get(guildID);
  let guild = req.user.guilds.find((guild) => guild.id === guildID);
  guild.memberCount = discordGuild.memberCount;
  res.send(guild);
});

const GuildsRouters = require("path").join(__dirname, "guilds");

require("fs")
  .readdirSync(GuildsRouters)
  .forEach((file) => {
    router.use("/", require("./guilds/" + file));
  });

module.exports = router;
