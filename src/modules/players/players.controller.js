const service = require("./players.service");
const ApiResponse = require("../../utils/apiResponse");

exports.getAllPlayers = async (req, res) => {
  try {
    const result = await service.getAllPlayers(req.user.id, req.query);
    res
      .status(200)
      .json(new ApiResponse(200, "Players fetched successfully", result));
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiResponse(500, "Error fetching players", { error: error.message })
      );
  }
};

exports.getPlayerById = async (req, res) => {
  try {
    const result = await service.getPlayerById(req.user.id, req.params.userId);
    res
      .status(200)
      .json(new ApiResponse(200, "Player fetched successfully", result));
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiResponse(500, "Error fetching player", { error: error.message })
      );
  }
};
