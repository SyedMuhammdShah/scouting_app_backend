const Connection = require("../../models/connection.model");
const PlayerProfile = require("../../models/playerProfile.model");
const User = require("../../models/user.model");

exports.sendRequest = async (from, to) => {
  // Check if connection already exists
  const existingConnection = await Connection.findOne({
    $or: [
      { requester: from, receiver: to },
      { requester: to, receiver: from },
    ],
  });

  if (existingConnection) {
    throw new Error("Connection already exists");
  }

  return Connection.create({ requester: from, receiver: to });
};

exports.acceptRequest = async (receiver, requester) => {
  const connection = await Connection.findOneAndUpdate(
    { requester, receiver, status: "pending" },
    { status: "accepted" },
    { new: true }
  );

  if (!connection) {
    ("Connection request not found");
  }

  await PlayerProfile.updateMany(
    { user: { $in: [receiver, requester] } },
    { $inc: { connectionsCount: 1 } }
  );

  return connection;
};

exports.rejectRequest = async (receiver, requester) => {
  const connection = await Connection.findOneAndDelete({
    requester,
    receiver,
    status: "pending",
  });

  if (!connection) {
    throw new Error("Connection request not found");
  }

  return { success: true };
};

exports.getPendingConnections = async (userId) => {
  try {
    const pendingConnections = await Connection.find({
      receiver: userId,
      status: "pending",
    })
      .populate("requester", "fullName profile city country username")
      .lean();

    // Get player profiles for requesters
    const requesterIds = pendingConnections.map((c) => c.requester._id);
    const playerProfiles = await PlayerProfile.find({
      user: { $in: requesterIds },
    }).lean();

    // Combine connection data with user and profile info
    const connectionsWithDetails = await Promise.all(
      pendingConnections.map(async (connection) => {
        const profile = playerProfiles.find(
          (p) => p.user.toString() === connection.requester._id.toString()
        );

        return {
          connectionId: connection._id,
          status: connection.status,
          createdAt: connection.createdAt,
          requester: {
            _id: connection.requester._id,
            fullName: connection.requester.fullName,
            username: connection.requester.username,
            profile: connection.requester.profile,
            location: `${connection.requester.city}, ${connection.requester.country}`,
            position: profile?.primaryPosition || "N/A",
            secondaryPosition: profile?.secondaryPosition || "N/A",
            connectionsCount: profile?.connectionsCount || 0,
          },
        };
      })
    );

    return connectionsWithDetails;
  } catch (error) {//TODO: Consoles missing
    throw new Error(`Error fetching pending connections: ${error.message}`);
  }
};

exports.getAcceptedConnections = async (userId) => {
  try {    const acceptedConnections = await Connection.find({
      $or: [
        { requester: userId, status: "accepted" },
        { receiver: userId, status: "accepted" },
      ],
    })
      .populate(
        "requester receiver",
        "fullName profile city country username"
      )
      .lean();

    // Get all connected user IDs
    const connectedUserIds = acceptedConnections.map((c) => {
      return c.requester._id.toString() === userId.toString()
        ? c.receiver._id
        : c.requester._id;
    });

    const playerProfiles = await PlayerProfile.find({
      user: { $in: connectedUserIds },
    }).lean();

    // Format the response
    const connectionsWithDetails = acceptedConnections.map((connection) => {
      const connectedUser =
        connection.requester._id.toString() === userId.toString()
          ? connection.receiver
          : connection.requester;

      const profile = playerProfiles.find(
        (p) => p.user.toString() === connectedUser._id.toString()
      );

      return {
        connectionId: connection._id,
        status: connection.status,
        connectedAt: connection.updatedAt,
        user: {
          _id: connectedUser._id,
          fullName: connectedUser.fullName,
          username: connectedUser.username,
          profile: connectedUser.profile,
          location: `${connectedUser.city}, ${connectedUser.country}`,
          position: profile?.primaryPosition || "N/A",
          secondaryPosition: profile?.secondaryPosition || "N/A",
          connectionsCount: profile?.connectionsCount || 0,
        },
      };
    });

    return connectionsWithDetails;
  } catch (error) {
    throw new Error(`Error fetching accepted connections: ${error.message}`);
  }
};

exports.removeConnection = async (userId, connectedUserId) => {
  const connection = await Connection.findOneAndDelete({
    $or: [
      { requester: userId, receiver: connectedUserId },
      { requester: connectedUserId, receiver: userId },
    ],
    status: "accepted",
  });

  if (!connection) {
    throw new Error("Connection not found");
  }

  // Decrease connection count
  await PlayerProfile.updateMany(
    { user: { $in: [userId, connectedUserId] } },
    { $inc: { connectionsCount: -1 } }
  );

  return { success: true };
};
