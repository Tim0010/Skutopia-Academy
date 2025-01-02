# Skutopia Academy API Documentation

## Authentication Endpoints

### Register User
- **URL**: `/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "userName": "string",
    "userEmail": "string",
    "password": "string",
    "role": "string"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "success": true,
    "token": "string"
  }
  ```

### Login User
- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "userEmail": "string",
    "password": "string"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "token": "string"
  }
  ```

## Course Endpoints

### Get All Courses
- **URL**: `/student/course/get`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "instructor": "string",
        "price": "number"
      }
    ]
  }
  ```

### Get Course Details
- **URL**: `/student/course/get/details/:id`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "id": "string",
      "title": "string",
      "description": "string",
      "instructor": "string",
      "price": "number",
      "modules": []
    }
  }
  ```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": ["Array of error messages"]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid token"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```
