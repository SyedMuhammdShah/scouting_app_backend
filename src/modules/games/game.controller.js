const service = require("./game.service");
const HttpStatusCode = require("../../utils/HttpStatusCode");

exports.getUpcomingGames = async (req, res) => {
  try {
    const games = await service.getUpcomingGames(req.user.id);
    HttpStatusCode.sendOK(res, "Upcoming games fetched successfully", games);
  } catch (error) {
    HttpStatusCode.sendInternalServerError(res, "Error fetching upcoming games", error.message);
  }
};

exports.getGameById = async (req, res) => {
  try {
    const game = await service.getGameById(req.user.id, req.params.id);
    HttpStatusCode.sendOK(res, "Game fetched successfully", game);
  } catch (error) {
    HttpStatusCode.sendInternalServerError(res, "Error fetching game", error.message);
  }
};
