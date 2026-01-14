const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  profile: String,
  gender: String,
  fullName: String,
  dob: Date,
  nationality: String,
  username: { type: String, unique: true },
  country: String,
  city: String,
  phoneNumber: { type: String, unique: true },
  email: { type: String, unique: true },
  isDeleted: { type: Boolean, default: false },//TODO
  password: { type: String, select: false }
},{timestamps:true});

module.exports = mongoose.model("User", userSchema);
