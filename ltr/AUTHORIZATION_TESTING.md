# Authorization & RBAC Testing Guide

## Overview
This document provides comprehensive test scenarios for the Role-Based Access Control (RBAC) implementation in the Local Train Passengers Management System.

## Test Environment Setup

### 1. Ensure Server is Running
```bash
npm run dev
```
Server should be running on `http://localhost:5174`

### 2. Test Users

Create these test users with different roles:

#### Admin User
```bash
curl -X POST http://localhost:5174/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "name": "Admin User",
  "email": "admin@ltr.com",
  "password": "Admin123!@#"
}'
```

**Note**: After registration, manually update the role to ADMIN in the database:
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@ltr.com';
```

Or using Prisma Studio:
```bash
npx prisma studio
```

#### Regular User
```bash
curl -X POST http://localhost:5174/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "name": "Regular User",
  "email": "user@ltr.com",
  "password": "User123!@#"
}'
```

#### Project Manager
```bash
curl -X POST http://localhost:5174/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "name": "Project Manager",
  "email": "pm@ltr.com",
  "password": "PM123!@#"
}'
```

Then update role to PROJECT_MANAGER in database.

---

## Test Scenarios

### Scenario 1: Public Route Access (No Authentication Required)

#### Test 1.1: Register New User
**Request:**
```bash
curl -X POST http://localhost:5174/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "name": "Test User",
  "email": "test@ltr.com",
  "password": "Test123!@#"
}'
```

**Expected Result:**
- ✅ Status Code: 201
- ✅ Response contains user data
- ✅ No token required

#### Test 1.2: Login
**Request:**
```bash
curl -X POST http://localhost:5174/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "admin@ltr.com",
  "password": "Admin123!@#"
}'
```

**Expected Result:**
- ✅ Status Code: 200
- ✅ Returns JWT token
- ✅ Sets HTTP-only cookie

**Save the token for subsequent tests:**
```bash
export ADMIN_TOKEN="<token_from_response>"
export USER_TOKEN="<token_from_user_login>"
```

---

### Scenario 2: Missing Authentication Token

#### Test 2.1: Access Protected Route Without Token
**Request:**
```bash
curl -X GET http://localhost:5174/api/admin \
-v
```

**Expected Result:**
- ❌ Status Code: 401 Unauthorized
- ❌ Error message: "Authentication required. Token missing."
- ❌ Error code: "AUTH_TOKEN_MISSING"

#### Test 2.2: Access User Route Without Token
**Request:**
```bash
curl -X GET http://localhost:5174/api/users \
-v
```

**Expected Result:**
- ❌ Status Code: 401 Unauthorized
- ❌ Error message: "Authentication required. Token missing."

---

### Scenario 3: Invalid or Expired Token

#### Test 3.1: Invalid Token Format
**Request:**
```bash
curl -X GET http://localhost:5174/api/admin \
-H "Authorization: Bearer invalid_token_xyz" \
-v
```

**Expected Result:**
- ❌ Status Code: 403 Forbidden
- ❌ Error message: "Invalid or expired token. Please login again."
- ❌ Error code: "AUTH_TOKEN_INVALID"

#### Test 3.2: Malformed Token
**Request:**
```bash
curl -X GET http://localhost:5174/api/admin \
-H "Authorization: Bearer eyJ.malformed.token" \
-v
```

**Expected Result:**
- ❌ Status Code: 403 Forbidden
- ❌ JWT verification failure

---

### Scenario 4: Regular User Access

#### Test 4.1: Access Authenticated Route (Success)
**Request:**
```bash
curl -X GET http://localhost:5174/api/users \
-H "Authorization: Bearer $USER_TOKEN" \
-v
```

**Expected Result:**
- ✅ Status Code: 200 OK
- ✅ Returns user data
- ✅ Access granted

#### Test 4.2: Access Admin Route (Denied)
**Request:**
```bash
curl -X GET http://localhost:5174/api/admin \
-H "Authorization: Bearer $USER_TOKEN" \
-v
```

**Expected Result:**
- ❌ Status Code: 403 Forbidden
- ❌ Error message: "Access denied. Admin privileges required."
- ❌ Error code: "FORBIDDEN_ACCESS"

#### Test 4.3: List All Users (Denied)
**Request:**
```bash
curl -X GET http://localhost:5174/api/admin/users \
-H "Authorization: Bearer $USER_TOKEN" \
-v
```

**Expected Result:**
- ❌ Status Code: 403 Forbidden
- ❌ Admin-only route blocked

---

### Scenario 5: Admin User Access

#### Test 5.1: Access Admin Dashboard (Success)
**Request:**
```bash
curl -X GET http://localhost:5174/api/admin \
-H "Authorization: Bearer $ADMIN_TOKEN" \
-v
```

**Expected Result:**
- ✅ Status Code: 200 OK
- ✅ Returns system statistics
- ✅ Shows user counts, projects, teams, etc.

**Sample Response:**
```json
{
  "success": true,
  "data": {
    "message": "Welcome Admin! Access granted to admin@ltr.com",
    "statistics": {
      "users": 5,
      "projects": 3,
      "teams": 2,
      "tasks": 15,
      "trains": 8,
      "alerts": 2,
      "activeAlerts": 1,
      "adminUsers": 1
    },
    "recentActivity": {
      "users": [...],
      "projects": [...]
    },
    "accessLevel": "ADMIN"
  }
}
```

#### Test 5.2: List All Users (Success)
**Request:**
```bash
curl -X GET http://localhost:5174/api/admin/users \
-H "Authorization: Bearer $ADMIN_TOKEN" \
-v
```

**Expected Result:**
- ✅ Status Code: 200 OK
- ✅ Returns paginated user list
- ✅ Includes user statistics

#### Test 5.3: Get Specific User Details (Success)
**Request:**
```bash
curl -X GET http://localhost:5174/api/admin/users/1 \
-H "Authorization: Bearer $ADMIN_TOKEN" \
-v
```

**Expected Result:**
- ✅ Status Code: 200 OK
- ✅ Returns detailed user info
- ✅ Includes projects, tasks, teams, alerts

#### Test 5.4: Update User Role (Success)
**Request:**
```bash
curl -X PATCH http://localhost:5174/api/admin/users/2 \
-H "Authorization: Bearer $ADMIN_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "role": "PROJECT_MANAGER"
}' \
-v
```

**Expected Result:**
- ✅ Status Code: 200 OK
- ✅ User role updated successfully

#### Test 5.5: Create New User (Success)
**Request:**
```bash
curl -X POST http://localhost:5174/api/admin/users \
-H "Authorization: Bearer $ADMIN_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "name": "New Employee",
  "email": "employee@ltr.com",
  "password": "Emp123!@#",
  "role": "TEAM_LEAD"
}' \
-v
```

**Expected Result:**
- ✅ Status Code: 201 Created
- ✅ User created with specified role

#### Test 5.6: Delete User (Success)
**Request:**
```bash
curl -X DELETE http://localhost:5174/api/admin/users/3 \
-H "Authorization: Bearer $ADMIN_TOKEN" \
-v
```

**Expected Result:**
- ✅ Status Code: 200 OK
- ✅ User deleted successfully

#### Test 5.7: Self-Deletion Prevention (Denied)
**Request:**
```bash
# Try to delete your own admin account (ID 1)
curl -X DELETE http://localhost:5174/api/admin/users/1 \
-H "Authorization: Bearer $ADMIN_TOKEN" \
-v
```

**Expected Result:**
- ❌ Status Code: 400 Bad Request
- ❌ Error message: "Cannot delete your own account"

---

### Scenario 6: Token from Cookie (Alternative Auth Method)

#### Test 6.1: Login and Use Cookie
**Request:**
```bash
# Login to set cookie
curl -X POST http://localhost:5174/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "admin@ltr.com",
  "password": "Admin123!@#"
}' \
-c cookies.txt

