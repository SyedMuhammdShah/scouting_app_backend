const Joi = require("joi");

/**
 * Connection validation schemas using Joi
 */

const connectionValidationSchemas = {
  sendRequest: Joi.object({
    userId: Joi.string()
      .required()
      .messages({
        "any.required": "User ID is required",
        "string.base": "User ID must be a string",
      }),
  }),

  acceptRequest: Joi.object({
    userId: Joi.string()
      .required()
      .messages({
        "any.required": "User ID is required",
        "string.base": "User ID must be a string",
      }),
  }),

  rejectRequest: Joi.object({
    userId: Joi.string()
      .required()
      .messages({
        "any.required": "User ID is required",
        "string.base": "User ID must be a string",
      }),
  }),

  removeConnection: Joi.object({
    userId: Joi.string()
      .required()
      .messages({
        "any.required": "User ID is required",
        "string.base": "User ID must be a string",
      }),
  }),
};

module.exports = connectionValidationSchemas;
