const Joi = require("joi");

const challengeValidationSchemas = {
  createChallenge: Joi.object({
    challengedId: Joi.string().required().messages({
      "any.required": "Challenged user ID is required",
    }),
    type: Joi.string().optional().default("1v1"),
    locationPicker: Joi.string().valid("challenger", "challenged").required().messages({
      "any.only": "locationPicker must be 'challenger' or 'challenged'",
      "any.required": "locationPicker is required",
    }),
    notes: Joi.string().allow("").optional(),
    timingWindow: Joi.object({
      start: Joi.date().required(),
      end: Joi.date().required(),
    }).optional(),
  }),

  respondToChallenge: Joi.object({
    status: Joi.string().valid("accepted", "rejected").required().messages({
      "any.only": "Status must be 'accepted' or 'rejected'",
    }),
  }),

  finalizeChallenge: Joi.object({
    location: Joi.string().required().messages({
      "any.required": "Location is required",
    }),
    date: Joi.date().required().messages({
      "any.required": "Date is required",
    }),
    duration: Joi.number().required().messages({
      "any.required": "Duration is required",
    }),
  }),
};

module.exports = challengeValidationSchemas;
