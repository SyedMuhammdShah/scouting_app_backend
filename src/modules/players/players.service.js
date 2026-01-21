const User = require("../../models/user.model");
const PlayerProfile = require("../../models/playerProfile.model");

// Get all players (excluding the current user)
exports.getAllPlayers = async (currentUserId, queryParams = {}) => {
  try {
    // Get the current user to exclude them from results
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      throw new Error("Current user not found");
    }

    // Build filter for search and filters
    const filter = { _id: { $ne: currentUserId } }; // Exclude current user

    // Search by fullName if provided
    if (queryParams.search) {
      filter.fullName = { $regex: queryParams.search, $options: "i" };
    }

    // Filter by city if provided
    if (queryParams.city) {
      filter.city = queryParams.city;
    }

    // Filter by position if provided
    if (queryParams.position) {
      // This would need to be searched in PlayerProfile, handled separately
    }

    // Pagination
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalPlayers = await User.countDocuments(filter);

    // Get paginated users
    const users = await User.find(filter)
      .select("-password")
      .limit(limit)
      .skip(skip)
      .exec();

    // Get player profiles for these users
    const playerProfiles = await PlayerProfile.find({
      user: { $in: users.map((u) => u._id) },
    });

    // Combine user data with their player profiles
    const playersData = users.map((user) => {
      const profile = playerProfiles.find(
        (p) => p.user.toString() === user._id.toString()
      );
      return {
        ...user.toObject(),
        playerProfile: profile || null,
      };
    });

    return {
      players: playersData,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPlayers / limit),
        totalPlayers,
        playersPerPage: limit,
      },
    };
  } catch (error) {
    throw new Error(`Error fetching players: ${error.message}`);
  }
};

// Get a single player by ID
exports.getPlayerById = async (currentUserId, playerId) => {
  try {
    // Validate that the player exists and is not the current user
    if (playerId === currentUserId) {
      throw new Error("Cannot view your own profile from this endpoint");
    }

    const user = await User.findById(playerId).select("-password");
    if (!user) {
      throw new Error("Player not found");
    }

    // Get player profile
    const playerProfile = await PlayerProfile.findOne({ user: playerId });

    return {
      ...user.toObject(),
      playerProfile: playerProfile || null,
    };
  } catch (error) {
    throw new Error(`Error fetching player: ${error.message}`);
  }
};
