const router = require("express").Router();
const controller = require("./profile.controller");
const auth = require("../../middlewares/auth.middleware");

router.get("/me", auth, controller.getMyProfile);
router.put("/me", auth, controller.saveProfile);

router.post("/media/image", auth, controller.addImage);
router.post("/media/video", auth, controller.addVideo);

router.delete("/media/image", auth, controller.deleteImage);
router.delete("/media/video", auth, controller.deleteVideo);

module.exports = router;

