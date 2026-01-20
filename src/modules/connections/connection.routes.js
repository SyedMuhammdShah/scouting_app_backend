const router = require("express").Router();
const controller = require("./connection.controller");
const auth = require("../../middlewares/auth.middleware");
const validateRequest = require("../../middlewares/validate.middleware");
const connectionValidationSchemas = require("./connection.validation");

// Send a connection request
router.post(
  "/request/:userId",
  auth,
  validateRequest(connectionValidationSchemas.sendRequest, "params"),
  controller.sendRequest
);

// Accept a connection request
router.post(
  "/accept/:userId",
  auth,
  validateRequest(connectionValidationSchemas.acceptRequest, "params"),
  controller.acceptRequest
);

// Reject a connection request
router.post(
  "/reject/:userId",
  auth,
  validateRequest(connectionValidationSchemas.rejectRequest, "params"),
  controller.rejectRequest
);

// Get pending connection requests (received)
router.get("/pending", auth, controller.getPendingConnections);

// Get accepted connections
router.get("/accepted", auth, controller.getAcceptedConnections);

// Remove a connection
router.delete(
  "/:userId",
  auth,
  validateRequest(connectionValidationSchemas.removeConnection, "params"),
  controller.removeConnection
);

module.exports = router;
