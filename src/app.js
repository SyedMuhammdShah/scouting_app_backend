const express = require("express");
const authRoutes = require("./modules/auth/auth.routes");
const profileRoutes = require("./modules/profile/profile.routes");

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

// src/app.js
app.use("/api/profile", require("./modules/profile/profile.routes"));
app.use("/api/connections", require("./modules/connections/connection.routes"));


module.exports = app;
