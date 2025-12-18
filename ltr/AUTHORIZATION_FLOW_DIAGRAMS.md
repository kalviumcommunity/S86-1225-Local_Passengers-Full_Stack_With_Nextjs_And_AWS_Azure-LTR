# Authorization Flow Visualization

## 1. Complete Request Flow

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          CLIENT APPLICATION                               │
│                                                                           │
│  User Action → Login/Register → Receive JWT Token → Store Token          │
└───────────────────────────────┬──────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         HTTP REQUEST                                      │
│                                                                           │
│  Method: GET/POST/PATCH/DELETE                                           │
│  URL: /api/admin/users                                                   │
│  Headers:                                                                │
│    - Authorization: Bearer <JWT_TOKEN>                                   │
│    OR                                                                    │
│  Cookie: token=<JWT_TOKEN>                                               │
└───────────────────────────────┬──────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                      MIDDLEWARE (middleware.ts)                           │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ Step 1: Check if route requires protection                       │    │
│  │   - Admin routes: /api/admin/*                                   │    │
│  │   - Authenticated routes: /api/users/*, /api/projects/*, etc.   │    │
│  │   - Public routes: /api/auth/login, /api/auth/register          │    │
│  └─────────────────────┬───────────────────────────────────────────┘    │
│                        │                                                  │
│                        ▼                                                  │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ Step 2: Extract JWT Token                                        │    │
│  │   - From Authorization header: Bearer <token>                    │    │
│  │   - OR from cookie: token=<token>                                │    │
│  └─────────────────────┬───────────────────────────────────────────┘    │
│                        │                                                  │
│                        ▼                                                  │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ Step 3: Token Present?                                           │    │
│  │   NO → Return 401 Unauthorized                                   │    │
│  │   YES → Continue                                                 │    │
│  └─────────────────────┬───────────────────────────────────────────┘    │
│                        │                                                  │
│                        ▼                                                  │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ Step 4: Verify JWT Signature                                     │    │
│  │   jwt.verify(token, JWT_SECRET)                                  │    │
│  │   INVALID → Return 403 Forbidden                                 │    │
│  │   VALID → Continue                                               │    │
│  └─────────────────────┬───────────────────────────────────────────┘    │
│                        │                                                  │
│                        ▼                                                  │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ Step 5: Decode Token Payload                                     │    │
│  │   Extract: userId, email, role                                   │    │
│  └─────────────────────┬───────────────────────────────────────────┘    │
│                        │                                                  │
│                        ▼                                                  │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ Step 6: Check Role Requirements                                  │    │
│  │   If admin route → Require role === "ADMIN"                      │    │
│  │   If not ADMIN → Return 403 Forbidden                            │    │
│  └─────────────────────┬───────────────────────────────────────────┘    │
│                        │                                                  │
│                        ▼                                                  │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ Step 7: Inject User Context into Headers                         │    │
│  │   x-user-id: userId                                              │    │
│  │   x-user-email: email                                            │    │
│  │   x-user-role: role                                              │    │
│  └─────────────────────┬───────────────────────────────────────────┘    │
│                        │                                                  │
│                        ▼                                                  │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ Step 8: Forward Request                                          │    │
│  │   NextResponse.next({ request: { headers } })                    │    │
│  └─────────────────────┬───────────────────────────────────────────┘    │
└────────────────────────┼──────────────────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                      API ROUTE HANDLER                                    │
│                                                                           │
│  Function: GET/POST/PATCH/DELETE handler                                 │
│  Access user context from headers:                                       │
│    - req.headers.get("x-user-id")                                        │
│    - req.headers.get("x-user-email")                                     │
│    - req.headers.get("x-user-role")                                      │
│                                                                           │
│  Execute business logic with authenticated user context                  │
└───────────────────────────────┬──────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                      DATABASE OPERATIONS                                  │
│                                                                           │
│  Prisma queries using authenticated user context                         │
│  Example: prisma.user.findUnique({ where: { id: userId } })             │
└───────────────────────────────┬──────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                      RESPONSE TO CLIENT                                   │
│                                                                           │
│  Success: 200/201 with data                                              │
│  Error: 400/401/403/404/500 with error message                           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Role-Based Access Decision Tree

```
                         ┌──────────────┐
                         │   REQUEST    │
                         └──────┬───────┘
                                │
                                ▼
                    ┌──────────────────────┐
                    │ Route requires auth? │
                    └──────┬───────────────┘
                           │
                ┌──────────┴──────────┐
                │                     │
              YES                    NO
                │                     │
                ▼                     ▼
     ┌─────────────────┐      ┌──────────────┐
     │  Token present? │      │ Allow Access │
     └────┬────────────┘      └──────────────┘
          │
     ┌────┴────┐
     │         │
    YES       NO
     │         │
     │         ▼
     │    ┌─────────────────┐
     │    │ Return 401      │
     │    │ Unauthorized    │
     │    └─────────────────┘
     │
     ▼
┌──────────────────┐
│  Token valid?    │
└────┬─────────────┘
     │
 ┌───┴───┐
 │       │
YES     NO
 │       │
 │       ▼
 │  ┌─────────────────┐
 │  │ Return 403      │
 │  │ Forbidden       │
 │  └─────────────────┘
 │
 ▼
┌──────────────────────┐
│ Admin route?         │
└────┬─────────────────┘
     │
 ┌───┴───┐
 │       │
YES     NO
 │       │
 │       ▼
 │  ┌──────────────┐
 │  │Allow Access  │
 │  └──────────────┘
 │
 ▼
┌──────────────────────┐
│ Role === "ADMIN"?    │
└────┬─────────────────┘
     │
 ┌───┴───┐
 │       │
YES     NO
 │       │
 │       ▼
 │  ┌─────────────────┐
 │  │ Return 403      │
 │  │ Access Denied   │
 │  └─────────────────┘
 │
 ▼
┌──────────────────┐
│  Allow Access    │
│  Inject Context  │
└──────────────────┘
```

---

## 3. User Role Hierarchy

```
┌──────────────────────────────────────────────────────┐
│                      ADMIN                           │
│  ✓ Full system access                               │
│  ✓ Manage users (create, read, update, delete)      │
│  ✓ Change user roles                                │
│  ✓ View system statistics                           │
│  ✓ Access all admin routes                          │
│  ✓ Access all authenticated routes                  │
└──────────────────────┬───────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────┐
│              PROJECT_MANAGER                         │
│  ✓ Manage projects                                   │
│  ✓ Assign tasks                                      │
│  ✓ View team performance                             │
│  ✓ Access authenticated routes                       │
│  ✗ Cannot access admin routes                        │
└──────────────────────┬───────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────┐
│                 TEAM_LEAD                            │
│  ✓ Manage team members                               │
│  ✓ Assign tasks to team                              │
│  ✓ View team data                                    │
│  ✓ Access authenticated routes                       │
│  ✗ Cannot access admin routes                        │
└──────────────────────┬───────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────┐
│                     USER                             │
│  ✓ View own data                                     │
│  ✓ Update own profile                                │
│  ✓ Access authenticated routes                       │
│  ✗ Cannot access admin routes                        │
│  ✗ Cannot manage others                              │
└──────────────────────────────────────────────────────┘
```

---

## 4. JWT Token Structure

```
┌─────────────────────────────────────────────────────────┐
│                    JWT TOKEN                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Header:                                                │
│  {                                                      │
│    "alg": "HS256",                                      │
│    "typ": "JWT"                                         │
│  }                                                      │
│                                                         │
│  Payload:                                               │
│  {                                                      │
│    "userId": 1,                                         │
│    "email": "admin@ltr.com",                            │
│    "role": "ADMIN",                                     │
│    "iat": 1734480000,  // Issued at                    │
│    "exp": 1735084800   // Expires in 7 days            │
│  }                                                      │
│                                                         │
│  Signature:                                             │
│  HMACSHA256(                                            │
│    base64UrlEncode(header) + "." +                     │
│    base64UrlEncode(payload),                           │
│    JWT_SECRET                                           │
│  )                                                      │
│                                                         │
└─────────────────────────────────────────────────────────┘

Full Token Format:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWls...
│         HEADER          │       PAYLOAD        │   SIGNATURE   │
```

---

## 5. Error Response Flow

```
┌─────────────────────────────────────────┐
│         Error Scenarios                 │
└────────────┬────────────────────────────┘
             │
     ┌───────┴────────┐
     │                │
     ▼                ▼
┌─────────────┐  ┌──────────────┐
│ No Token    │  │Invalid Token │
│ 401         │  │ 403          │
└─────────────┘  └──────────────┘
     │                │
     ▼                ▼
┌────────────────────────────────┐
│ {                              │
│   "success": false,            │
│   "message": "...",            │
│   "errorCode": "..."           │
│ }                              │
└────────────────────────────────┘
     │
     ▼
┌────────────────────────────────┐
│  Wrong Role (USER → Admin)     │
│  403 Forbidden                 │
└────────────────────────────────┘
     │
     ▼
┌────────────────────────────────┐
│ {                              │
│   "success": false,            │
│   "message": "Access denied.   │
│     Admin privileges required",│
│   "errorCode":                 │
│     "FORBIDDEN_ACCESS"         │
│ }                              │
└────────────────────────────────┘
```

---

## 6. Successful Authentication Flow

```
┌─────────────────┐
│  1. REGISTER    │
│  POST /register │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  Create user with role      │
│  Default role: USER         │
│  Hash password with bcrypt  │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────┐
│  2. LOGIN       │
│  POST /login    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  Verify credentials         │
│  Generate JWT token         │
│  Include: userId, email,    │
│           role              │
│  Expires: 7 days            │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Return token to client     │
│  Set HTTP-only cookie       │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  3. ACCESS PROTECTED ROUTE  │
│  GET /api/admin             │
│  Authorization: Bearer JWT  │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Middleware validates:      │
│  ✓ Token signature          │
│  ✓ Token not expired        │
│  ✓ User role = ADMIN        │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Inject headers:            │
│  x-user-id                  │
│  x-user-email               │
│  x-user-role                │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Route handler executes     │
│  Access user context        │
│  Return response            │
└─────────────────────────────┘
```

---

## 7. Database Schema (User Model)

```
┌─────────────────────────────────────────┐
│             User Table                  │
├────────────┬───────────┬────────────────┤
│ Field      │ Type      │ Constraints    │
├────────────┼───────────┼────────────────┤
│ id         │ Int       │ PK, Auto Inc   │
│ email      │ String    │ Unique, Index  │
│ password   │ String    │ Hashed         │
│ name       │ String    │                │
│ phone      │ String?   │ Optional       │
│ role       │ UserRole  │ Default: USER  │
│ createdAt  │ DateTime  │ Auto           │
│ updatedAt  │ DateTime  │ Auto           │
└────────────┴───────────┴────────────────┘

┌─────────────────────────────────────────┐
│           UserRole Enum                 │
├─────────────────────────────────────────┤
│  • ADMIN                                │
│  • PROJECT_MANAGER                      │
│  • TEAM_LEAD                            │
│  • USER (default)                       │
└─────────────────────────────────────────┘
```

---

## 8. Route Protection Matrix

```
┌──────────────────────┬────────┬────────┬──────────┬──────┐
│ Route                │ PUBLIC │ USER   │ PM/TL    │ADMIN │
├──────────────────────┼────────┼────────┼──────────┼──────┤
│ /api/auth/register   │   ✓    │   ✓    │    ✓     │  ✓   │
│ /api/auth/login      │   ✓    │   ✓    │    ✓     │  ✓   │
├──────────────────────┼────────┼────────┼──────────┼──────┤
│ /api/users/*         │   ✗    │   ✓    │    ✓     │  ✓   │
│ /api/projects/*      │   ✗    │   ✓    │    ✓     │  ✓   │
│ /api/tasks/*         │   ✗    │   ✓    │    ✓     │  ✓   │
│ /api/teams/*         │   ✗    │   ✓    │    ✓     │  ✓   │
│ /api/alerts/*        │   ✗    │   ✓    │    ✓     │  ✓   │
├──────────────────────┼────────┼────────┼──────────┼──────┤
│ /api/admin/*         │   ✗    │   ✗    │    ✗     │  ✓   │
│ /api/admin/users     │   ✗    │   ✗    │    ✗     │  ✓   │
│ /api/admin/users/[id]│   ✗    │   ✗    │    ✗     │  ✓   │
└──────────────────────┴────────┴────────┴──────────┴──────┘

Legend:
  ✓ = Access Granted
  ✗ = Access Denied (401/403)
  PUBLIC = No authentication required
  USER = Requires valid JWT, any role
  PM/TL = Project Manager or Team Lead
  ADMIN = Admin role required
```

---

These diagrams provide a comprehensive visual understanding of the authorization system implementation.
