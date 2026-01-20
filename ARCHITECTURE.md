# Project Structure & Architecture Overview

## New Project Structure

```
scoutingbackend/
│
├── 📁 src/
│   ├── 📁 utils/
│   │   ├── 📄 HttpStatusCode.js              ⭐ NEW - Standardized HTTP responses
│   │   └── 📄 apiResponse.js                 (Legacy)
│   │
│   ├── 📁 middlewares/
│   │   ├── 📄 auth.middleware.js             ✅ UPDATED - Uses HttpStatusCode
│   │   └── 📄 validate.middleware.js         ⭐ NEW - Joi validation middleware
│   │
│   ├── 📁 models/
│   │   ├── 📄 user.model.js
│   │   ├── 📄 playerProfile.model.js
│   │   └── 📄 connection.model.js
│   │
│   ├── 📁 modules/
│   │   │
│   │   ├── 📁 auth/
│   │   │   ├── 📄 auth.validation.js         ⭐ NEW - Joi schemas
│   │   │   ├── 📄 auth.controller.js         ✅ UPDATED - Uses HttpStatusCode
│   │   │   ├── 📄 auth.routes.js             ✅ UPDATED - Validation middleware
│   │   │   └── 📄 auth.service.js            ✅ UPDATED - Joi + error handling
│   │   │
│   │   ├── 📁 profile/
│   │   │   ├── 📄 profile.validation.js      ✅ UPDATED - Now uses Joi
│   │   │   ├── 📄 profile.controller.js      ✅ UPDATED - Uses HttpStatusCode
│   │   │   ├── 📄 profile.routes.js          ✅ UPDATED - Validation middleware
│   │   │   └── 📄 profile.service.js
│   │   │
│   │   ├── 📁 connections/
│   │   │   ├── 📄 connection.validation.js   ⭐ NEW - Joi schemas
│   │   │   ├── 📄 connection.controller.js   ✅ UPDATED - Uses HttpStatusCode
│   │   │   ├── 📄 connection.routes.js       ✅ UPDATED - Validation middleware
│   │   │   └── 📄 connection.service.js
│   │   │
│   │   └── 📁 players/
│   │       ├── 📄 players.validation.js      ⭐ NEW - Joi schemas
│   │       ├── 📄 players.controller.js      ✅ UPDATED - Uses HttpStatusCode
│   │       ├── 📄 players.routes.js          ✅ UPDATED - Validation middleware
│   │       └── 📄 players.service.js
│   │
│   ├── 📄 app.js                             (No changes needed)
│   └── 📄 server.js                          (No changes needed)
│
├── 📁 config/
│   └── 📄 database.config.js
│
├── 📄 package.json                           ✅ UPDATED - Added Joi
├── 📄 .env                                   (Not shown)
├── 📄 CODE_REVIEW_REPORT.md                  (Existing)
│
└── 📄 📚 DOCUMENTATION FILES (NEW)
    ├── 📄 IMPLEMENTATION_COMPLETE.md         ⭐ Status & Summary
    ├── 📄 IMPROVEMENTS_SUMMARY.md            ⭐ Technical Details
    ├── 📄 QUICK_REFERENCE.md                 ⭐ Developer Guide
    ├── 📄 BEFORE_AND_AFTER.md                ⭐ Code Comparisons
    └── 📄 TROUBLESHOOTING.md                 ⭐ Common Issues
```

---

## Component Relationships

### Request Flow Diagram

```
REQUEST
  │
  ├─→ 🔍 Route (routes.js)
  │   │
  │   ├─→ 🛡️ Auth Middleware (auth.middleware.js)
  │   │   - Verifies JWT token
  │   │   - Returns 401 if invalid
  │   │   - Sets req.user if valid
  │   │
  │   ├─→ ✅ Validate Middleware (validate.middleware.js)
  │   │   - Validates body/params/query using Joi schema
  │   │   - Returns 422 if invalid
  │   │   - Cleans data (strips unknown fields)
  │   │
  │   └─→ 🎯 Controller (controller.js)
  │       - Calls service layer
  │       - Handles errors with try-catch
  │       - Returns response using HttpStatusCode
  │
  └─→ RESPONSE
      {
        "success": boolean,
        "statusCode": number,
        "message": "string",
        "data": object,
        "error": null
      }
```

---

## Module Architecture

### Standard Module Structure

```
module/
├── module.validation.js
│   └─→ Export Joi schema objects
│       {
│         create: Joi.object({ ... }),
│         update: Joi.object({ ... })
│       }
│
├── module.controller.js
│   └─→ Handle HTTP requests
│       - Call service methods
│       - Handle errors (try-catch)
│       - Send responses (HttpStatusCode)
│
├── module.routes.js
│   └─→ Define endpoints
│       - Use validation middleware
│       - Use auth middleware (if needed)
│       - Map to controller methods
│
└── module.service.js
    └─→ Business logic
        - Database operations
        - Data transformations
        - Error throwing
```

### Example: Auth Module

