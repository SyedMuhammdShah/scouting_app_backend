const service = require("./auth.service");
const HttpStatusCode = require("../../utils/HttpStatusCode");

exports.register = async (req, res) => {
  console.log("Registration request body:", req.body);
  console.log("Registration request file:", req.file);
  try {
    const data = { ...req.body };
    if (req.file) {
      data.profile = `/uploads/profiles/${req.file.filename}`;
    }
    const result = await service.register(data);
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
