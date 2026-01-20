const service = require("./connection.service");
const HttpStatusCode = require("../../utils/HttpStatusCode");

exports.sendRequest = async (req, res) => {
  try {
    const result = await service.sendRequest(req.user.id, req.params.userId);
    HttpStatusCode.sendCreated(
      res,
      "Connection request sent",
      result
    );
  } catch (error) {
    HttpStatusCode.sendBadRequest(
      res,
      "Error sending connection request",
      error.message
    );
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const result = await service.acceptRequest(req.user.id, req.params.userId);
    HttpStatusCode.sendOK(res, "Connection request accepted", result);
  } catch (error) {
    HttpStatusCode.sendBadRequest(
      res,
      "Error accepting connection request",
      error.message
    );
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const result = await service.rejectRequest(req.user.id, req.params.userId);
    HttpStatusCode.sendOK(res, "Connection request rejected", result);
  } catch (error) {
    HttpStatusCode.sendBadRequest(
      res,
      "Error rejecting connection request",
      error.message
    );
  }
};

exports.getPendingConnections = async (req, res) => {
  try {
    const result = await service.getPendingConnections(req.user.id);
    HttpStatusCode.sendOK(
      res,
      "Pending connections fetched successfully",
      result
    );
  } catch (error) {
    HttpStatusCode.sendInternalServerError(
      res,
      "Error fetching pending connections",
      error.message
    );
  }
};

exports.getAcceptedConnections = async (req, res) => {
  try {
    const result = await service.getAcceptedConnections(req.user.id);
    HttpStatusCode.sendOK(
      res,
      "Accepted connections fetched successfully",
      result
    );
  } catch (error) {
    HttpStatusCode.sendInternalServerError(
      res,
      "Error fetching accepted connections",
      error.message
    );
  }
};

exports.removeConnection = async (req, res) => {
  try {
    const result = await service.removeConnection(
      req.user.id,
      req.params.userId
    );
    HttpStatusCode.sendOK(res, "Connection removed successfully", result);
  } catch (error) {
    HttpStatusCode.sendBadRequest(
      res,
      "Error removing connection",
      error.message
    );
  }
};
