const router = require("express").Router();
const controller = require("./players.controller");
const auth = require("../../middlewares/auth.middleware");

// Explore players
router.get("/", auth, controller.getAllPlayers);

// View single player profile
router.get("/:userId", auth, controller.getPlayerById);

module.exports = router;
