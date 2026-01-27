const service = require("./game.service");
const HttpStatusCode = require("../../utils/HttpStatusCode");

exports.listGames = async (req, res) => {
  try {
    const games = await service.listGames(req.query);
    HttpStatusCode.sendOK(res, "Games fetched successfully", games);
  } catch (error) {
    HttpStatusCode.sendInternalServerError(res, "Error fetching games", error.message);
  }
};

exports.getGameById = async (req, res) => {
  try {
    const game = await service.getGameById(req.params.id);
    HttpStatusCode.sendOK(res, "Game details fetched successfully", game);
  } catch (error) {
    HttpStatusCode.sendNotFound(res, "Game not found", error.message);
  }
};

exports.createGame = async (req, res) => {
  try {
    const game = await service.createGame(req.user.id, req.body);
    HttpStatusCode.sendCreated(res, "Game created successfully", game);
  } catch (error) {
    HttpStatusCode.sendBadRequest(res, "Error creating game", error.message);
  }
};

exports.requestToJoin = async (req, res) => {
  try {
    const result = await service.requestToJoin(req.params.id, req.user.id);
    HttpStatusCode.sendOK(res, "Join request sent successfully", result);
  } catch (error) {
    HttpStatusCode.sendBadRequest(res, "Error requesting to join", error.message);
  }
};

exports.listJoinRequests = async (req, res) => {
  try {
    const requests = await service.listJoinRequests(req.params.id, req.user.id);
    HttpStatusCode.sendOK(res, "Join requests fetched successfully", requests);
  } catch (error) {
    HttpStatusCode.sendBadRequest(res, "Error fetching join requests", error.message);
  }
};

exports.respondToJoinRequest = async (req, res) => {
  try {
    const result = await service.respondToJoinRequest(
      req.params.id,
      req.user.id,
      req.params.userId,
      req.body.action
    );
    HttpStatusCode.sendOK(res, `Join request ${req.body.action}ed successfully`, result);
  } catch (error) {
    HttpStatusCode.sendBadRequest(res, "Error responding to join request", error.message);
  }
};
