const service = require("./auth.service");
const HttpStatusCode = require("../../utils/HttpStatusCode");

exports.register = async (req, res) => {
  try {
    const result = await service.register(req.body);
    HttpStatusCode.sendCreated(
      res,
      "User registered successfully",
      result
    );
  } catch (error) {
    HttpStatusCode.sendBadRequest(res, error.message);
  }
};

exports.login = async (req, res) => {
  try {
    const result = await service.login(req.body);
    HttpStatusCode.sendOK(res, "Login successful", result);
  } catch (error) {
    HttpStatusCode.sendUnauthorized(res, error.message);
  }
};
