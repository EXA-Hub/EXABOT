const { client } = require("../../../../index");
const { Router } = require("express");
const router = Router();

router.use((req, res, next) => {
  const user = client.users.cache.get(req.user.userId);
  if (!user) return res.status(404).send({ message: "لا يوجد مستخدم" });
  next();
});

router.all("/", async (req, res) => {
  res.send(req.user.userId);
});

const UserRouters = require("path").join(__dirname, "user");

require("fs")
  .readdirSync(UserRouters)
  .forEach((file) => {
    router.use("/", require("./user/" + file));
  });

module.exports = router;
