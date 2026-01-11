const User = require("../../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (data) => {
  data.password = await bcrypt.hash(data.password,10);
  const user = await User.create(data);
  const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);
  return {user, token};
};

exports.login = async ({identifier, password}) => {
  const user = await User.findOne({
    $or:[{email:identifier},{phoneNumber:identifier}]
  }).select("+password");

  if(!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password,user.password);
  if(!match) throw new Error("Invalid credentials");

  const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);
  return {user, token};
};
