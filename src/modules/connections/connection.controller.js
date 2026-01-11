const service = require("./connection.service");
const ApiResponse = require("../../utils/apiResponse");

exports.sendRequest = async (req, res) => {
  const result = await service.sendRequest(req.user.id, req.params.userId);
  res
    .status(201)
    .json(new ApiResponse(201, "Connection request sent", result));
};

exports.acceptRequest = async (req, res) => {
  const result = await service.acceptRequest(req.user.id, req.params.userId);
  res
    .status(200)
    .json(new ApiResponse(200, "Connection request accepted", result));
};
