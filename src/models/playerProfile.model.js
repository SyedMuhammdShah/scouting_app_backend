// src/models/playerProfile.model.js
const mongoose = require("mongoose");

const playerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },

    primaryPosition: String,
    secondaryPosition: String,
    preferredFoot: {
      type: String,
      enum: ["Left", "Right", "Both"],
    },

    heightCm: Number,
    weightKg: Number,

    connectionsCount: { type: Number, default: 0 },
    hostedGamesCount: { type: Number, default: 0 },
    completedGamesCount: { type: Number, default: 0 },
    upcomingGamesThisWeek: { type: Number, default: 0 },

    images: [{ url: String, uploadedAt: Date }],
    videos: [{ url: String, thumbnail: String, uploadedAt: Date }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("PlayerProfile", playerProfileSchema);
