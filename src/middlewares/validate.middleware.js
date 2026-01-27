const Joi = require("joi");
const HttpStatusCode = require("../utils/HttpStatusCode");

/**
 * Middleware to validate request body/params/query using Joi schema
 * @param {Object} schema - Joi schema object with body, query, params properties
 */
const validateRequest = (schema, property) => {
  return (req, res, next) => {
    // If a property is specified (e.g., 'body', 'query', 'params'), 
    // validate just that property against the schema.
    const dataToValidate = property ? req[property] : {
      body: req.body || {},
      query: req.query || {},
      params: req.params || {},
    };

    console.log("--- Validation Debug ---");
    console.log("Method:", req.method);
    console.log("URL:", req.originalUrl);
    console.log("Content-Type:", req.headers["content-type"]);
    console.log("Found body keys:", Object.keys(req.body || {}));
    console.log("Found query keys:", Object.keys(req.query || {}));
    console.log("Validated Data Structure:", JSON.stringify(dataToValidate, null, 2));
    console.log("------------------------");

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

    // Replace the request object(s) with validated data
    if (property) {
      req[property] = value;
    } else {
      req.body = value.body || {};
      req.query = value.query || {};
      req.params = value.params || {};
    }

    next();
  };
};

module.exports = validateRequest;
