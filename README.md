# User Management API

## Overview
This is a Node.js-based RESTful API for user management with SQLite integration. It supports creating, retrieving, deleting, and updating users with proper validation and error handling.

## Features
- Create User (`/create_user`)
- Get Users (`/get_users`)
- Update User (`/update_user`)
- Delete User (`/delete_user`)
- SQLite Database Integration
- Validation & Error Handling
- Logging API Calls & Errors

## Database Schema
### Users Table
```sql
CREATE TABLE IF NOT EXISTS users (
    user_id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    mob_num TEXT NOT NULL,
    pan_num TEXT NOT NULL,
    manager_id TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1,
    FOREIGN KEY (manager_id) REFERENCES managers(manager_id)
);
```

### Managers Table
```sql
CREATE TABLE IF NOT EXISTS managers (
    manager_id TEXT PRIMARY KEY,
    is_active BOOLEAN DEFAULT 1
);
```

Prefill managers table with test data:
```sql
INSERT INTO managers (manager_id, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440000', 1),
('550e8400-e29b-41d4-a716-446655440001', 1);
```

## Installation & Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/user-management-api.git
   ```
2. Install dependencies:
   ```sh
   cd user-management-api
   npm install
   ```
3. Start the server:
   ```sh
   node server.js
   ```
4. Use **Postman** to test the APIs.

## API Documentation
### Create User
- **URL:** `/create_user`
- **Method:** `POST`
- **Payload:**
```json
{
  "full_name": "John Doe",
  "mob_num": "+911234567890",
  "pan_num": "ABCDE1234F",
  "manager_id": "uuid-v4"
}
```
- **Response:**
```json
{
  "message": "User created successfully",
  "user_id": "e059db6c-6a2a-44c7-adcc-4ba9d93c0021"
}
```

### Get Users
- **URL:** `/get_users`
- **Method:** `POST`
- **Payload (optional):**
```json
{
  "user_id": "uuid-v4",
  "mob_num": "1234567890",
  "manager_id": "uuid-v4"
}
```
- **Response:**
```json
{
  "users": [
    {
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "full_name": "John Doe",
      "mob_num": "9876543210",
      "pan_num": "ABCDE1234F",
      "manager_id": "550e8400-e29b-41d4-a716-446655440001",
      "created_at": "2024-03-18 10:00:00",
      "updated_at": "2024-03-18 10:00:00",
      "is_active": 1
    }
  ]
}
```

### Update User
- **URL:** `/update_user`
- **Method:** `POST`
- **Payload:**
```json
{
  "user_ids": ["uuid-v4", "uuid-v4"],
  "update_data": {
    "full_name": "Jane Doe",
    "mob_num": "0987654321",
    "pan_num": "FGHIJ6789K",
    "manager_id": "uuid-v4"
  }
}
```
- **Response:**
```json
{
  "message": "User updated successfully"
}
```

### Delete User
- **URL:** `/delete_user`
- **Method:** `POST`
- **Payload:**
```json
{
  "user_id": "uuid-v4",
  "mob_num": "1234567890"
}
```
- **Response:**
```json
{
  "message": "User deleted successfully"
}
```

## Logging
API requests and errors are logged in `server.log`.

## Error Handling & Logging
The system includes robust error handling with proper validation and logging of API calls.


