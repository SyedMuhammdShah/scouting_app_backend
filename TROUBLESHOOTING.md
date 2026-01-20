# Troubleshooting Guide

## Installation Issues

### Issue: "Cannot find module 'joi'"
**Solution:**
```bash
npm install
```
Joi v17.11.0 has been added to package.json. Run `npm install` to install all dependencies.

---

### Issue: "HttpStatusCode is not defined"
**Solution:**
```javascript
// Add this import to your file
const HttpStatusCode = require("../../utils/HttpStatusCode");
```
Check the correct relative path from your file to `src/utils/HttpStatusCode.js`.

---

## Validation Issues

### Issue: "Validation failed" but request looks correct
**Possible Causes:**
1. ❌ Data type mismatch (string vs number)
2. ❌ Required field missing
3. ❌ Invalid format (e.g., email, URL)
4. ❌ Field value not in allowed options

**Debug Solution:**
The error response includes detailed messages:
```json
{
  "errors": [
    {
      "field": "email",
      "message": "Email must be a valid email address"
    }
  ]
}
```

Check the `field` and `message` to see exactly what's wrong.

---

### Issue: "cannot set properties of undefined" in middleware
**Cause:** Validation middleware is trying to validate when data doesn't exist.

**Solution:**
```javascript
// Make sure to specify correct source
validateRequest(schema, "body")   // for POST/PUT body
validateRequest(schema, "params") // for URL parameters /:userId
validateRequest(schema, "query")  // for query strings ?page=1
```

---

## Response Format Issues

### Issue: Getting old ApiResponse format instead of new HttpStatusCode
**Cause:** File still importing old ApiResponse class.

**Solution:**
Replace:
```javascript
// ❌ OLD
const ApiResponse = require("../../utils/apiResponse");
res.status(201).json(new ApiResponse(201, "Message", data));

// ✅ NEW
const HttpStatusCode = require("../../utils/HttpStatusCode");
HttpStatusCode.sendCreated(res, "Message", data);
```

---

### Issue: Response has extra fields or different structure
**Cause:** Mixing old and new response methods.

**Standard Response Structure:**
```json
{
  "success": boolean,
  "statusCode": number,
  "message": "string",
  "data": object/array,
  "error": object/null,
  "errors": array (only for validation errors)
}
```

---

## Authentication Issues

### Issue: "Unauthorized: No token provided"
**Cause:** Missing Authorization header.

**Solution:**
Add to your request:
```
Authorization: Bearer <your_jwt_token>
```

Example with curl:
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  http://localhost:3000/api/profile/me
```

---

### Issue: "Invalid or expired token"
**Causes:**
1. ❌ Token is malformed
2. ❌ Token has expired
3. ❌ JWT_SECRET doesn't match

**Solutions:**
1. Get a fresh token by logging in again
2. Check `.env` file has correct `JWT_SECRET`
3. Verify token format: `Bearer <token>` (with space)

---

## Database Issues

### Issue: "Email already exists" when registering new user
**Cause:** Email is already in database from previous registration.

**Solution:**
1. Use a different email address for testing
2. Or clear the database and start fresh

**For Development:**
```javascript
// In MongoDB shell or similar
db.users.deleteMany({ email: "test@example.com" })
```

---

## Common Error Messages

### "Email must be a valid email address"
**Fix:** Use format: `user@example.com`

### "Password must be at least 6 characters long"
**Fix:** Password needs 6+ characters

### "Preferred foot must be Left, Right, or Both"
**Fix:** Only accept these exact values (case-sensitive)

### "User ID is required"
**Fix:** Include userId in URL parameters: `/api/connections/request/USER_ID_HERE`

### "Image URL must be a valid URL"
**Fix:** Use valid URL: `https://example.com/image.jpg`

---

## Middleware Order Issues

### Issue: Validation error but message says "Unauthorized"
**Cause:** Wrong middleware order in routes.

**Correct Order:**
```javascript
// ✅ CORRECT: Auth → Validate → Controller
router.post(
  "/endpoint",
  auth,                                    // 1. Check token
  validateRequest(schema, "body"),         // 2. Validate data
  controller.method                        // 3. Handle request
);

// ❌ WRONG: Validate → Auth
router.post(
  "/endpoint",
  validateRequest(schema, "body"),
  auth,
  controller.method
);
```

---

## File Path Issues

### Issue: "Cannot find module" for validation schemas
**Cause:** Wrong relative path.

**Correct Paths:**

From `auth.routes.js`:
```javascript
const schema = require("./auth.validation");      // ✅ Same folder
```

From `auth.controller.js`:
const schema = require("./auth.validation");      // ✅ Same folder
```

From `app.js`:
```javascript
const schema = require("./modules/auth/auth.validation");  // ✅ Relative path
```

**Path Debugging:**
- Count `../` to go up folders
- Then navigate down: `./folder/file`
- Use absolute paths as fallback: `require("src/modules/auth/auth.validation")`

---

## Development Workflow

### Adding New Endpoint

#### Step 1: Create Validation Schema
File: `module.validation.js`
```javascript
const Joi = require("joi");

const schemas = {
  create: Joi.object({
    field: Joi.string().required(),
  }),
};

