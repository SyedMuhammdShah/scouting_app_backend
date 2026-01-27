const Game = require("../../models/game.model");

exports.listGames = async (filters) => {
  const query = {};
  if (filters.status) query.status = filters.status;
  // Potentially add more filtering logic here (e.g. type, proximity)

  return await Game.find(query)
    .populate("host", "fullName username profile")
    .sort("-createdAt");
};

exports.getGameById = async (gameId) => {
  const game = await Game.findById(gameId)
    .populate("host", "fullName username profile")
    .populate("players", "fullName username profile")
    .populate("pendingPlayers", "fullName username profile");

  if (!game) {
    throw new Error("Game not found");
  }

  return game;
};

exports.createGame = async (userId, data) => {
  const game = new Game({
    ...data,
    host: userId,
    players: [userId], // Host is automatically a player
  });
  return await game.save();
};

exports.requestToJoin = async (gameId, userId) => {
  const game = await Game.findById(gameId);
  if (!game) throw new Error("Game not found");

  if (game.host.toString() === userId) {
    throw new Error("Host cannot join their own game as a request");
  }

  if (game.players.includes(userId)) {
    throw new Error("You are already a player in this game");
  }

  if (game.pendingPlayers.includes(userId)) {
    throw new Error("Join request already pending");
  }

  if (game.status === "FULL") {
    throw new Error("Game is already full");
  }

  game.pendingPlayers.push(userId);
  return await game.save();
};

exports.listJoinRequests = async (gameId, ownerId) => {
  const game = await Game.findById(gameId).populate("pendingPlayers", "fullName username profile");
  if (!game) throw new Error("Game not found");

  if (game.host.toString() !== ownerId) {
    throw new Error("Only the host can view join requests");
  }

  return game.pendingPlayers;
};

exports.respondToJoinRequest = async (gameId, ownerId, targetUserId, action) => {
  const game = await Game.findById(gameId);
  if (!game) throw new Error("Game not found");

  if (game.host.toString() !== ownerId) {
    throw new Error("Only the host can respond to join requests");
  }

  if (!game.pendingPlayers.includes(targetUserId)) {
    throw new Error("User hasn't requested to join this game");
  }

  game.pendingPlayers = game.pendingPlayers.filter(id => id.toString() !== targetUserId);

  if (action === "accept") {
    if (game.status === "FULL") {
      throw new Error("Cannot accept player, game is already full");
    }
    game.players.push(targetUserId);

    // Check if game is now full
    if (game.schedule.playersNeeded && game.players.length >= game.schedule.playersNeeded) {
      game.status = "FULL";
    }
  }

  return await game.save();
};
