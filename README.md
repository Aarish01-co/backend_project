# Authentication & Product CRUD Application

Full-stack e-commerce REST API and frontend application built with Node.js, Express, MongoDB, express-validator, and React.

## Features

### Authentication Module
- `POST /api/auth/register`: Create user with bcrypt password hashing (min 10 salt rounds) and duplicate email check (409 Conflict).
- `POST /api/auth/login`: Issue short-lived JWT access token (15 mins) and long-lived httpOnly refresh token cookie (7 days). Generic 401 response on invalid credentials.
- `POST /api/auth/refresh-token`: Issue new access token using httpOnly cookie refresh token verified against database record.
- `POST /api/auth/logout`: Revoke refresh token from database and clear httpOnly cookie.
- `GET /api/auth/me`: Fetch authenticated user profile.

### Product Module
- `POST /api/products`: Create product (Protected).
- `GET /api/products`: List all products with optional search and category filter (Public).
- `GET /api/products/:id`: Get product details by ID (Public).
- `PUT /api/products/:id`: Update product by ID (Protected).
- `DELETE /api/products/:id`: Delete product by ID (Protected).

### Validation
- All inputs validated using `express-validator`. Returns field-level 400 error responses before entering controller logic.

## Setup Instructions

### 1. Backend Server Setup
```bash
cd server
npm install
npm run dev
```

Server environment configuration is stored in `server/.env`:
- `PORT=5000`
- `MONGO_URI`
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_SECRET`

### 2. Frontend Client Setup
```bash
cd client
npm install
npm run dev
```
Client runs on `http://localhost:5173`.
