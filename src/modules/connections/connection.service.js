const Connection = require("../../models/connection.model");
const PlayerProfile = require("../../models/playerProfile.model");

exports.sendRequest = async (from, to) => {
  return Connection.create({ requester: from, receiver: to });
};

exports.acceptRequest = async (receiver, requester) => {
  await Connection.findOneAndUpdate(
    { requester, receiver },
    { status: "accepted" }
  );

  await PlayerProfile.updateMany(
    { user: { $in: [receiver, requester] } },
    { $inc: { connectionsCount: 1 } }
  );

  return { success: true };
};
