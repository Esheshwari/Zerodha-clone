# Authentication Architecture

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER INTERACTIONS                          │
└─────────────────────────────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
    ┌───────┐  ┌───────┐  ┌────────┐
    │ Login │  │Signup │  │ Home   │
    └───────┘  └───────┘  └────────┘
        │           │          │
        └───────────┼──────────┘
                    │
                    ▼
        ┌─────────────────────┐
        │  AuthContext Store  │
        │ - User info         │
        │ - Token             │
        │ - isAuthenticated   │
        └─────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
    ┌──────────┐          ┌────────────┐
    │Dashboard │          │Protected   │
    │(Protected)          │Routes      │
    └──────────┘          └────────────┘
        │                       │
        └───────────┬───────────┘
                    │
                    ▼
        ┌─────────────────────┐
        │  Token in Headers   │
        │ Authorization:      │
        │ Bearer <token>      │
        └─────────────────────┘
                    │
                    ▼
        ┌─────────────────────┐
        │   Backend Server    │
        │  (Express.js)       │
        └─────────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
    ┌────────┐ ┌─────────┐ ┌──────────┐
    │Auth    │ │Middleware│ │Protected │
    │Routes  │ │Verify JWT│ │Endpoints │
    └────────┘ └─────────┘ └──────────┘
        │           │           │
        └───────────┼───────────┘
                    │
                    ▼
        ┌─────────────────────┐
        │   MongoDB Database  │
        │ - Users             │
        │ - Holdings          │
        │ - Positions         │
        │ - Orders            │
        └─────────────────────┘
```

## Authentication Flow

```
1. SIGNUP/LOGIN
   User inputs credentials
        ↓
   Validate input
        ↓
   Check if user exists (login) / doesn't exist (signup)
        ↓
   Hash password (signup only)
        ↓
   Create/Verify user in DB
        ↓
   Generate JWT Token
        ↓
   Send token to frontend
        ↓
   Store in localStorage

2. API REQUEST
   User makes request
        ↓
   Attach token in Authorization header
        ↓
   Send to backend
        ↓
   authMiddleware verifies token
        ↓
   Extract userId from token
        ↓
   Process request with userId
        ↓
   Return protected data

3. LOGOUT
   User clicks logout
        ↓
   Clear token from localStorage
        ↓
   Clear user from context
        ↓
   Redirect to home
        ↓
   Protected routes redirect to login
```

## Component Tree

```
App (AuthProvider)
├── Navbar
│   ├── Login Link (if not authenticated)
│   ├── Signup Link (if not authenticated)
│   └── Logout Button (if authenticated)
├── Routes
│   ├── Home (public)
│   ├── About (public)
│   ├── Product (public)
│   ├── Pricing (public)
│   ├── Support (public)
│   ├── Login (public)
│   ├── Signup (public)
│   └── Dashboard (protected)
│       └── ProtectedRoute
│           └── Home Component
└── Footer

AuthContext
├── user
├── token
├── isAuthenticated
├── loading
├── login()
├── signup()
├── logout()
└── verifyToken()
```

## Data Flow - Login

```
┌─────────────────┐
│ User Enters     │
│ Credentials     │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│ Frontend: Login Component    │
│ (Login.js)                  │
└────────┬────────────────────┘
         │
         │ POST /api/auth/login
         │ {email, password}
         ▼
┌─────────────────────────────┐
│ Backend: Auth Routes        │
│ (authRoutes.js)            │
│ - Validate input            │
│ - Find user in DB           │
│ - Compare password          │
└────────┬────────────────────┘
         │
         │ if valid
         ▼
┌─────────────────────────────┐
│ Generate JWT Token          │
│ Sign with secret key        │
│ Expires in 7 days           │
└────────┬────────────────────┘
         │
         │ Return token + user
         ▼
┌─────────────────────────────┐
│ Frontend: AuthContext       │
│ Store token in localStorage │
│ Set user in state           │
│ Set isAuthenticated = true  │
└────────┬────────────────────┘
         │
         │ Redirect
         ▼
