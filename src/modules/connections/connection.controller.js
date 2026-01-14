const service = require("./connection.service");
const ApiResponse = require("../../utils/apiResponse");

exports.sendRequest = async (req, res) => {
  try {
    const result = await service.sendRequest(req.user.id, req.params.userId);
    res
      .status(201)
      .json(new ApiResponse(201, "Connection request sent", result));
  } catch (error) {
    res
      .status(400)
      .json(
        new ApiResponse(400, "Error sending connection request", {
          error: error.message,
        })
      );
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const result = await service.acceptRequest(req.user.id, req.params.userId);
    res
      .status(200)
      .json(new ApiResponse(200, "Connection request accepted", result));
  } catch (error) {
    res
      .status(400)
      .json(
        new ApiResponse(400, "Error accepting connection request", {
          error: error.message,
        })
      );
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const result = await service.rejectRequest(req.user.id, req.params.userId);
    res
      .status(200)
      .json(new ApiResponse(200, "Connection request rejected", result));
  } catch (error) {
    res
      .status(400)
      .json(
        new ApiResponse(400, "Error rejecting connection request", {
          error: error.message,
        })
      );
  }
};

exports.getPendingConnections = async (req, res) => {
  try {
    const result = await service.getPendingConnections(req.user.id);
    res
      .status(200)
      .json(
        new ApiResponse(200, "Pending connections fetched successfully", result)
      );
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiResponse(500, "Error fetching pending connections", {
          error: error.message,
        })
      );
  }
};

exports.getAcceptedConnections = async (req, res) => {
  try {
    const result = await service.getAcceptedConnections(req.user.id);
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Accepted connections fetched successfully",
          result
        )
      );
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiResponse(500, "Error fetching accepted connections", {
          error: error.message,
        })
      );
  }
};

exports.removeConnection = async (req, res) => {
  try {
    const result = await service.removeConnection(
      req.user.id,
      req.params.userId
    );
    res
      .status(200)
      .json(new ApiResponse(200, "Connection removed successfully", result));
  } catch (error) {
    res
      .status(400)
      .json(
        new ApiResponse(400, "Error removing connection", {
          error: error.message,
        })
      );
  }
};
