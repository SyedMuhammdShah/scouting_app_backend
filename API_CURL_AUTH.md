# Authentication API CURL Commands

**Base URL:** `http://localhost:5000/api/auth`

---

## 1. Register U

**Endpoint:** `POST /api/auth/register`

**Description:** Create a new user account

### CURL Command:  

```bash
curl --location 'http://localhost:5000/api/auth/register' \
--header 'Content-Type: application/json' \
--data-raw '{
  "username": "johndoe123",
  "email": "john@example.com",
  "password": "StrongPassword123",
  "fullName": "John Doe",
  "phoneNumber": "+1-234-567-8900"
}'
```

### Required Fields:
- `username` (string, 3-30 alphanumeric characters only) ✅ **REQUIRED**
- `email` (string, valid email format) ✅ **REQUIRED**
- `password` (string, minimum 6 characters) ✅ **REQUIRED**

### Optional Fields:
- `fullName` (string)
- `phoneNumber` (string, digits and special characters: +, -, (, ), space)

### Success Response (201 Created):
```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "67a9b5c3d4e5f6g7h8i9j0k1",
      "username": "johndoe123",
      "email": "john@example.com",
      "fullName": "John Doe",
      "phoneNumber": "+1-234-567-8900",
      "createdAt": "2026-01-19T10:30:45.123Z",
      "updatedAt": "2026-01-19T10:30:45.123Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YTliNWMzZDRlNWY2ZzdoOGk5ajBrMSIsImlhdCI6MTczNzI3NjY0NX0.abc..."
  }
}
```

### Error Responses:

**400 Bad Request - Username already exists:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Username \"johndoe123\" already exists",
  "error": null
}
```

**400 Bad Request - Email already exists:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Email \"john@example.com\" already exists",
  "error": null
}
```

**400 Bad Request - Validation Error:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "error": [
    {
      "field": "body.username",
      "message": "Username must contain only alphanumeric characters"
    },
    {
      "field": "body.password",
      "message": "Password must be at least 6 characters long"
    }
  ]
}
```

---

## 2. Login User

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate user and get JWT token

### CURL Command:

```bash
curl --location 'http://localhost:5000/api/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
  "identifier": "john@example.com",
  "password": "StrongPassword123"
}'
```

### Alternative CURL (using phone number):

```bash
curl --location 'http://localhost:5000/api/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
  "identifier": "+1-234-567-8900",
  "password": "StrongPassword123"
}'
```

### Required Fields:
- `identifier` (string, either email or phone number) ✅ **REQUIRED**
- `password` (string) ✅ **REQUIRED**

### Success Response (200 OK):
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "67a9b5c3d4e5f6g7h8i9j0k1",
      "username": "johndoe123",
      "email": "john@example.com",
      "fullName": "John Doe",
      "phoneNumber": "+1-234-567-8900",
      "createdAt": "2026-01-19T10:30:45.123Z",
      "updatedAt": "2026-01-19T10:30:45.123Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YTliNWMzZDRlNWY2ZzdoOGk5ajBrMSIsImlhdCI6MTczNzI3NjY0NX0.abc..."
  }
}
```

### Error Responses:

**400/401 Bad Request - Invalid credentials:**
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": null
}
```

**400 Bad Request - Validation Error:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "error": [
    {
      "field": "body.identifier",
      "message": "Invalid email or phone number format"
    }
  ]
}
```

---

## 3. Using Token for Protected Routes

After successful login/register, use the returned token in Authorization header:

### CURL Template for Protected Endpoints:

```bash
curl --location 'http://localhost:5000/api/profile/me' \
--header 'Authorization: Bearer <YOUR_JWT_TOKEN_HERE>' \
--header 'Content-Type: application/json'
```

### Example with actual token:

```bash
curl --location 'http://localhost:5000/api/profile/me' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YTliNWMzZDRlNWY2ZzdoOGk5ajBrMSIsImlhdCI6MTczNzI3NjY0NX0.abc...' \
--header 'Content-Type: application/json'
```

---

## Testing Checklist

✅ **Happy Path:**
- [ ] Register with valid unique username, email, password
- [ ] Login with email identifier
- [ ] Login with phone number identifier
- [ ] Verify JWT token is returned

❌ **Error Cases:**
- [ ] Register with duplicate username
- [ ] Register with duplicate email
- [ ] Register with invalid email format
- [ ] Register with password < 6 characters
- [ ] Register with username containing special characters
- [ ] Login with wrong password
- [ ] Login with non-existent user
- [ ] Login with invalid email/phone format

---

## Notes

1. **Username Rules:**
   - Must be alphanumeric only (no spaces, special characters)
   - 3-30 characters long
   - Must be unique

2. **Email Rules:**
   - Must be valid email format
   - Must be unique
   - Case-insensitive duplicate check

3. **Password Rules:**
   - Minimum 6 characters
   - Will be hashed with bcrypt before storage

4. **Phone Number Rules:**
   - Optional field
   - Can contain digits, +, -, (, ), space
   - Must be unique if provided

5. **JWT Token:**
   - Valid for the entire session
   - Used in Authorization header as Bearer token
   - Include in all protected route requests
