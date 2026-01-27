const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    pendingPlayers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    quickSetup: {
      isPrivate: { type: Boolean, default: false },
      enableChat: { type: Boolean, default: true },
      enablePayment: { type: Boolean, default: true },
      copyPreviousGame: { type: Boolean, default: false },
      backgroundImage: String,
    },
    details: {
      title: { type: String, required: true },
      description: String,
      location: { type: String, required: true },
      coordinates: {
        lat: Number,
        long: Number,
      },
    },
    schedule: {
      date: { type: Date, required: true },
      time: String,
      duration: String, // e.g., "90 mins"
      playersNeeded: Number,
    },
    rules: {
      groundType: String, // Turf, Natural Grass
      matchFormat: String, // 5v5, 6v6, etc.
      ageRange: {
        from: Number,
        to: Number,
      },
      gender: {
        type: String,
        enum: ["Male", "Female", "Mix"],
        default: "Mix",
      },
    },
    payment: {
      level: String, // Amateur, Intermediate, Pro
      option: String, // Online, Cash
      price: { type: Number, default: 0 },
      currency: { type: String, default: "USD" },
    },
    status: {
      type: String,
      enum: ["OPEN", "FULL", "STARTED", "COMPLETED", "CANCELLED"],
      default: "OPEN",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Game", gameSchema);
