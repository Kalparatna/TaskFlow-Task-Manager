# Task Management API Documentation

## Overview
This API provides both public and authenticated endpoints for task management. The authenticated endpoints use JWT (JSON Web Token) authentication.

## Base URL
```
http://localhost:8000/api/
```

## Authentication
The API supports JWT authentication using `djangorestframework-simplejwt`.

### Authentication Endpoints

#### 1. User Registration
- **URL**: `POST /api/auth/register/`
- **Description**: Register a new user
- **Authentication**: Not required
- **Request Body**:
```json
{
    "username": "testuser",
    "email": "test@example.com",
    "password": "securepassword123",
    "password_confirm": "securepassword123"
}
```
- **Response**: 
```json
{
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
}
```

#### 2. Login (Get JWT Token)
- **URL**: `POST /api/auth/login/`
- **Description**: Login and get JWT tokens
- **Authentication**: Not required
- **Request Body**:
```json
{
    "username": "testuser",
    "password": "securepassword123"
}
```
- **Response**:
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### 3. Refresh Token
- **URL**: `POST /api/auth/refresh/`
- **Description**: Refresh access token
- **Authentication**: Not required
- **Request Body**:
```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```
- **Response**:
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

## Task Endpoints

### Public Endpoints (No Authentication Required)

#### 1. Get All Tasks
- **URL**: `GET /api/tasks/`
- **Description**: Retrieve all tasks (public)
- **Authentication**: Not required
- **Response**:
```json
[
    {
        "id": 1,
        "title": "Sample Task",
        "description": "This is a sample task",
        "completed": false,
        "created_at": "2025-08-02T16:20:00Z",
        "updated_at": "2025-08-02T16:20:00Z",
        "user": null
    }
]
```

#### 2. Create Task
- **URL**: `POST /api/tasks/`
- **Description**: Create a new task (public)
- **Authentication**: Not required
- **Request Body**:
```json
{
    "title": "New Task",
    "description": "Task description"
}
```
- **Response**:
```json
{
    "id": 2,
    "title": "New Task",
    "description": "Task description",
    "completed": false,
    "created_at": "2025-08-02T16:25:00Z",
    "updated_at": "2025-08-02T16:25:00Z",
    "user": null
}
```

#### 3. Get Task by ID
- **URL**: `GET /api/tasks/{id}/`
- **Description**: Retrieve a specific task (public)
- **Authentication**: Not required
- **Response**: Same as create task response

#### 4. Update Task
- **URL**: `PUT /api/tasks/{id}/`
- **Description**: Update a specific task (public)
- **Authentication**: Not required
- **Request Body**:
```json
{
    "title": "Updated Task",
    "description": "Updated description",
    "completed": true
}
```
- **Response**: Updated task object

#### 5. Delete Task
- **URL**: `DELETE /api/tasks/{id}/`
- **Description**: Delete a specific task (public)
- **Authentication**: Not required
- **Response**: `204 No Content`

### Authenticated Endpoints (JWT Authentication Required)

For authenticated endpoints, include the JWT token in the Authorization header:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

#### 1. Get User's Tasks
- **URL**: `GET /api/auth/tasks/`
- **Description**: Retrieve tasks belonging to authenticated user
- **Authentication**: Required (JWT)
- **Response**: Array of user's tasks

#### 2. Create User Task
- **URL**: `POST /api/auth/tasks/`
- **Description**: Create a new task for authenticated user
- **Authentication**: Required (JWT)
- **Request Body**:
```json
{
    "title": "My Private Task",
    "description": "This task belongs to me"
}
```
- **Response**: Created task with user field populated

#### 3. Get User's Task by ID
- **URL**: `GET /api/auth/tasks/{id}/`
- **Description**: Retrieve a specific task belonging to authenticated user
- **Authentication**: Required (JWT)
- **Response**: Task object (only if it belongs to the user)

#### 4. Update User's Task
- **URL**: `PUT /api/auth/tasks/{id}/`
- **Description**: Update a specific task belonging to authenticated user
- **Authentication**: Required (JWT)
- **Request Body**: Same as public update
- **Response**: Updated task object

#### 5. Delete User's Task
- **URL**: `DELETE /api/auth/tasks/{id}/`
- **Description**: Delete a specific task belonging to authenticated user
- **Authentication**: Required (JWT)
- **Response**: `204 No Content`

## Error Responses

### 400 Bad Request
```json
{
    "field_name": ["Error message"]
}
```

### 401 Unauthorized
```json
{
    "detail": "Authentication credentials were not provided."
}
```

### 404 Not Found
```json
{
    "detail": "Not found."
}
```

## Usage Examples

### Using curl

#### Register a user:
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "securepass123", "password_confirm": "securepass123"}'
```

#### Login:
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "securepass123"}'
```

#### Create a public task:
```bash
curl -X POST http://localhost:8000/api/tasks/ \
  -H "Content-Type: application/json" \
  -d '{"title": "Public Task", "description": "Anyone can see this"}'
```

#### Create an authenticated task:
```bash
curl -X POST http://localhost:8000/api/auth/tasks/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"title": "Private Task", "description": "Only I can see this"}'
```

## Security Features

1. **JWT Authentication**: Secure token-based authentication
2. **User Isolation**: Authenticated users can only access their own tasks
3. **CORS Protection**: Configured to allow specific origins
4. **Input Validation**: All inputs are validated using Django REST Framework serializers
5. **Error Handling**: Proper error responses for various scenarios

## Development Notes

- The API provides both public and authenticated endpoints for flexibility
- Public endpoints are useful for testing and demo purposes
- Authenticated endpoints provide proper user isolation and security
- JWT tokens expire after 60 minutes (configurable)
- Refresh tokens are valid for 7 days (configurable)