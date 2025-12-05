# Auth Backend

A Node.js Express backend with SQL database for user authentication including login and register features.

## Features

- User registration with validation
- User login with JWT authentication
- Password hashing with bcryptjs
- SQL database integration
- Input validation
- Protected routes

## Prerequisites

- Node.js (v14 or higher)
- MySQL database
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your configuration:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=auth_db
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Create the database and users table:
```sql
CREATE DATABASE auth_db;

USE auth_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Register
- **POST** `/api/auth/register`
- **Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "passwordConfirm": "Password123"
}
```

### Login
- **POST** `/api/auth/login`
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```
- **Response:**
```json
{
  "message": "User logged in successfully",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

## Project Structure

```
├── config/
│   └── db.js              # Database configuration
├── controllers/
│   └── authController.js  # Authentication logic
├── middleware/
│   ├── auth.js            # JWT verification
│   └── validation.js      # Input validation
├── routes/
│   └── auth.js            # Auth routes
├── .env                   # Environment variables
├── server.js              # Main application file
└── package.json           # Dependencies
```
