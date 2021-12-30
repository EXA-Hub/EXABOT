module.exports = (Client) => {
  const express = require("express");
  const session = require("express-session");
  const config = require("../../data/config");
  const passport = require("./strategy");
  const { react } = config.dashboard;
  const cors = require("cors");
  const authenticationRouter = require("./routers/authentication");
  const MongoStore = require("connect-mongo");

  const app = express();

  app.use(
    cors({
      origin: react,
      credentials: true,
      optionSuccessStatus: 200,
    })
  );

  app.use(express.json());
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: config.dashboard.secret,
      cookie: {
        maxAge: 60 * 1000 * 60 * 24,
      },
      store: MongoStore.create({ mongoUrl: Client.mongo._connectionString }),
    })
  );

  app.use("/api/auth/", authenticationRouter);

  const api = require("./routers/api");
  app.use("/api", api);

  app.all("/:param?", (req, res) => {
    res.send({
      query: req.query,
      params: req.params,
      body: req.body,
    });
  });

  app.use((req, res, next) => {
    res
      .status(404)
      .send(app._router.stack.filter((r) => r.route).map((r) => r.route.path));
  });

  const PORT = config.dashboard.port || 3001;
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
};
