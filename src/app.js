const express = require("express");
const authRoutes = require("./modules/auth/auth.routes");
const profileRoutes = require("./modules/profile/profile.routes");

const app = express();
app.use(express.json());

//cors is missing
const cors = require('cors')

app.use(cors({ origin: ['abc.com'] }))//TODO
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/connections", require("./modules/connections/connection.routes"));
app.use("/api/players", require("./modules/players/players.routes"));
app.use("/api/challenges", require("./modules/challenges/challenge.routes"));
app.use("/api/games", require("./modules/games/game.routes"));

module.exports = app;
