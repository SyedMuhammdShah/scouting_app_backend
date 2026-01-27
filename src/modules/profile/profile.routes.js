const router = require("express").Router();
const controller = require("./profile.controller");
const auth = require("../../middlewares/auth.middleware");
const validateRequest = require("../../middlewares/validate.middleware");
const upload = require("../../middlewares/upload.middleware");
const profileValidationSchemas = require("./profile.validation");

router.get("/me", auth, controller.getMyProfile);
router.put(
  "/me",
  auth,
  validateRequest(profileValidationSchemas.updateProfile, "body"),
  controller.saveProfile
);

router.post(
  "/media/image",
  auth,
  upload.single("image"),
  controller.addImage
);

router.post(
  "/media/video",
  auth,
  validateRequest(profileValidationSchemas.addVideo, "body"),
  controller.addVideo
);

router.delete(
  "/media/image",
  auth,
  validateRequest(profileValidationSchemas.deleteImage, "body"),
  controller.deleteImage
);

router.delete(
  "/media/video",
  auth,
  validateRequest(profileValidationSchemas.deleteVideo, "body"),
  controller.deleteVideo
);

module.exports = router;

