const router = require("express").Router();
const controller = require("./game.controller");
const auth = require("../../middlewares/auth.middleware");
const validateRequest = require("../../middlewares/validate.middleware");
const gameValidation = require("./game.validation");

router.get("/", auth, validateRequest(gameValidation.listGames, "query"), controller.listGames);
router.post("/", auth, validateRequest(gameValidation.createGame, "body"), controller.createGame);
router.get("/:id", auth, controller.getGameById);

router.post("/:id/join", auth, controller.requestToJoin);
router.get("/:id/requests", auth, controller.listJoinRequests);
router.patch("/:id/requests/:userId", auth, validateRequest(gameValidation.respondToRequest, "body"), controller.respondToJoinRequest);

module.exports = router;
