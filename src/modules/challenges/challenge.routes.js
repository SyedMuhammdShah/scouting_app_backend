const router = require("express").Router();
const controller = require("./challenge.controller");
const auth = require("../../middlewares/auth.middleware");
const validateRequest = require("../../middlewares/validate.middleware");
const schemas = require("./challenge.validation");

router.post("/", auth, validateRequest(schemas.createChallenge, "body"), controller.createChallenge);
router.get("/", auth, controller.getMyChallenges);
router.patch("/:id/respond", auth, validateRequest(schemas.respondToChallenge, "body"), controller.respondToChallenge);
router.patch("/:id/finalize", auth, validateRequest(schemas.finalizeChallenge, "body"), controller.finalizeChallenge);

module.exports = router;
