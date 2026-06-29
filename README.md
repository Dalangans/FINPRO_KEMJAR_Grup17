# IDOR Tester Web App

This project is a local web application for security testing, focused on **IDOR (Insecure Direct Object Reference)** and **SQL injection** scenarios. In the current repository, the active modules are authentication, dashboard access, and user data retrieval by `userId`; if SQL injection endpoints are added in another version, this README can be expanded in the endpoint section.

## Project Structure

- `FE/`: React + Vite frontend
- `BE/`: Node.js + Express backend

## Key Features

- Login with email and password
- Dashboard accessible only after login
- JWT-based authentication
- User profile endpoint
- User data endpoint by `userId` for IDOR testing
- Built-in seed users for easier local testing

## Technology Stack

### Frontend
- React
- React Router
- Axios
- Vite

### Backend
- Node.js
- Express
- JWT
- bcryptjs
- CORS
- dotenv

## Prerequisites

- Node.js 18+ recommended
- npm

## How to Run

### 1. Start the Backend

```bash
cd BE
npm install
npm run dev
```

The backend will run at:

```text
http://localhost:5000
```

### 2. Start the Frontend

```bash
cd FE
npm install
npm run dev
```

The Vite frontend usually runs at:

```text
http://localhost:5173
```

## Usage Flow

1. Open the frontend in your browser.
2. Log in using one of the seed accounts.
3. After successful login, the app will redirect to the dashboard.
4. The backend stores the JWT token in localStorage and uses it to access protected endpoints.
5. The `/api/auth/user/:userId` endpoint can be used to check object-level access control behavior.

## Seed Accounts

The backend automatically creates several accounts the first time the server runs.

| Username | Email | Password |
| --- | --- | --- |
| nabiel13 | nabiel13@gmail.com | password13 |
| pavel10 | pavel10@gmail.com | password10 |
| dalangmod | dalangmod@gmail.com | password1310 |

## Backend Endpoints

Base URL: `http://localhost:5000`

### Auth
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `POST /api/auth/logout`
- `GET /api/auth/user/:userId`

### Health Check
- `GET /api/health`

## Example Requests

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nabiel13@gmail.com","password":"password13"}'
```

### Get Profile

```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer <TOKEN>"
```

### Get User by ID

```bash
curl http://localhost:5000/api/auth/user/1 \
  -H "Authorization: Bearer <TOKEN>"
```

## Implementation Notes

- User data is currently stored in memory, not in a persistent database.
- JWT tokens are valid for 24 hours.
- The frontend automatically logs out after 5 minutes.
- The backend already allows the default local Vite origin on `5173`.

## Project Purpose

This project is intended as a local web security demo and testing environment, especially for practicing IDOR and SQL injection. For now, the documentation follows the features that are actually present in the source code; if SQL injection endpoints exist in another branch or module, this section can be extended directly.