```
Authentication Flow:

1. Client sends: POST /api/auth/register
   {
     "email": "user@example.com",
     "password": "password123"
   }

2. Routes (auth.routes.js):
   - Validates body against authValidationSchemas.register
   - Calls controller.register

3. Validation Middleware:
   - Checks email format
   - Checks password length (min 6)
   - Returns 422 if invalid

4. Controller (auth.controller.js):
   - Calls service.register(req.body)
   - Catches and returns errors

5. Service (auth.service.js):
   - Validates with Joi again (defensive)
   - Checks for duplicate email
   - Hashes password
   - Creates user in DB
   - Generates JWT token

6. Response:
   {
     "success": true,
     "statusCode": 201,
     "message": "User registered successfully",
     "data": {
       "user": { ... },
       "token": "eyJh..."
     },
     "error": null
   }
```

---

## Validation Flow

### Joi Validation Pipeline

```
Request Arrives
    │
    ├─→ validateRequest(schema, "body") Middleware
    │   │
    │   ├─→ schema.validate(req.body, options)
    │   │   - abortEarly: false (get all errors)
    │   │   - stripUnknown: true (remove extra fields)
    │   │
    │   ├─→ Error? 
    │   │   └─→ Return 422 with error details
    │   │
    │   └─→ Valid?
    │       └─→ Replace req.body with validated data
    │           └─→ next() → Controller
    │
    └─→ Controller receives clean, validated data
```

### Validation Schema Example

```javascript
const Joi = require("joi");

const authValidationSchemas = {
  register: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        "string.email": "Email must be valid",
        "any.required": "Email is required"
      }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        "string.min": "Password must be 6+ chars",
        "any.required": "Password is required"
      }),
    phoneNumber: Joi.string()
      .pattern(/^[0-9\-\+\s\(\)]+$/)
      .optional(),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional()
  }),
};
```

---

## HTTP Status Codes Used

### Success Responses (2xx)

```javascript
200 OK              - Get/Fetch/Update/Delete success
    HttpStatusCode.sendOK(res, message, data)

201 Created         - Create success
    HttpStatusCode.sendCreated(res, message, data)

204 No Content      - Delete with no response body
    HttpStatusCode.sendNoContent(res)
```

### Client Error Responses (4xx)

```javascript
400 Bad Request     - Invalid input, logic error
    HttpStatusCode.sendBadRequest(res, message, error)

401 Unauthorized    - Missing/invalid token
    HttpStatusCode.sendUnauthorized(res, message, error)

403 Forbidden       - Authenticated but no permission
    HttpStatusCode.sendForbidden(res, message, error)

404 Not Found       - Resource doesn't exist
    HttpStatusCode.sendNotFound(res, message, error)

409 Conflict        - Resource already exists
    HttpStatusCode.sendConflict(res, message, error)

422 Unprocessable Entity - Validation failed
    HttpStatusCode.validationError(res, message, errors)
```

### Server Error Responses (5xx)

```javascript
500 Internal Server Error   - Unexpected error
    HttpStatusCode.sendInternalServerError(res, message, error)

503 Service Unavailable     - Database/service down
    HttpStatusCode.sendServiceUnavailable(res, message, error)
```

---

## Data Flow Examples

### Example 1: Register Endpoint

```
POST /api/auth/register
Content-Type: application/json
Body: {
  "email": "john@example.com",
  "password": "secure123"
}

    ↓

Routes (auth.routes.js)
  ├─ validateRequest(authValidationSchemas.register, "body")
  └─ controller.register

    ↓

Validate Middleware
  └─ Validates email format and password length
  └─ Returns 422 if invalid
  └─ Cleans data and passes to controller

    ↓

Controller (auth.controller.js)
  └─ try {
       result = await service.register(req.body)
       HttpStatusCode.sendCreated(res, message, result)
     } catch (error) {
       HttpStatusCode.sendBadRequest(res, error.message)
     }

    ↓

Service (auth.service.js)
  └─ Validate with Joi
  └─ Check email doesn't exist
  └─ Hash password with bcrypt
  └─ Create user in database
  └─ Generate JWT token
  └─ Return {user, token}

    ↓

Response (201 Created)
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "user": { "_id": "...", "email": "john@example.com" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "error": null
}
```

### Example 2: Protected Endpoint (Get Profile)

```
GET /api/profile/me
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIs..."
}

    ↓

Routes (profile.routes.js)
  ├─ auth (middleware)
  └─ controller.getMyProfile

    ↓

Auth Middleware (auth.middleware.js)
  └─ Extract token from header
  └─ Verify JWT signature
  └─ Decode and set req.user.id
  └─ Call next() or return 401

    ↓

Controller (profile.controller.js)
  └─ try {
       result = await service.getMyProfile(req.user.id)
       HttpStatusCode.sendOK(res, message, result)
     } catch (error) {
       HttpStatusCode.sendInternalServerError(res, message, error.message)
     }

    ↓

Service (profile.service.js)
  └─ Find user profile in database
  └─ Return profile data

    ↓

Response (200 OK)
{
  "success": true,
  "statusCode": 200,
  "message": "Profile fetched successfully",
  "data": {
    "user": { ... },
    "profile": { ... }
  },
  "error": null
}
```

