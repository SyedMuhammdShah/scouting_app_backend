const Joi = require("joi");


const profileValidationSchemas = {
  updateProfile: Joi.object({
    heightCm: Joi.number()
      .positive()
      .optional()
      .messages({
        "number.base": "Height must be a number",
        "number.positive": "Height must be a positive number",
      }),
    weightKg: Joi.number()
      .positive()
      .optional()
      .messages({
        "number.base": "Weight must be a number",
        "number.positive": "Weight must be a positive number",
      }),
    preferredFoot: Joi.string()
      .valid("Left", "Right", "Both")
      .optional()
      .messages({
        "any.only": "Preferred foot must be Left, Right, or Both",
      }),
    primaryPosition: Joi.string()
      .optional()
      .messages({
        "string.base": "Primary position must be a string",
      }),
    secondaryPosition: Joi.string()
      .optional()
      .messages({
        "string.base": "Secondary position must be a string",
      }),
    bio: Joi.string()
      .max(500)
      .optional()
      .messages({
        "string.max": "Bio must not exceed 500 characters",
      }),
    dateOfBirth: Joi.date()
      .optional()
      .messages({
        "date.base": "Date of birth must be a valid date",
      }),
  }),

  addImage: Joi.object({
    url: Joi.string()
      .uri()
      .required()
      .messages({
        "string.uri": "Image URL must be a valid URL",
        "any.required": "Image URL is required",
      }),
  }),

  addVideo: Joi.object({
    url: Joi.string()
      .uri()
      .required()
      .messages({
        "string.uri": "Video URL must be a valid URL",
        "any.required": "Video URL is required",
      }),
    title: Joi.string()
      .optional()
      .max(200)
      .messages({
        "string.max": "Title must not exceed 200 characters",
      }),
    description: Joi.string()
      .optional()
      .max(500)
      .messages({
        "string.max": "Description must not exceed 500 characters",
      }),
  }),

  deleteImage: Joi.object({
    url: Joi.string()
      .uri()
      .required()
      .messages({
        "string.uri": "Image URL must be a valid URL",
        "any.required": "Image URL is required",
      }),
  }),

  deleteVideo: Joi.object({
    url: Joi.string()
      .uri()
      .required()
      .messages({
        "string.uri": "Video URL must be a valid URL",
        "any.required": "Video URL is required",
      }),
  }),
};

module.exports = profileValidationSchemas;
