const service = require("./players.service");
const HttpStatusCode = require("../../utils/HttpStatusCode");

exports.getAllPlayers = async (req, res) => {
  try {
    const result = await service.getAllPlayers(req.user.id, req.query);
    HttpStatusCode.sendOK(
      res,
      "Players fetched successfully",
      result
    );
  } catch (error) {
    HttpStatusCode.sendInternalServerError(
      res,
      "Error fetching players",
      error.message
    );
  }
};

exports.getPlayerById = async (req, res) => {
  try {
    const result = await service.getPlayerById(req.user.id, req.params.userId);
    HttpStatusCode.sendOK(res, "Player fetched successfully", result);
  } catch (error) {
    HttpStatusCode.sendInternalServerError(
      res,
      "Error fetching player",
      error.message
    );
  }
};
