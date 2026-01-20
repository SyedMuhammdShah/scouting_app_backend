const Joi = require("joi");
const HttpStatusCode = require("../utils/HttpStatusCode");

/**
 * Middleware to validate request body/params/query using Joi schema
 * @param {Object} schema - Joi schema object with body, query, params properties
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    const dataToValidate = {
      body: req.body || {},
      query: req.query || {},
      params: req.params || {},
    };

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return HttpStatusCode.validationError(
        res,
        "Validation failed",
        errors
      );
    }

    // Replace the request objects with validated data
    req.body = value.body;
    req.query = value.query;
    req.params = value.params;
    next();
  };
};

module.exports = validateRequest;
