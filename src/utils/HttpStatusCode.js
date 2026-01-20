/**
 * Utility class for standardized HTTP responses
 * Provides consistent status codes, messages, and response formatting
 */
class HttpStatusCode {
  // Success Responses (2xx)
  static OK = 200;
  static CREATED = 201;
  static ACCEPTED = 202;
  static NO_CONTENT = 204;

  // Client Error Responses (4xx)
  static BAD_REQUEST = 400;
  static UNAUTHORIZED = 401;
  static FORBIDDEN = 403;
  static NOT_FOUND = 404;
  static CONFLICT = 409;
  static UNPROCESSABLE_ENTITY = 422;

  // Server Error Responses (5xx)
  static INTERNAL_SERVER_ERROR = 500;
  static NOT_IMPLEMENTED = 501;
  static SERVICE_UNAVAILABLE = 503;

  /**
   * Send a standardized success response
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Response message
   * @param {*} data - Response data (default: null)
   */
  static success(res, statusCode = this.OK, message = "Success", data = null) {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data: data || {},
    });
  }

  /**
   * Send a standardized error response
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {*} error - Error details (default: null)
   */
  static error(res, statusCode = this.INTERNAL_SERVER_ERROR, message = "Internal Server Error", error = null) {
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      error: error || null,
    });
  }

  /**
   * Send a validation error response
   * @param {Object} res - Express response object
   * @param {string} message - Validation error message
   * @param {Array} errors - Array of validation errors
   */
  static validationError(res, message = "Validation Failed", errors = []) {
    return res.status(this.UNPROCESSABLE_ENTITY).json({
      success: false,
      statusCode: this.UNPROCESSABLE_ENTITY,
      message,
      errors: errors || [],
    });
  }

  /**
   * Predefined success responses
   */
  static sendOK(res, message = "Success", data = null) {
    return this.success(res, this.OK, message, data);
  }

  static sendCreated(res, message = "Resource created successfully", data = null) {
    return this.success(res, this.CREATED, message, data);
  }

  static sendNoContent(res) {
    return res.status(this.NO_CONTENT).send();
  }

  /**
   * Predefined error responses
   */
  static sendBadRequest(res, message = "Bad Request", error = null) {
    return this.error(res, this.BAD_REQUEST, message, error);
  }

  static sendUnauthorized(res, message = "Unauthorized", error = null) {
    return this.error(res, this.UNAUTHORIZED, message, error);
  }

  static sendForbidden(res, message = "Forbidden", error = null) {
    return this.error(res, this.FORBIDDEN, message, error);
  }

  static sendNotFound(res, message = "Resource not found", error = null) {
    return this.error(res, this.NOT_FOUND, message, error);
  }

  static sendConflict(res, message = "Resource already exists", error = null) {
    return this.error(res, this.CONFLICT, message, error);
  }

  static sendInternalServerError(res, message = "Internal Server Error", error = null) {
    return this.error(res, this.INTERNAL_SERVER_ERROR, message, error);
  }

  static sendServiceUnavailable(res, message = "Service Unavailable", error = null) {
    return this.error(res, this.SERVICE_UNAVAILABLE, message, error);
  }
}

module.exports = HttpStatusCode;
