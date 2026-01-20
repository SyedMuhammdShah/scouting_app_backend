const User = require("../../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (data) => {
  // Data is already validated by middleware, no need to validate again
  
  // Check if username already exists (case-insensitive for better UX)
  const existingUsername = await User.findOne({ 
    username: new RegExp(`^${data.username}$`, "i") 
  });
  if (existingUsername) {
    throw new Error(`Username "${data.username}" already exists`);
  }

  // Check if email already exists (case-insensitive)
  const existingEmail = await User.findOne({ 
    email: new RegExp(`^${data.email}$`, "i") 
  });
  if (existingEmail) {
    throw new Error(`Email "${data.email}" already exists`);
  }

  // Check if phone number already exists (if provided)
  if (data.phoneNumber) {
    const existingPhone = await User.findOne({ phoneNumber: data.phoneNumber });
    if (existingPhone) {
      throw new Error(`Phone number already exists`);
    }
  }

  // Hash password and create user
  const userData = { ...data };
  userData.password = await bcrypt.hash(userData.password, 10);
  const user = await User.create(userData);

  // Generate JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  return { user, token };
};

exports.login = async (data) => {
  // Data is already validated by middleware, no need to validate again
  
  // Find user by email or phone number
  const user = await User.findOne({
    $or: [{ email: data.identifier }, { phoneNumber: data.identifier }],
  }).select("+password");

  if (!user) {
    throw new Error("Invalid credentials");
  }

  // Compare password
  const match = await bcrypt.compare(data.password, user.password);
  if (!match) {
    throw new Error("Invalid credentials");
  }

  // Generate JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  return { user, token };
};
