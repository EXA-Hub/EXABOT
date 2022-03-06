const { Router } = require("express");
const db = require("../../../../../functions/database");

const router = Router();

router.all("/:guildID/welcome", async (req, res) => {
  const { guildID } = req.params;
  if (Object.keys(req.body).length === 0) {
    const welcomeImageData = await db.get(`${guildID}/welcomeImageData`);
    return res.send(welcomeImageData);
  } else {
    console.log(JSON.stringify(req.body));
    await db.set(`${guildID}/welcomeImageData`, req.body);
    res.send({ message: "تم بتجاح" });
  }
});

module.exports = router;
