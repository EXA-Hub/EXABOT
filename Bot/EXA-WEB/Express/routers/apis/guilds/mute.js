const { Router } = require("express");
const { client } = require("../../../../../index");
const mute = require("../../../APIfunctions/mute");
const db = require("../../../../../functions/database");

const router = Router();

router.all("/:guildID/mute/:ID", async (req, res) => {
  const { guildID, ID } = req.params;
  if (!ID) return res.status(404).json({ message: "guildID & ID مطلوبين" });
  const guild = client.guilds.cache.get(guildID);
  if (!guild) return res.status(404).json({ message: "لا يوجد مجتمع" });
  const targetmember = guild.members.cache.get(ID);
  const targetrole = guild.roles.cache.get(ID);
  if (!targetmember && !targetrole) {
    return res
      .status(404)
      .json({ message: "👀 | لا أستطيع العثور على العضو أو الرتبة" });
  } else if (targetmember) {
    const mutedPeople = await db.get("muted");
    const mutedMembers = mutedPeople[guildID];
    if (mutedMembers.includes(ID))
      return res.status(404).json({ message: "هذا العضو محظور بالفعل" });
    res.send(mute({ guild }, targetmember));
  } else if (targetrole) {
    if (targetrole.permissions.has("ADD_REACTIONS" || "SEND_MESSAGES"))
      return res.status(404).json({
        message:
          "🚧 | هذه الرتبة لا تصلح ( الرتبة تمتلك صلاحيات للكتابة والتعليق )",
      });
    const saveData = async (saved, path) => {
      var datafile = (await db.get(path)) || {};
      datafile[guild.id] = saved;
      db.set(path, datafile);
      return Promise.resolve();
    };
    res.send(saveData(targetrole.id, "mute_roles"));
  }
});

module.exports = router;
