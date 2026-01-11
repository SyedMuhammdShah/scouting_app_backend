const User = require("../../models/user.model");
const PlayerProfile = require("../../models/playerProfile.model");

const ageFromDob = (dob) =>
  dob ? Math.floor((Date.now() - new Date(dob)) / 31557600000) : null;

exports.getMyProfile = async (userId) => {
  const user = await User.findById(userId).lean();
  let profile = await PlayerProfile.findOne({ user: userId }).lean();

  if (!profile) {
    profile = await PlayerProfile.create({ user: userId });
  }

  return {
    header: {
      profile: user.profile,
      fullName: user.fullName,
      position: profile.primaryPosition,
      age: ageFromDob(user.dob),
      location: `${user.city}, ${user.country}`,
    },

    attributes: {
      age: ageFromDob(user.dob),
      weight: profile.weightKg ? `${profile.weightKg} kg` : null,
      height: profile.heightCm ? `${profile.heightCm} cm` : null,
      primaryPosition: profile.primaryPosition,
      secondaryPosition: profile.secondaryPosition || "N/A",
      preferredFoot: profile.preferredFoot,
    },

    stats: {
      connections: profile.connectionsCount,
      hosted: profile.hostedGamesCount,
      completed: profile.completedGamesCount,
      upcomingThisWeek: profile.upcomingGamesThisWeek,
    },

    media: {
      videos: profile.videos || [],
      images: profile.images || [],
    },
  };
};

exports.saveProfile = async (userId, payload) => {
  return PlayerProfile.findOneAndUpdate(
    { user: userId },
    payload,
    { upsert: true, new: true }
  );
};

exports.addImage = async (userId, url) => {
  return PlayerProfile.findOneAndUpdate(
    { user: userId },
    { $push: { images: { url, uploadedAt: new Date() } } },
    { new: true }
  );
};

exports.addVideo = async (userId, data) => {
  return PlayerProfile.findOneAndUpdate(
    { user: userId },
    { $push: { videos: { ...data, uploadedAt: new Date() } } },
    { new: true }
  );
};

exports.deleteImage = async (userId, url) => {
  return PlayerProfile.findOneAndUpdate(
    { user: userId },
    { $pull: { images: { url } } },
    { new: true }
  );
};

exports.deleteVideo = async (userId, url) => {
  return PlayerProfile.findOneAndUpdate(
    { user: userId },
    { $pull: { videos: { url } } },
    { new: true }
  );
};
