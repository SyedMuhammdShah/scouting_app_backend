const Challenge = require("../../models/challenge.model");
const Game = require("../../models/game.model");
const User = require("../../models/user.model");

exports.createChallenge = async (challengerId, data) => {
  const { challengedId, type, locationPicker, notes, timingWindow } = data;

  if (challengerId === challengedId) {
    throw new Error("You cannot challenge yourself");
  }

  const challengedUser = await User.findById(challengedId);
  if (!challengedUser) {
    throw new Error("Challenged user not found");
  }

  const challenge = new Challenge({
    challenger: challengerId,
    challenged: challengedId,
    type,
    locationPicker,
    notes,
    timingWindow,
  });

  await challenge.save();
  return challenge;
};

exports.respondToChallenge = async (userId, challengeId, status) => {
  const challenge = await Challenge.findById(challengeId);

  if (!challenge) {
    throw new Error("Challenge not found");
  }

  if (challenge.challenged.toString() !== userId.toString()) {
    throw new Error("Only the challenged player can respond");
  }

  if (challenge.status !== "pending") {
    throw new Error(`Challenge is already ${challenge.status}`);
  }

  challenge.status = status;
  await challenge.save();

  return challenge;
};

exports.finalizeChallenge = async (userId, challengeId, details) => {
  const challenge = await Challenge.findById(challengeId);

  if (!challenge) {
    throw new Error("Challenge not found");
  }

  if (challenge.status !== "accepted") {
    throw new Error("Challenge must be accepted before finalization");
  }

  // Check if this user is the one assigned to pick location/details
  const isChallengerPicker = challenge.locationPicker === "challenger" && challenge.challenger.toString() === userId.toString();
  const isChallengedPicker = challenge.locationPicker === "challenged" && challenge.challenged.toString() === userId.toString();

  if (!isChallengerPicker && !isChallengedPicker) {
    throw new Error("You are not authorized to finalize this challenge");
  }

  challenge.finalDetails = details;
  challenge.status = "finalized";
  await challenge.save();

  // Create the game automatically
  const game = new Game({
    players: [challenge.challenger, challenge.challenged],
    type: challenge.type,
    location: details.location,
    date: details.date,
    duration: details.duration,
    challenge: challenge._id,
    status: "upcoming",
  });

  await game.save();

  return { challenge, game };
};

exports.getUserChallenges = async (userId) => {
  return await Challenge.find({
    $or: [{ challenger: userId }, { challenged: userId }],
  })
    .populate("challenger", "fullName username city")
    .populate("challenged", "fullName username city")
    .sort("-createdAt");
};
