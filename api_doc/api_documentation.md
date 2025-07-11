# API Documentation

## Base URL
```
http://localhost:3000
```

---

## User APIs

### 1. Signup
**Endpoint:**
```
POST /api/users/signup
```

**Description:**
Registers a new user.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "phone": "string"
}
```

**Response:**
- **201 Created**
  ```json
  {
    "message": "User registered successfully"
  }
  ```
- **400 Bad Request**
  ```json
  {
    "error": "All fields are required"
  }
  ```
- **400 Bad Request**
  ```json
  {
    "error": "Email already exists"
  }
  ```
- **500 Internal Server Error**
  ```json
  {
    "error": "Internal server error"
  }
  ```

---

### 2. Login
**Endpoint:**
```
POST /api/users/login
```

**Description:**
Logs in a user with valid credentials.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
- **200 OK**
  ```json
  {
    "message": "Login successful"
  }
  ```
- **400 Bad Request**
  ```json
  {
    "error": "Email and password are required"
  }
  ```
- **401 Unauthorized**
  ```json
  {
    "error": "Invalid credentials"
  }
  ```
- **500 Internal Server Error**
  ```json
  {
    "error": "Internal server error"
  }
  ```
