const Game = require("../../models/game.model");

exports.getUpcomingGames = async (userId) => {
  return await Game.find({
    players: userId,
    status: "upcoming",
  })
    .populate("players", "fullName username")
    .populate("challenge")
    .sort("date");
};

exports.getGameById = async (userId, gameId) => {
  const game = await Game.findOne({
    _id: gameId,
    players: userId,
  }).populate("players", "fullName username");

  if (!game) {
    throw new Error("Game not found or access denied");
  }

  return game;
};
