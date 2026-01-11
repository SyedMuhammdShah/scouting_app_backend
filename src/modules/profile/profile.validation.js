const { body } = require("express-validator");

exports.updateProfileValidation = [
  body("heightCm").optional().isNumeric(),
  body("weightKg").optional().isNumeric(),
  body("preferredFoot").optional().isIn(["Left", "Right", "Both"]),
  body("primaryPosition").optional().isString(),
  body("secondaryPosition").optional().isString(),
];
