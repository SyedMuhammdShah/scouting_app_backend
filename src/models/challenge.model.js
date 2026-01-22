const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema(
  {
    challenger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    challenged: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      default: "1v1",
    },
    locationPicker: {
      type: String,
      enum: ["challenger", "challenged"],
      required: true,
    },
    notes: String,
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "finalized"],
      default: "pending",
    },
    timingWindow: {
      start: Date,
      end: Date,
    },
    finalDetails: {
      location: String,
      date: Date,
      duration: Number, // in minutes
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Challenge", challengeSchema);