┌─────────────────────────────┐
│ Dashboard (Protected)       │
│ Access granted              │
└─────────────────────────────┘
```

## Data Flow - Protected API Call

```
┌──────────────────────────┐
│ Component needs data     │
│ (e.g., Holdings)         │
└───────────┬──────────────┘
            │
            ▼
┌──────────────────────────────────────┐
│ Get token from context/localStorage  │
└───────────┬────────────────────────┬─┘
            │                        │
      token │                        │ no token
            ▼                        ▼
      ┌──────────┐            ┌────────────┐
      │ Include  │            │ Redirect   │
      │ in header│            │ to login   │
      └───┬──────┘            └────────────┘
          │
          │ Authorization: Bearer <token>
          ▼
┌──────────────────────────────────────┐
│ Backend: Protected Endpoint          │
│ (/allHoldings)                       │
└───────────┬────────────────────────┬─┘
            │                        │
     valid  │                        │ invalid
            ▼                        ▼
      ┌───────────┐           ┌───────────┐
      │ Process   │           │ Return    │
      │ Request   │           │ 401 Error │
      └────┬──────┘           └───────────┘
           │
           │ Fetch Holdings
           ▼
      ┌─────────────┐
      │ Database    │
      │ Query       │
      └────┬────────┘
           │
           │ Return data
           ▼
      ┌──────────────────┐
      │ Send Response    │
      │ {holdings: [...]}│
      └────┬─────────────┘
           │
           │ JSON data
           ▼
      ┌──────────────────┐
      │ Frontend         │
      │ Render Holdings  │
      │ to User          │
      └──────────────────┘
```

## Token Structure

```
JWT Token Format:
<header>.<payload>.<signature>

Example Decoded Token:
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "iat": 1704207600,
    "exp": 1704812400
  },
  "signature": "HMACSHA256(base64(header) + base64(payload), secret)"
}

iat: issued at (timestamp)
exp: expiration time (7 days from issue)
```

## Middleware Chain

```
Request
   │
   ▼
Express Middleware
   ├── cors()
   ├── bodyParser.json()
   │
   ▼
Public Routes
   ├── /api/auth/signup
   ├── /api/auth/login
   └── / (home page)
   
Protected Routes
   │
   ▼
authMiddleware (verifyToken)
   ├── Extract token from header
   ├── Verify signature
   ├── Check expiration
   ├── Extract userId
   │
   ├── ✓ Valid
   │  │
   │  ▼
   │  req.userId = decoded.userId
   │  next() → Route Handler
   │
   └── ✗ Invalid
      │
      ▼
      Return 401 Unauthorized
```

## Security Layers

```
Layer 1: Password Security
├── Input validation
├── Password hashing (bcryptjs, 12 rounds)
└── Never store plain text

Layer 2: Token Security
├── JWT signature verification
├── Token expiration (7 days)
├── Secure secret key
└── Bearer token in headers

Layer 3: Request Security
├── CORS protection
├── Body parser validation
└── Unique email/username constraints

Layer 4: Route Protection
├── Middleware verification
├── userId extraction
└── Unauthorized error handling
```

## Error Handling

```
┌─────────────────────────────────────────┐
│ Error Scenarios & Responses             │
└─────────────────────────────────────────┘

1. Missing Token
   ├── Status: 401
   └── Message: "No token provided"

2. Invalid Token
   ├── Status: 401
   └── Message: "Invalid token"

3. Expired Token
   ├── Status: 401
   └── Message: "Invalid token"

4. Wrong Credentials
   ├── Status: 400
   └── Message: "Invalid email or password"

5. Email Already Registered
   ├── Status: 400
   └── Message: "Email already registered"

6. Username Already Taken
   ├── Status: 400
   └── Message: "Username already taken"

7. Missing Fields
   ├── Status: 400
   └── Message: "All fields are required"

8. Password Mismatch (Signup)
   ├── Status: 400
   └── Message: "Passwords do not match"

9. Database Error
   ├── Status: 500
   └── Message: "Error [action]"
```
