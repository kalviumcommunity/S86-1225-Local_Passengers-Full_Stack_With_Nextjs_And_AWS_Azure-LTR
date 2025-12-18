# 🚀 Authorization Quick Reference Card

## Quick Start Testing

### 1. Start Server
```bash
cd ltr
npm run dev
```
Server runs on: `http://localhost:5174`

---

## 2. Create Admin User

### Register
```bash
curl -X POST http://localhost:5174/api/auth/register \
-H "Content-Type: application/json" \
-d '{"name":"Admin User","email":"admin@ltr.com","password":"Admin123!@#"}'
```

### Update to Admin (use Prisma Studio)
```bash
npx prisma studio
```
Navigate to User → Find user → Change role to `ADMIN` → Save

---

## 3. Login & Get Token

```bash
curl -X POST http://localhost:5174/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"admin@ltr.com","password":"Admin123!@#"}'
```

**Save the token from response:**
```bash
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5..."
```

---

## 4. Test Routes

### ✅ Admin Dashboard (200 OK)
```bash
curl -X GET http://localhost:5174/api/admin \
-H "Authorization: Bearer $TOKEN"
```

### ✅ List Users (200 OK)
```bash
curl -X GET http://localhost:5174/api/admin/users \
-H "Authorization: Bearer $TOKEN"
```

### ❌ No Token (401 Unauthorized)
```bash
curl -X GET http://localhost:5174/api/admin
```

### ❌ Invalid Token (403 Forbidden)
```bash
curl -X GET http://localhost:5174/api/admin \
-H "Authorization: Bearer invalid_token"
```

---

## User Roles

| Role | Access Level |
|------|-------------|
| **ADMIN** | Full system access + admin routes |
| **PROJECT_MANAGER** | Manage projects + authenticated routes |
| **TEAM_LEAD** | Manage teams + authenticated routes |
| **USER** | Basic access (default) |

---

## Protected Routes

### 🔴 Admin Only (`/api/admin/*`)
- `GET /api/admin` - Dashboard
- `GET /api/admin/users` - List users
- `GET /api/admin/users/[id]` - Get user
- `PATCH /api/admin/users/[id]` - Update user
- `POST /api/admin/users` - Create user
- `DELETE /api/admin/users/[id]` - Delete user

### 🟡 Authenticated Users (`/api/users/*`, etc.)
- `/api/users/*` - User routes
- `/api/projects/*` - Project routes
- `/api/tasks/*` - Task routes
- `/api/teams/*` - Team routes
- `/api/alerts/*` - Alert routes
- `/api/trains/*` - Train routes

### 🟢 Public (`/api/auth/*`)
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Current user

---

## Response Codes

| Code | Meaning | Scenario |
|------|---------|----------|
| **200** | OK | Successful request |
| **201** | Created | Resource created |
| **400** | Bad Request | Invalid input |
| **401** | Unauthorized | No token / Token missing |
| **403** | Forbidden | Invalid token / Wrong role |
| **404** | Not Found | Resource not found |
| **500** | Server Error | Internal error |

---

## Error Codes

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `AUTH_TOKEN_MISSING` | 401 | No token provided |
| `AUTH_TOKEN_INVALID` | 403 | Invalid/expired token |
| `FORBIDDEN_ACCESS` | 403 | Insufficient permissions |
| `VALIDATION_ERROR` | 400 | Input validation failed |
| `DATABASE_ERROR` | 500 | Database operation failed |

---

## Helper Functions (`@/lib/auth`)

```typescript
import { getAuthenticatedUser, isAdmin } from "@/lib/auth";

// Get user info
const user = getAuthenticatedUser(req);
// Returns: { userId: number, email: string, role: string } | null

// Check roles
isAdmin(req)           // ADMIN
isProjectManager(req)  // ADMIN or PROJECT_MANAGER
isTeamLead(req)       // ADMIN, PROJECT_MANAGER, or TEAM_LEAD
hasRole(req, "USER")  // Specific role check
```

---

## Bruno Collection

### Import Collection
1. Open Bruno
2. Open collection from `ltr/ltr/` folder
3. Select "Local" environment
4. Run "Login Admin" request
5. Token auto-saved to `{{adminToken}}`
6. Test other requests

