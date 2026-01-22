const router = require("express").Router();
const controller = require("./game.controller");
const auth = require("../../middlewares/auth.middleware");

router.get("/upcoming", auth, controller.getUpcomingGames);
router.get("/:id", auth, controller.getGameById);

module.exports = router;
