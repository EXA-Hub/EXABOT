const mongoose = require("mongoose");

const User = new mongoose.Schema({
  guilds: { type: Array, required: true },
  userId: { type: String, required: true, unique: true },
  discordTag: { type: String, required: true },
  email: { type: String, required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
});

module.exports = mongoose.model("users", User);
