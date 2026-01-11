const router = require("express").Router();
const controller = require("./connection.controller");
const auth = require("../../middlewares/auth.middleware");

router.post("/request/:userId", auth, controller.sendRequest);
router.post("/accept/:userId", auth, controller.acceptRequest);

module.exports = router;
