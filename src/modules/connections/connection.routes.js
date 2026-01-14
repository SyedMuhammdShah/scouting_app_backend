const router = require("express").Router();
const controller = require("./connection.controller");
const auth = require("../../middlewares/auth.middleware");

// Send a connection request
router.post("/request/:userId", auth, controller.sendRequest);

// Accept a connection request
router.post("/accept/:userId", auth, controller.acceptRequest);

// Reject a connection request
router.post("/reject/:userId", auth, controller.rejectRequest);

// Get pending connection requests (received)
router.get("/pending", auth, controller.getPendingConnections);

// Get accepted connections
router.get("/accepted", auth, controller.getAcceptedConnections);

// Remove a connection
router.delete("/:userId", auth, controller.removeConnection);

module.exports = router;
