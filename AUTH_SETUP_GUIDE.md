# Zerodha App - Authentication & Authorization Setup Guide

## Overview
Authentication and authorization have been successfully integrated into your Zerodha trading app. This system uses JWT (JSON Web Tokens) for secure API authentication.

## What's Been Added

### Backend Changes

1. **Authentication Middleware** (`backend/middleware/authMiddleware.js`)
   - Verifies JWT tokens
   - Protects API endpoints

2. **Authentication Routes** (`backend/routes/authRoutes.js`)
   - `POST /api/auth/signup` - Register new users
   - `POST /api/auth/login` - Login users
   - `GET /api/auth/verify` - Verify token validity
   - `GET /api/auth/me` - Get current user info

3. **Protected Endpoints**
   - `/allHoldings` - Requires authentication
   - `/allPositions` - Requires authentication
   - `/newOrder` - Requires authentication

4. **Updated Dependencies**
   - Added `jsonwebtoken` for JWT handling
   - Added `bcryptjs` for password hashing

### Frontend Changes

1. **Authentication Context** (`frontend/src/context/AuthContext.js`)
   - Manages global authentication state
   - Handles login, signup, and logout
   - Persists token in localStorage

2. **Protected Route Component** (`frontend/src/components/ProtectedRoute.js`)
   - Restricts access to authenticated users only
   - Redirects to login if unauthorized

3. **Login Page** (`frontend/src/Landing_page/Login/Login.js`)
   - Email and password login form
   - Error handling and loading states
   - Redirects to dashboard on success

4. **Updated Signup** (`frontend/src/Landing_page/Signup/Signup.js`)
   - Email, username, password registration
   - Password confirmation validation
   - Integrated with Auth context

5. **Updated Navbar** (`frontend/src/Landing_page/Navbar.js`)
   - Shows login/signup links for guests
   - Shows welcome message and logout for authenticated users
   - Dynamic navigation based on auth state

## Installation & Setup

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:
```
MONGO_URL=mongodb://localhost:27017/zerodha
JWT_SECRET=your_secret_key_here
PORT=3002
```

Start the backend:
```bash
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
```

No additional environment setup needed. The frontend will use `http://localhost:3002` as the API URL.

Start the frontend:
```bash
npm start
```

### Dashboard Setup
```bash
cd dashboard
npm install
npm start
```

## Usage Flow

### 1. New User Registration
- Navigate to `/signup`
- Enter email, username, password, and confirm password
- Submit to create account
- Automatically logged in and redirected to dashboard

### 2. Existing User Login
- Navigate to `/login`
- Enter email and password
- Submit to login
- Redirected to dashboard on success

### 3. Protected Routes
- Dashboard routes are now protected
- Unauthenticated users are redirected to `/login`
- Token is validated on app load

### 4. Logout
- Click "Logout" in the navbar
- Token is cleared from localStorage
- Redirected to home page

## API Authentication

All protected endpoints require the JWT token in the Authorization header:

```bash
Authorization: Bearer <token>
```

### Example Request:
```javascript
const token = localStorage.getItem("token");
fetch("http://localhost:3002/allHoldings", {
  headers: {
    "Authorization": `Bearer ${token}`
  }
})
```

## Token Details

- **Expiration**: 7 days
- **Storage**: localStorage (as `token`)
- **Format**: Bearer token
- **Verified**: On app load and before API calls

## Security Features

1. **Password Hashing**: Passwords are hashed with bcryptjs (salt rounds: 12)
2. **JWT Verification**: Tokens are cryptographically signed and verified
3. **Protected Endpoints**: API endpoints require valid JWT tokens
4. **Unique Constraints**: Email and username must be unique
5. **Token Expiration**: Tokens expire after 7 days

## File Structure

```
backend/
├── middleware/
│   └── authMiddleware.js         (JWT verification)
├── routes/
│   └── authRoutes.js             (Auth endpoints)
├── model/
│   └── UserModel.js              (User schema with password hashing)
└── index.js                       (Main server with protected routes)

frontend/
├── src/
│   ├── context/
│   │   └── AuthContext.js        (Auth state management)
│   ├── components/
│   │   └── ProtectedRoute.js     (Route protection)
│   ├── Landing_page/
│   │   ├── Login/
│   │   │   ├── Login.js
│   │   │   └── Login.css
│   │   ├── Signup/
│   │   │   ├── Signup.js
│   │   │   └── Signup.css
│   │   └── Navbar.js             (Updated with auth)
│   └── index.js                  (Updated with AuthProvider)

dashboard/
└── src/
    └── index.js                  (Updated with ProtectedRoute)
```

## Testing

### Test User Account
Create a test user by signing up with:
- Email: `test@example.com`
- Username: `testuser`
- Password: `password123`

### Test Login
Use the created account credentials to log in.

### Test Protected Endpoints
After login, the dashboard will load and fetch data from protected endpoints.

## Customization

### Change JWT Secret
Update `process.env.JWT_SECRET` in `authRoutes.js` and `authMiddleware.js`

### Change Token Expiration
Update `expiresIn: "7d"` in `authRoutes.js` to desired duration

### Customize Auth UI
Modify Login.css and Signup.css for styling changes

## Troubleshooting

### Port Already in Use
If port 3000 or 3002 is in use:
```bash
# Kill process on Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Token Expired
- Clear localStorage and log in again
- Or wait for automatic token refresh on next login

### CORS Issues
Ensure backend has CORS enabled (already configured in index.js)

### Database Connection
Verify MongoDB connection string in `.env` file

## Next Steps

1. Add password reset functionality
2. Implement refresh tokens for better security
3. Add role-based authorization (admin, user, etc.)
4. Add email verification for new accounts
5. Implement OAuth (Google, GitHub login)
6. Add two-factor authentication (2FA)

## Support

For issues or questions, refer to the implementation files or check the error messages in browser console and server logs.
