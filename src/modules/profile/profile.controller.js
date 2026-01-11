const service = require("./profile.service");
const ApiResponse = require("../../utils/apiResponse");

exports.getMyProfile = async (req, res) => {
  const result = await service.getMyProfile(req.user.id);
  res
    .status(200)
    .json(new ApiResponse(200, "Profile fetched successfully", result));
};

exports.saveProfile = async (req, res) => {
  const result = await service.saveProfile(req.user.id, req.body);
  res
    .status(200)
    .json(new ApiResponse(200, "Profile saved successfully", result));
};

exports.addImage = async (req, res) => {
  const result = await service.addImage(req.user.id, req.body.url);
  res
    .status(201)
    .json(new ApiResponse(201, "Image uploaded successfully", result));
};

exports.addVideo = async (req, res) => {
  const result = await service.addVideo(req.user.id, req.body);
  res
    .status(201)
    .json(new ApiResponse(201, "Video uploaded successfully", result));
};

exports.deleteImage = async (req, res) => {
  const result = await service.deleteImage(req.user.id, req.body.url);
  res
    .status(200)
    .json(new ApiResponse(200, "Image deleted successfully", result));
};

exports.deleteVideo = async (req, res) => {
  const result = await service.deleteVideo(req.user.id, req.body.url);
  res
    .status(200)
    .json(new ApiResponse(200, "Video deleted successfully", result));
};
