const service = require("./challenge.service");
const HttpStatusCode = require("../../utils/HttpStatusCode");

exports.createChallenge = async (req, res) => {
  try {
    const challenge = await service.createChallenge(req.user.id, req.body);
    HttpStatusCode.sendCreated(res, "Challenge sent successfully", challenge);
  } catch (error) {
    HttpStatusCode.sendInternalServerError(res, "Error sending challenge", error.message);
  }
};

exports.respondToChallenge = async (req, res) => {
  try {
    const challenge = await service.respondToChallenge(req.user.id, req.params.id, req.body.status);
    HttpStatusCode.sendOK(res, `Challenge ${req.body.status} successfully`, challenge);
  } catch (error) {
    HttpStatusCode.sendInternalServerError(res, "Error responding to challenge", error.message);
  }
};

exports.finalizeChallenge = async (req, res) => {
  try {
    const result = await service.finalizeChallenge(req.user.id, req.params.id, req.body);
    HttpStatusCode.sendOK(res, "Challenge finalized and game created", result);
  } catch (error) {
    HttpStatusCode.sendInternalServerError(res, "Error finalizing challenge", error.message);
  }
};

exports.getMyChallenges = async (req, res) => {
  try {
    const challenges = await service.getUserChallenges(req.user.id);
    HttpStatusCode.sendOK(res, "Challenges fetched successfully", challenges);
  } catch (error) {
    HttpStatusCode.sendInternalServerError(res, "Error fetching challenges", error.message);
  }
};
