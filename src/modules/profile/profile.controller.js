const service = require("./profile.service");
const HttpStatusCode = require("../../utils/HttpStatusCode");

exports.getMyProfile = async (req, res) => {
  try {
    const result = await service.getMyProfile(req.user.id);
    HttpStatusCode.sendOK(res, "Profile fetched successfully", result);
  } catch (error) {
    HttpStatusCode.sendInternalServerError(
      res,
      "Error fetching profile",
      error.message
    );
  }
};

exports.saveProfile = async (req, res) => {
  try {
    const result = await service.saveProfile(req.user.id, req.body);
    HttpStatusCode.sendOK(res, "Profile saved successfully", result);
  } catch (error) {
    HttpStatusCode.sendBadRequest(
      res,
      "Error saving profile",
      error.message
    );
  }
};

exports.addImage = async (req, res) => {
  try {
    const result = await service.addImage(req.user.id, req.body.url);
    HttpStatusCode.sendCreated(
      res,
      "Image uploaded successfully",
      result
    );
  } catch (error) {
    HttpStatusCode.sendBadRequest(
      res,
      "Error uploading image",
      error.message
    );
  }
};

exports.addVideo = async (req, res) => {
  try {
    const result = await service.addVideo(req.user.id, req.body);
    HttpStatusCode.sendCreated(
      res,
      "Video uploaded successfully",
      result
    );
  } catch (error) {
    HttpStatusCode.sendBadRequest(
      res,
      "Error uploading video",
      error.message
    );
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const result = await service.deleteImage(req.user.id, req.body.url);
    HttpStatusCode.sendOK(res, "Image deleted successfully", result);
  } catch (error) {
    HttpStatusCode.sendBadRequest(
      res,
      "Error deleting image",
      error.message
    );
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const result = await service.deleteVideo(req.user.id, req.body.url);
    HttpStatusCode.sendOK(res, "Video deleted successfully", result);
  } catch (error) {
    HttpStatusCode.sendBadRequest(
      res,
      "Error deleting video",
      error.message
    );
  }
};
