const router = require("express").Router();
const controller = require("./players.controller");
const auth = require("../../middlewares/auth.middleware");
const validateRequest = require("../../middlewares/validate.middleware");
const playersValidationSchemas = require("./players.validation");

// Explore players with optional filters
router.get(
  "/",
  auth,
  validateRequest(playersValidationSchemas.getAllPlayers, "query"),
  controller.getAllPlayers
);

// View single player profile
router.get(
  "/:userId",
  auth,
  validateRequest(playersValidationSchemas.getPlayerById, "params"),
  controller.getPlayerById
);

module.exports = router;
