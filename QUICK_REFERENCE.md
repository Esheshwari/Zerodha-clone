# Quick Reference - Authentication Implementation

## 1. Backend API Endpoints

### Signup
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "confirmPassword": "password123"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Verify Token
```bash
GET /api/auth/verify
Authorization: Bearer <token>
```

### Get Current User
```bash
GET /api/auth/me
Authorization: Bearer <token>
```

## 2. Using Auth Context in Components

```javascript
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, login, signup, logout } = useContext(AuthContext);
  
  // Your component code here
}
```

## 3. Login Example
```javascript
const { login } = useContext(AuthContext);

const handleLogin = async () => {
  try {
    await login("user@example.com", "password123");
    navigate("/dashboard");
  } catch (error) {
    console.error("Login failed:", error);
  }
};
```

## 4. Signup Example
```javascript
const { signup } = useContext(AuthContext);

const handleSignup = async () => {
  try {
    await signup(
      "user@example.com",
      "username",
      "password123",
      "password123"
    );
    navigate("/dashboard");
  } catch (error) {
    console.error("Signup failed:", error);
  }
};
```

## 5. Protected API Calls
```javascript
const token = localStorage.getItem("token");

fetch("http://localhost:3002/allHoldings", {
  method: "GET",
  headers: {
    "Authorization": `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

## 6. Protected Route Example
```javascript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

## 7. User State Access
```javascript
const { user, isAuthenticated, loading } = useContext(AuthContext);

if (loading) return <div>Loading...</div>;

if (isAuthenticated) {
  return <p>Welcome, {user.username}!</p>;
} else {
  return <p>Please log in</p>;
}
```

## 8. Adding New Protected Endpoint

### Backend (index.js)
```javascript
const { verifyToken } = require("./middleware/authMiddleware");

app.get("/api/protected-endpoint", verifyToken, async (req, res) => {
  // req.userId contains the authenticated user's ID
  // Your endpoint logic here
  res.json({ message: "This is protected!" });
});
```

### Frontend
```javascript
const token = localStorage.getItem("token");

fetch("http://localhost:3002/api/protected-endpoint", {
  headers: {
    "Authorization": `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

## 9. Check if User is Authenticated
```javascript
const { isAuthenticated } = useContext(AuthContext);

if (isAuthenticated) {
  // Show authenticated content
} else {
  // Show login/signup prompts
}
```

## 10. Logout
```javascript
const { logout } = useContext(AuthContext);

const handleLogout = () => {
  logout();
  navigate("/");
};
```

## Environment Variables (.env)

Backend `.env`:
```
MONGO_URL=mongodb://localhost:27017/zerodha
JWT_SECRET=your_super_secret_key_change_this
PORT=3002
```

## Important Notes

1. **Never commit `.env` file** - Add to `.gitignore`
2. **Change JWT_SECRET** - Use a strong random string in production
3. **Use HTTPS** - Always in production
4. **Token Storage** - Currently in localStorage (consider using httpOnly cookies for production)
5. **CORS** - Configured for localhost, adjust for production domains

## Debugging

### Check Token in Browser
```javascript
console.log(localStorage.getItem("token"));
```

### Decode JWT Token
```javascript
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

const token = localStorage.getItem("token");
console.log(parseJwt(token));
```

### Check User in Context
```javascript
const { user, isAuthenticated, loading } = useContext(AuthContext);
console.log({ user, isAuthenticated, loading });
```
