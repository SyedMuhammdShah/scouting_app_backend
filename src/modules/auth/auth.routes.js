const router = require("express").Router();
const controller = require("./auth.controller");
const validateRequest = require("../../middlewares/validate.middleware");
const authValidationSchemas = require("./auth.validation");

router.post(
  "/register",
  validateRequest(authValidationSchemas.register),
  controller.register
);

router.post(
  "/login",
  validateRequest(authValidationSchemas.login),
  controller.login
);

module.exports = router;