### Available Tests
- ✅ `auth-register.bru` - Register user
- ✅ `auth-login-admin.bru` - Admin login
- ✅ `auth-login-user.bru` - User login
- ✅ `admin-dashboard.bru` - Dashboard
- ✅ `admin-list-users.bru` - List users
- ✅ `admin-get-user.bru` - Get user details
- ✅ `admin-update-user.bru` - Update user role
- ✅ `admin-create-user.bru` - Create user
- ✅ `admin-delete-user.bru` - Delete user
- ❌ `test-user-denied.bru` - Test access denied
- ❌ `test-no-token.bru` - Test no token
- ❌ `test-invalid-token.bru` - Test invalid token

---

## Middleware Headers

Middleware injects these headers for route handlers:

```typescript
x-user-id: "1"               // User's database ID
x-user-email: "admin@ltr.com" // User's email
x-user-role: "ADMIN"         // User's role
```

Access in route handlers:
```typescript
const userId = req.headers.get("x-user-id");
const email = req.headers.get("x-user-email");
const role = req.headers.get("x-user-role");
```

---

## Common Scenarios

### Scenario 1: Create Admin User
1. Register user via `/api/auth/register`
2. Open Prisma Studio: `npx prisma studio`
3. Change role to `ADMIN`
4. Login to get admin token

### Scenario 2: Test Authorization
1. Login as USER
2. Try accessing `/api/admin` → 403 Forbidden ❌
3. Login as ADMIN
4. Access `/api/admin` → 200 OK ✅

### Scenario 3: Update User Role
1. Login as ADMIN
2. PATCH `/api/admin/users/[id]`
3. Send: `{"role": "PROJECT_MANAGER"}`
4. Verify role updated

---

## Documentation Files

| File | Purpose |
|------|---------|
| **README.md** | Main project documentation |
| **ltr/README.md** | Technical setup + authorization guide |
| **AUTHORIZATION_TESTING.md** | Testing scenarios and examples |
| **AUTHORIZATION_IMPLEMENTATION_SUMMARY.md** | Complete implementation summary |
| **AUTHORIZATION_FLOW_DIAGRAMS.md** | Visual flow diagrams |
| **AUTHORIZATION_QUICK_REFERENCE.md** | This quick reference (you are here) |

---

## Troubleshooting

### Issue: 401 Unauthorized
- ✅ Check if token is provided
- ✅ Verify token in Authorization header or cookie

### Issue: 403 Forbidden
- ✅ Check token validity (not expired)
- ✅ Verify user role matches route requirement
- ✅ Confirm JWT_SECRET matches in `.env`

### Issue: Middleware not working
- ✅ Ensure `middleware.ts` is at root of `ltr/` directory
- ✅ Check `config.matcher` includes your route
- ✅ Restart dev server

### Issue: Can't access admin routes
- ✅ Verify user role is `ADMIN` in database
- ✅ Check token includes role field
- ✅ Re-login to get updated token

---

## Security Checklist

- [x] JWT tokens expire after 7 days
- [x] Passwords hashed with bcrypt
- [x] HTTP-only cookies prevent XSS
- [x] Role-based access control enforced
- [x] Admin routes protected
- [x] Input validation with Zod
- [x] Error handling with proper codes
- [x] Self-deletion prevention
- [x] Token verification on every request
- [x] Least privilege principle

---

## Need Help?

📚 **Full Documentation:**
- [README.md](./README.md)
- [ltr/README.md](./ltr/README.md)
- [AUTHORIZATION_TESTING.md](./AUTHORIZATION_TESTING.md)

🧪 **Testing:**
- Use Bruno collection in `ltr/ltr/`
- Check test scenarios in `AUTHORIZATION_TESTING.md`

🔧 **Code:**
- Middleware: `ltr/middleware.ts`
- Admin routes: `ltr/src/app/api/admin/`
- Auth helpers: `ltr/src/lib/auth.ts`

---

**Quick Start:**
```bash
# 1. Start server
npm run dev

# 2. Create admin (via Prisma Studio)
npx prisma studio

# 3. Login
curl -X POST http://localhost:5174/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"admin@ltr.com","password":"Admin123!@#"}'

# 4. Test (replace TOKEN)
curl -X GET http://localhost:5174/api/admin \
-H "Authorization: Bearer TOKEN"
```

🎉 **You're all set!**
