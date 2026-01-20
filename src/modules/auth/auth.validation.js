const Joi = require("joi");

const authValidationSchemas = {
  register: Joi.object({
    body: Joi.object({
      username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
        .messages({
          "string.alphanum": "Username must contain only alphanumeric characters",
          "string.min": "Username must be at least 3 characters long",
          "string.max": "Username must not exceed 30 characters",
          "any.required": "Username is required",
        }),
      email: Joi.string()
        .email()
        .required()
        .messages({
          "string.email": "Email must be a valid email address",
          "any.required": "Email is required",
        }),
      password: Joi.string()
        .min(6)
        .required()
        .messages({
          "string.min": "Password must be at least 6 characters long",
          "any.required": "Password is required",
        }),
      phoneNumber: Joi.string()
        .pattern(/^[0-9\-\+\s\(\)]+$/)
        .optional()
        .messages({
          "string.pattern.base": "Phone number must contain only digits and special characters",
        }),
      fullName: Joi.string()
        .optional()
        .messages({
          "string.base": "Full name must be a string",
        }),
      profile: Joi.string()
        .uri()
        .optional()
        .messages({
          "string.uri": "Profile must be a valid URL",
        }),
      gender: Joi.string()
        .valid("male", "female", "other")
        .optional()
        .messages({
          "any.only": "Gender must be one of: male, female, other",
        }),
      dob: Joi.date()
        .optional()
        .messages({
          "date.base": "Date of birth must be a valid date",
        }),
      nationality: Joi.string()
        .optional()
        .messages({
          "string.base": "Nationality must be a string",
        }),
      country: Joi.string()
        .optional()
        .messages({
          "string.base": "Country must be a string",
        }),
      city: Joi.string()
        .optional()
        .messages({
          "string.base": "City must be a string",
        }),
    }).unknown(false),
    query: Joi.object({}).unknown(false),
    params: Joi.object({}).unknown(false),
  }),

  login: Joi.object({
    body: Joi.object({
      identifier: Joi.alternatives()
        .try(
          Joi.string().email().messages({
            "string.email": "Invalid email format",
          }),
          Joi.string().pattern(/^[0-9\-\+\s\(\)]+$/).messages({
            "string.pattern.base": "Invalid phone number format",
          })
        )
        .required()
        .messages({
          "any.required": "Email or phone number is required",
          "alternatives.match": "Invalid email or phone number format",
        }),
      password: Joi.string()
        .required()
        .messages({
          "any.required": "Password is required",
        }),
    }).unknown(false),
    query: Joi.object({}).unknown(false),
    params: Joi.object({}).unknown(false),
  }),
};

module.exports = authValidationSchemas;