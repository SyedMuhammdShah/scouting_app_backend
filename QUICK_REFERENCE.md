# Quick Reference Guide

## Using HttpStatusCode in Controllers

### Success Responses
```javascript
// 200 OK - Get/Fetch
HttpStatusCode.sendOK(res, "Data fetched successfully", data);

// 201 Created - Create operations
HttpStatusCode.sendCreated(res, "Resource created", data);

// 204 No Content - Delete operations
HttpStatusCode.sendNoContent(res);
```

### Error Responses
```javascript
// 400 Bad Request
HttpStatusCode.sendBadRequest(res, "Invalid input");

// 401 Unauthorized
HttpStatusCode.sendUnauthorized(res, "Invalid token");

// 403 Forbidden
HttpStatusCode.sendForbidden(res, "Access denied");

// 404 Not Found
HttpStatusCode.sendNotFound(res, "Resource not found");

// 409 Conflict
HttpStatusCode.sendConflict(res, "Resource already exists");

// 500 Internal Server Error
HttpStatusCode.sendInternalServerError(res, "Something went wrong");
```

### Validation Error (Auto-handled by middleware)
Automatically returns 422 with detailed error messages.

---

## Creating Validation Schemas

### Step 1: Create validation file
Create `moduleName.validation.js` in the module folder:

```javascript
const Joi = require("joi");

const validationSchemas = {
  create: Joi.object({
    field1: Joi.string().required(),
    field2: Joi.number().positive().optional(),
  }),
};

module.exports = validationSchemas;
```

### Step 2: Use in routes
```javascript
const validateRequest = require("../../middlewares/validate.middleware");

router.post(
  "/endpoint",
  validateRequest(validationSchemas.create, "body"),
  controller.create
);
```

### Step 3: Access validated data in controller
```javascript
exports.create = async (req, res) => {
  try {
    // req.body is already validated
    const result = await service.create(req.body);
    HttpStatusCode.sendCreated(res, "Created", result);
  } catch (error) {
    HttpStatusCode.sendBadRequest(res, error.message);
  }
};
```

---

## Common Joi Validators

```javascript
// String
Joi.string().required()
Joi.string().email().required()
Joi.string().min(6).max(20)
Joi.string().pattern(/regex/).required()
Joi.string().valid("option1", "option2")

// Number
Joi.number().positive()
Joi.number().min(1).max(100)
Joi.number().integer()

// Date
Joi.date().required()
Joi.date().less("now") // past dates

// URI
Joi.string().uri().required()

// Optional
Joi.string().optional()

// Custom messages
.messages({
  "string.email": "Must be a valid email",
  "any.required": "This field is required"
})
```

---

## Validation Sources

```javascript
// Body validation
validateRequest(schema, "body")

// Query parameters
validateRequest(schema, "query")

// Path parameters
validateRequest(schema, "params")
```

---

## Controller Pattern

```javascript
const service = require("./module.service");
const HttpStatusCode = require("../../utils/HttpStatusCode");

exports.methodName = async (req, res) => {
  try {
    const result = await service.methodName(req.body);
    HttpStatusCode.sendOK(res, "Success message", result);
  } catch (error) {
    HttpStatusCode.sendBadRequest(res, error.message);
  }
};
```

---

## Routes Pattern

```javascript
const router = require("express").Router();
const controller = require("./module.controller");
const auth = require("../../middlewares/auth.middleware");
const validateRequest = require("../../middlewares/validate.middleware");
const schemas = require("./module.validation");

router.post(
  "/endpoint",
  auth,
  validateRequest(schemas.create, "body"),
  controller.create
);

module.exports = router;
```

---

## Testing Endpoints

### With Valid Data
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### With Invalid Data
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "123"
  }'
```

### Response (Success)
```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "token": "..."
  }
}
```

### Response (Validation Error)
```json
{
  "success": false,
  "statusCode": 422,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email must be a valid email address"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters long"
    }
  ]
}
```

---

## File Structure

```
src/
├── utils/
│   ├── HttpStatusCode.js          ← Use for responses
│   └── apiResponse.js              ← (Legacy, keep for compatibility)
├── middlewares/
│   ├── auth.middleware.js
│   ├── validate.middleware.js      ← Use for validation
├── modules/
│   ├── auth/
│   │   ├── auth.validation.js      ← Joi schemas
│   │   ├── auth.controller.js
│   │   ├── auth.routes.js
│   │   └── auth.service.js
│   ├── profile/
│   │   ├── profile.validation.js
│   │   ├── profile.controller.js
│   │   ├── profile.routes.js
│   │   └── profile.service.js
│   ├── connections/
│   │   ├── connection.validation.js
│   │   ├── connection.controller.js
│   │   ├── connection.routes.js
│   │   └── connection.service.js
│   └── players/
│       ├── players.validation.js
│       ├── players.controller.js
│       ├── players.routes.js
│       └── players.service.js
```

---

## Common Errors & Solutions

### Error: "Validation failed"
- Check request body matches schema
- Ensure required fields are present
- Verify data types (string vs number)

### Error: "Unauthorized"
- Include Authorization header: `Bearer <token>`
- Ensure token is valid and not expired

### Error: "Invalid email format"
- Use valid email: `user@example.com`
- Check Joi validation messages for specifics

### 404 Not Found
- Verify resource exists in database
- Check the ID format and value

---

## Tips & Best Practices

1. **Always validate input** using middleware
2. **Use try-catch** in all async controllers
3. **Provide meaningful error messages** for debugging
4. **Use appropriate status codes** for different scenarios
5. **Validate parameters and query strings** too
6. **Keep validation schemas in separate files**
7. **Use consistent response format** across all endpoints
8. **Log errors** for debugging (future improvement)
9. **Test validation** with invalid data
10. **Document** your API endpoints with examples

---

## Need to Add More Endpoints?

1. Create `.validation.js` file with Joi schemas
2. Create controller method with try-catch
3. Use `HttpStatusCode.sendOK()` or appropriate method
4. Add route with validation middleware
5. Test with valid and invalid data

That's it! Follow the same pattern throughout the application.
