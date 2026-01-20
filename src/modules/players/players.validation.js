const Joi = require("joi");

/**
 * Players validation schemas using Joi
 */

const playersValidationSchemas = {
  getPlayerById: Joi.object({
    userId: Joi.string()
      .required()
      .messages({
        "any.required": "User ID is required",
        "string.base": "User ID must be a string",
      }),
  }),

  getAllPlayers: Joi.object({
    search: Joi.string()
      .optional()
      .max(100)
      .messages({
        "string.max": "Search term must not exceed 100 characters",
      }),
    city: Joi.string()
      .optional()
      .max(100)
      .messages({
        "string.max": "City must not exceed 100 characters",
      }),
    position: Joi.string()
      .optional()
      .max(50)
      .messages({
        "string.max": "Position must not exceed 50 characters",
      }),
    page: Joi.number()
      .optional()
      .min(1)
      .messages({
        "number.min": "Page must be at least 1",
      }),
    limit: Joi.number()
      .optional()
      .min(1)
      .max(100)
      .messages({
        "number.min": "Limit must be at least 1",
        "number.max": "Limit must not exceed 100",
      }),
  }),
};

module.exports = playersValidationSchemas;