module.exports = schemas;
```

#### Step 2: Create Controller
File: `module.controller.js`
```javascript
const HttpStatusCode = require("../../utils/HttpStatusCode");
const service = require("./module.service");

exports.create = async (req, res) => {
  try {
    const result = await service.create(req.body);
    HttpStatusCode.sendCreated(res, "Created successfully", result);
  } catch (error) {
    HttpStatusCode.sendBadRequest(res, error.message);
  }
};
```

#### Step 3: Update Routes
File: `module.routes.js`
```javascript
const validateRequest = require("../../middlewares/validate.middleware");
const schemas = require("./module.validation");

router.post(
  "/endpoint",
  auth,
  validateRequest(schemas.create, "body"),
  controller.create
);
```

#### Step 4: Test with curl
```bash
curl -X POST http://localhost:3000/api/module/endpoint \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"field": "value"}'
```

---

## Performance Issues

### Issue: Validation is slow
**Solution:** Joi is fast by default. If slow:
1. Check network latency
2. Verify database queries aren't blocking validation
3. Use `abortEarly: false` to catch all errors at once

---

### Issue: API response is slow
**Likely Causes:**
1. ❌ Database queries in controller (should be in service)
2. ❌ Missing database indexes
3. ❌ Large data responses

**Solutions:**
1. Move logic to service layer
2. Add database indexes for frequently queried fields
3. Implement pagination for large datasets

---

## Security Issues

### Issue: Validation allows unexpected fields
**Solution:**
```javascript
const { error, value } = schema.validate(data, {
  stripUnknown: true,  // ✅ Add this to remove unknown fields
});
```

This is already implemented in the validation middleware.

---

### Issue: Password is being logged
**Solution:**
```javascript
// ❌ DON'T DO THIS
console.log(req.body);  // Logs password!

// ✅ DO THIS
console.log(req.body.email);  // Only log what you need
```

---

## Testing Checklist

- [ ] Can register with valid email and password
- [ ] Cannot register with invalid email
- [ ] Cannot register with short password (< 6 chars)
- [ ] Cannot register with duplicate email
- [ ] Can login with email
- [ ] Can login with phone number
- [ ] Can get profile with valid token
- [ ] Cannot get profile without token
- [ ] Cannot get profile with invalid token
- [ ] Can update profile with valid data
- [ ] Cannot update profile with invalid data
- [ ] Can send connection request
- [ ] Cannot send request without valid userId
- [ ] Can upload image with valid URL
- [ ] Cannot upload image with invalid URL
- [ ] Can fetch players with filters
- [ ] Can fetch single player profile

---

## Getting Help

### Check These Files for Examples:

1. **QUICK_REFERENCE.md** - Quick lookup for common patterns
2. **IMPROVEMENTS_SUMMARY.md** - Detailed overview of all changes
3. **BEFORE_AND_AFTER.md** - Side-by-side comparisons
4. **Actual module files:**
   - `src/modules/auth/` - Complete auth example
   - `src/modules/profile/` - Profile example with media
   - `src/modules/connections/` - Connection requests example

### Common Patterns to Follow:

```javascript
// CONTROLLER PATTERN
try {
  const result = await service.method(req.body);
  HttpStatusCode.sendOK(res, "Success", result);
} catch (error) {
  HttpStatusCode.sendBadRequest(res, error.message);
}

// ROUTE PATTERN
router.post(
  "/endpoint",
  auth,
  validateRequest(schemas.method, "body"),
  controller.method
);

// VALIDATION PATTERN
const schemas = {
  method: Joi.object({
    field: Joi.string().required(),
  }),
};
```

---

## Debugging Tips

### Enable detailed error logging:
```javascript
catch (error) {
  console.error("Detailed error:", error);
  console.error("Error message:", error.message);
  console.error("Stack:", error.stack);
  HttpStatusCode.sendBadRequest(res, error.message);
}
```

### Check request/response:
```javascript
console.log("Request body:", req.body);
console.log("Request params:", req.params);
console.log("Request query:", req.query);
```

### Verify middleware execution:
```javascript
const validateRequest = (schema, source = "body") => {
  return (req, res, next) => {
    console.log(`Validating ${source}:`, req[source]);
    // ... rest of validation
  };
};
```

---

## Quick Solutions Index

| Issue | File | Solution |
|-------|------|----------|
| "Cannot find module 'joi'" | Any | Run `npm install` |
| Validation error | Check response | Read error messages |
| "Unauthorized" | Routes | Add `auth` middleware |
| Response format wrong | Controller | Use `HttpStatusCode` |
| Path not found | Routes | Check middleware order |
| Validation not working | Routes | Add `validateRequest()` |
| Email duplicate error | Database | Use different email |
| Token invalid | Headers | Include Bearer token |
| Field not validated | Schema | Add to `.validation.js` |
| Wrong status code | Controller | Use correct `HttpStatusCode.send*()` |

---

Still having issues? Follow these steps:

1. ✅ Check the error message carefully
2. ✅ Search this guide for the error
3. ✅ Check QUICK_REFERENCE.md for patterns
4. ✅ Compare with similar working endpoints
5. ✅ Verify imports and file paths
6. ✅ Check middleware order
7. ✅ Verify validation schema matches data