# Access admin route using cookie
curl -X GET http://localhost:5174/api/admin \
-b cookies.txt \
-v
```

**Expected Result:**
- ✅ Status Code: 200 OK
- ✅ Cookie authentication works
- ✅ No Authorization header needed

---

### Scenario 7: Header Context Injection

#### Test 7.1: Verify User Info in Headers
Create a test route to verify middleware headers:

```typescript
// src/app/api/test-auth/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    userId: req.headers.get("x-user-id"),
    email: req.headers.get("x-user-email"),
    role: req.headers.get("x-user-role"),
  });
}
```

**Request:**
```bash
curl -X GET http://localhost:5174/api/test-auth \
-H "Authorization: Bearer $ADMIN_TOKEN"
```

**Expected Result:**
- ✅ Returns user info from headers
- ✅ Confirms middleware injection

---

### Scenario 8: Pagination and Filtering (Admin Routes)

#### Test 8.1: Paginated User List
**Request:**
```bash
curl -X GET "http://localhost:5174/api/admin/users?page=1&limit=5" \
-H "Authorization: Bearer $ADMIN_TOKEN" \
-v
```

**Expected Result:**
- ✅ Returns 5 users max
- ✅ Includes pagination metadata

#### Test 8.2: Filter by Role
**Request:**
```bash
curl -X GET "http://localhost:5174/api/admin/users?role=ADMIN" \
-H "Authorization: Bearer $ADMIN_TOKEN" \
-v
```

**Expected Result:**
- ✅ Returns only ADMIN users
- ✅ Filtering works correctly

---

## Test Results Summary

### Expected Outcomes Table

| Test Scenario | User Role | Expected Status | Access Granted |
|--------------|-----------|----------------|----------------|
| Public routes (register/login) | None | 200/201 | ✅ Yes |
| Protected route without token | None | 401 | ❌ No |
| Protected route with invalid token | None | 403 | ❌ No |
| `/api/users` with USER token | USER | 200 | ✅ Yes |
| `/api/admin` with USER token | USER | 403 | ❌ No |
| `/api/admin` with ADMIN token | ADMIN | 200 | ✅ Yes |
| `/api/admin/users` with ADMIN token | ADMIN | 200 | ✅ Yes |
| Update user role with ADMIN token | ADMIN | 200 | ✅ Yes |
| Delete self with ADMIN token | ADMIN | 400 | ❌ No |
| Cookie-based auth | Any | 200 | ✅ Yes |

---

## Postman Collection

Import this collection for easier testing:

```json
{
  "info": {
    "name": "LTR Authorization Tests",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Test User\",\n  \"email\": \"test@ltr.com\",\n  \"password\": \"Test123!@#\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": "{{baseUrl}}/api/auth/register"
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"admin@ltr.com\",\n  \"password\": \"Admin123!@#\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": "{{baseUrl}}/api/auth/login"
          }
        }
      ]
    },
    {
      "name": "Admin",
      "item": [
        {
          "name": "Dashboard",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{adminToken}}",
                "type": "text"
              }
            ],
            "url": "{{baseUrl}}/api/admin"
          }
        },
        {
          "name": "List Users",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{adminToken}}",
                "type": "text"
              }
            ],
            "url": "{{baseUrl}}/api/admin/users"
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5174"
    },
    {
      "key": "adminToken",
      "value": ""
    },
    {
      "key": "userToken",
      "value": ""
    }
  ]
}
```

---

## Troubleshooting

### Issue: Middleware not intercepting requests
**Solution:** Ensure `middleware.ts` is at the root of `ltr/` directory, not in `src/`.

### Issue: Token verification fails
**Solution:** Check `JWT_SECRET` in `.env` matches the one used during login.

### Issue: Headers not injected
**Solution:** Verify middleware is running and check `config.matcher` includes your route.

### Issue: Cookie not set
**Solution:** Ensure `secure: false` for development (localhost).

---

## Next Steps

1. ✅ Test all scenarios documented above
2. ✅ Document results with screenshots
3. ✅ Create Bruno/Postman collection
4. ✅ Test edge cases (expired tokens, concurrent requests)
5. ✅ Performance test with multiple roles
6. ✅ Add integration tests

---

**Last Updated:** December 18, 2025  
**Version:** 1.0  
**Author:** LTR Development Team
