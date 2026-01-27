const express = require("express");
const path = require("path");
const cors = require("cors");
const authRoutes = require("./modules/auth/auth.routes");
const profileRoutes = require("./modules/profile/profile.routes");

const app = express();

// Request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => res.send("Hello World!"));

// Middleware
app.use(cors()); // Allow all origins for debugging
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
const uploadPath = process.env.UPLOAD_PATH || path.join(__dirname, "../uploads");
console.log("Static files being served from:", uploadPath);

// Debug route to see files
app.get("/debug/uploads", (req, res) => {
  const fs = require("fs");
  if (fs.existsSync(uploadPath)) {
    const files = fs.readdirSync(uploadPath);
    res.json({ uploadPath, files });
  } else {
    res.status(404).json({ error: "Upload path not found", uploadPath });
  }
});

app.use("/uploads", express.static(uploadPath));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/connections", require("./modules/connections/connection.routes"));
app.use("/api/players", require("./modules/players/players.routes"));
app.use("/api/challenges", require("./modules/challenges/challenge.routes"));
app.use("/api/games", require("./modules/games/game.routes"));

module.exports = app;