### Example 3: Validation Error

```
POST /api/auth/register
Body: {
  "email": "invalid-email",
  "password": "123"
}

    ↓

Validate Middleware
  └─ schema.validate() fails
  └─ Returns 422 error response

    ↓

Response (422 Unprocessable Entity)
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

## Class Hierarchy

### HttpStatusCode Class

```
HttpStatusCode
├── Status Constants
│   ├── 200 OK
│   ├── 201 CREATED
│   ├── 204 NO_CONTENT
│   ├── 400 BAD_REQUEST
│   ├── 401 UNAUTHORIZED
│   ├── 403 FORBIDDEN
│   ├── 404 NOT_FOUND
│   ├── 409 CONFLICT
│   ├── 422 UNPROCESSABLE_ENTITY
│   ├── 500 INTERNAL_SERVER_ERROR
│   ├── 501 NOT_IMPLEMENTED
│   └── 503 SERVICE_UNAVAILABLE
│
├── Generic Methods
│   ├── success(res, statusCode, message, data)
│   ├── error(res, statusCode, message, error)
│   └── validationError(res, message, errors)
│
├── Success Methods
│   ├── sendOK(res, message, data)
│   ├── sendCreated(res, message, data)
│   └── sendNoContent(res)
│
└── Error Methods
    ├── sendBadRequest(res, message, error)
    ├── sendUnauthorized(res, message, error)
    ├── sendForbidden(res, message, error)
    ├── sendNotFound(res, message, error)
    ├── sendConflict(res, message, error)
    ├── sendInternalServerError(res, message, error)
    └── sendServiceUnavailable(res, message, error)
```

---

## Dependencies

### Production Dependencies

```json
{
  "bcryptjs": "^2.4.3"          - Password hashing
  "cors": "^2.8.5"              - Cross-origin requests
  "dotenv": "^16.3.1"           - Environment variables
  "express": "^4.18.2"          - Web framework
  "helmet": "^7.0.0"            - Security headers
  "joi": "^17.11.0"             - Input validation ⭐ NEW
  "jsonwebtoken": "^9.0.2"      - JWT authentication
  "mongoose": "^8.21.0"         - MongoDB ODM
}
```

### Development Dependencies

```json
{
  "nodemon": "^3.1.11"          - Auto-reload on file changes
}
```

---

## Deployment Checklist

### Before Deploying

- [ ] Run `npm install` to install all dependencies
- [ ] Set up `.env` file with:
  - `JWT_SECRET` - Secret key for JWT
  - `MONGODB_URI` - Database connection string
  - `PORT` - Server port (default 3000)
  - `NODE_ENV` - Set to "production"
- [ ] Test all endpoints with valid and invalid data
- [ ] Check error handling and validation
- [ ] Review TROUBLESHOOTING.md for common issues
- [ ] Ensure all TODOs are resolved
- [ ] Run security checks

### Database Requirements

- MongoDB with collections:
  - `users` - User accounts
  - `playerprofiles` - Player information
  - `connections` - Connection requests

### Scaling Considerations

- Add database indexing for frequently queried fields
- Implement caching for profile data
- Add rate limiting for API endpoints
- Consider async job queue for heavy operations

---

## Code Standards

### All Controllers Follow This Pattern
```javascript
try {
  const result = await service.method(req.data);
  HttpStatusCode.send*(res, message, result);
} catch (error) {
  HttpStatusCode.send*(res, error.message);
}
```

### All Routes Include Validation
```javascript
router.post(
  "/endpoint",
  auth,  // If needed
  validateRequest(schemas.method, "body/params/query"),
  controller.method
);
```

### All Validation Files Are Consistent
```javascript
const schemas = {
  method: Joi.object({
    field: Joi.type().validation().messages({...})
  })
};

module.exports = schemas;
```

---

## Performance Considerations

### Optimization Opportunities

1. **Caching**
   - Cache user profiles
   - Cache connection lists
   - Implement Redis if needed

2. **Database**
   - Index frequently queried fields
   - Optimize queries in service layer
   - Consider pagination for large datasets

3. **Compression**
   - Enable gzip compression
   - Compress JSON responses

4. **Async Operations**
   - Queue email notifications
   - Background job processing
   - Async file uploads

---

## Security Features Implemented

✅ Password hashing with bcryptjs
✅ JWT token authentication
✅ Input validation with Joi
✅ Unknown field stripping
✅ CORS configured
✅ Security headers with Helmet
✅ SQL injection prevention (MongoDB)
✅ XSS protection via input validation

---

## Documentation Map

| Document | Purpose | Audience |
|----------|---------|----------|
| IMPLEMENTATION_COMPLETE.md | Status & overview | Everyone |
| IMPROVEMENTS_SUMMARY.md | Technical details | Developers |
| QUICK_REFERENCE.md | How-to guide | Developers |
| BEFORE_AND_AFTER.md | Code examples | Code reviewers |
| TROUBLESHOOTING.md | Common issues | Support team |
| This file | Architecture | Architects |

---

**Architecture Version:** 1.0  
**Last Updated:** January 18, 2026  
**Status:** Complete and Production-Ready
