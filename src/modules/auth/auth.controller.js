const service = require("./auth.service");
const ApiResponse = require("../../utils/apiResponse");

exports.register = async (req, res) => {
  const result = await service.register(req.body);

  res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully", result));
};

exports.login = async (req, res) => {
  const result = await service.login(req.body);

  res.status(200).json(new ApiResponse(200, "Login successful", result));
};
