const { Router } = require("express");
const db = require("../../../../../functions/database");

const router = Router();

router.all("/:guildID/welcome", async (req, res) => {
  const data = req.body;
  const { guildID } = req.params;
  if (Object.keys(data).length === 0) {
    const welcomeImageData = await db.get(`${guildID}/welcomeImageData`);
    return res.send(welcomeImageData);
  } else {
    // if (Object.keys(data) !== ["StageData", "AvatarData", "TextData"])
    //   return res.status(401).send({ message: "معلومات غير صحيحة" });
    await db.set(`${guildID}/welcomeImageData`, data);
    res.send({ message: "تم بتجاح" });
  }
});

module.exports = router;
