# Local Train Passengers Management System - Technical Setup

This is the technical implementation directory for the Local Train Passengers project built with Next.js 16, Prisma, and PostgreSQL.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Docker and Docker Compose
- PostgreSQL (via Docker)

### Installation Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start Docker containers**
   ```bash
   docker-compose up -d
   ```

3. **Set up environment variables**
   Create a `.env` file:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/ltr"
   JWT_SECRET="your-secret-key-change-in-production"
   ```

4. **Run database migrations**
   ```bash
   npm run prisma:migrate
   ```

5. **Seed the database**
   ```bash
   npx prisma db seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:5174](http://localhost:5174) to view the application.

## 🗄️ Database Setup

### Starting the Database
```bash
docker-compose up -d
docker ps  # Check container status
```

### Stopping the Database
```bash
docker-compose down
docker-compose down -v  # Remove volumes (deletes all data)
```

### Database Commands
```bash
# Generate Prisma Client
npm run prisma:generate

# Create new migration
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio

# Seed database
npm run prisma:seed
```

Migrations keep your database schema in sync with your Prisma schema.

**Check migration status:**
```bash
npx prisma migrate status
```

**Create a new migration:**
```bash
npx prisma migrate dev --name add_new_feature
```

**Apply migrations (production):**
```bash
npx prisma migrate deploy
```

**Reset database (WARNING: deletes all data):**
```bash
npx prisma migrate reset
```

### Seed Data

## � Authorization & Authentication

### Overview
The application implements comprehensive **Role-Based Access Control (RBAC)** to secure API routes and enforce the principle of least privilege. The authorization system consists of:

- **Authentication**: JWT-based token verification (who the user is)
- **Authorization**: Role-based access control (what the user can do)
- **Middleware**: Centralized request interception and validation

### 📋 Key Concepts: Authentication vs Authorization

| Concept | Description | Example |
|---------|-------------|---------|
| **Authentication** | Confirms who the user is | User logs in with valid email/password credentials |
| **Authorization** | Determines what actions they can perform | Only ADMIN users can delete other users |

### User Roles Hierarchy

```
ADMIN               → Full system access (all routes, all operations)
STATION_MASTER      → Station and train management
USER                → Basic access (default, own profile only)
```

**Role Hierarchy in Database (Prisma Schema):**
```prisma
enum UserRole {
  ADMIN           // Full system privileges
  STATION_MASTER  // Station and train operations
  USER            // Basic authenticated access
}

model User {
  id       Int      @id @default(autoincrement())
  email    String   @unique
  password String
  name     String
  role     UserRole @default(USER)  // Default role for new users
  // ... other fields
}
```

### Authorization Flow

```
┌─────────────────┐
│  Client Request │
│  with JWT Token │
└────────┬────────┘
         │
         ▼
┌──────────────────────────────────────────────────────┐
│         Middleware (middleware.ts)                   │
│  1. Extract token (header or cookie)                 │
│  2. Verify JWT signature                             │
│  3. Decode user info (id, email, role)               │
│  4. Check route requirements:                        │
│     - Public routes → Skip checks                    │
│     - /api/admin → Require ADMIN role                │
│     - /api/station-master → STATION_MASTER or ADMIN │
│     - Other protected → Require valid token          │
│  5. Attach user info to headers                      │
└────────┬─────────────────────────────────────────────┘
         │
         ▼
    ┌────────┐
    │Success?│
    └───┬────┘
        │
   ┌────┴────┐
   │         │
  Yes       No
   │         │
   ▼         ▼
┌──────┐  ┌──────────┐
│ Allow│  │ 401/403  │
│Access│  │  Reject  │
└───┬──┘  └──────────┘
    │
    ▼
┌────────────────────┐
│  API Route Handler │
│  Access user info  │
│  via headers       │
└────────────────────┘
```

### Protected Routes

#### Admin-Only Routes (Requires ADMIN role)
- `GET /api/admin` - Admin dashboard with system statistics
- `GET /api/admin/users` - List all users with pagination
- `POST /api/admin/users` - Create new user (including station masters)
- `GET /api/admin/users/[id]` - Get specific user details
- `PATCH /api/admin/users/[id]` - Update user role or details
- `DELETE /api/admin/users/[id]` - Delete user
- `POST /api/admin/assign-train` - Assign train to station master
- `GET /api/admin/trains` - Manage all trains in the system

#### Station Master Routes (Requires STATION_MASTER or ADMIN role)
- `GET /api/station-master/trains` - View trains assigned to their station
- `PUT /api/station-master/trains/[id]` - Update trains they manage

#### Authenticated Routes (Requires valid token)
- `/api/users/*` - User management (own profile)
- `/api/alerts/*` - Alert system
- `/api/trains/*` - Train information
- `/api/reroutes/*` - Route management

#### Public Routes (No authentication required)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Middleware Implementation

The middleware is located at `middleware.ts` in the root of the ltr directory and automatically intercepts all API requests.

**Key Features:**
- ✅ JWT token validation (from Authorization header or cookies)
- ✅ Multi-level role-based access control (ADMIN, STATION_MASTER, USER)
- ✅ User context injection via headers
- ✅ Graceful error handling with proper HTTP status codes
- ✅ Token extraction from multiple sources (header/cookie)
- ✅ Station Master access control for train management
- ✅ Role-based access control enforcement
- ✅ User context injection via headers
- ✅ Graceful error handling with proper HTTP status codes
- ✅ Token extraction from multiple sources (header/cookie)

**Headers Injected by Middleware:**
```typescript
x-user-id: "123"              // User's database ID
x-user-email: "user@example.com"  // User's email
x-user-role: "ADMIN"          // User's role
```

### Testing Authorization

#### 1. Register a User (Public)
```bash
curl -X POST http://localhost:5174/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

#### 2. Login to Get JWT Token
```bash
curl -X POST http://localhost:5174/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "john@example.com",
  "password": "SecurePass123!"
}'
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "USER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 3. Access Protected Route (Authenticated User)
```bash
# Using Authorization header
curl -X GET http://localhost:5174/api/users \
-H "Authorization: Bearer <YOUR_JWT_TOKEN>"

# Or with cookie (automatically set by login)
curl -X GET http://localhost:5174/api/users \
--cookie "token=<YOUR_JWT_TOKEN>"
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [...]
}
```

#### 4. Access Admin Route (USER Role) - Access Denied
```bash
curl -X GET http://localhost:5174/api/admin \
-H "Authorization: Bearer <USER_JWT_TOKEN>"
```

**Error Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required.",
  "errorCode": "FORBIDDEN_ACCESS"
}
```

#### 5. Access Admin Route (ADMIN Role) - Success
```bash
curl -X GET http://localhost:5174/api/admin \
-H "Authorization: Bearer <ADMIN_JWT_TOKEN>"
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Welcome Admin! Access granted to admin@example.com",
    "statistics": {
      "users": 15,
      "projects": 8,
      "teams": 5,
      "tasks": 42,
      "trains": 12,
      "alerts": 3,
      "activeAlerts": 1,
      "adminUsers": 2
    },
    "recentActivity": {
      "users": [...],
      "projects": [...]
    },
    "accessLevel": "ADMIN"
  }
}
```

#### 6. Access Without Token - Unauthorized
```bash
curl -X GET http://localhost:5174/api/admin
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Authentication required. Token missing.",
  "errorCode": "AUTH_TOKEN_MISSING"
}
```

#### 7. Access With Invalid/Expired Token
```bash
curl -X GET http://localhost:5174/api/admin \
-H "Authorization: Bearer invalid_token_here"
```

**Error Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "Invalid or expired token. Please login again.",
  "errorCode": "AUTH_TOKEN_INVALID"
}
```

### Using Authorization in Your Routes

To access authenticated user information in your API routes:

```typescript
import { NextRequest } from "next/server";
import { getAuthenticatedUser, isAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  // Get authenticated user info
  const user = getAuthenticatedUser(req);
  
  // Check if user is admin
  if (!isAdmin(req)) {
    return NextResponse.json(
      { error: "Admin access required" }, 
      { status: 403 }
    );
  }
  
  // Access user details
  console.log(user?.userId, user?.email, user?.role);
  
  // Your route logic here...
}
```

### Helper Functions (lib/auth.ts)

```typescript
// Get authenticated user info
const user = getAuthenticatedUser(req);
// Returns: { userId: number, email: string, role: string } | null

// Check roles
isAdmin(req)           // true if role is ADMIN
isProjectManager(req)  // true if ADMIN or PROJECT_MANAGER
isTeamLead(req)       // true if ADMIN, PROJECT_MANAGER, or TEAM_LEAD
hasRole(req, "USER")  // Check specific role
```

### Security Best Practices Implemented

1. **✅ Principle of Least Privilege**: Users only have access to necessary routes
2. **✅ JWT Expiration**: Tokens expire after 7 days
3. **✅ HTTP-Only Cookies**: Prevents XSS attacks
4. **✅ Password Hashing**: bcrypt with salt rounds
5. **✅ Role Hierarchy**: Clear permission structure
6. **✅ Centralized Validation**: Single middleware for all protected routes
7. **✅ Graceful Error Handling**: Descriptive error messages with proper status codes
8. **✅ Self-Deletion Prevention**: Admins cannot delete their own accounts

### Future Extensibility

Adding new roles is straightforward:

1. **Update Prisma Schema:**
```prisma
enum UserRole {
  ADMIN
  PROJECT_MANAGER
  TEAM_LEAD
  MODERATOR      // New role
  EDITOR         // New role
  USER
}
```

2. **Run Migration:**
```bash
npx prisma migrate dev --name add_new_roles
```

3. **Update Middleware** (if needed):
```typescript
const requiresModerator = protectedRoutes.moderator.some(route =>
  pathname.startsWith(route)
);
```

4. **Create Role-Specific Routes:**
```typescript
// app/api/moderator/route.ts
export async function GET(req: NextRequest) {
  // Only moderators can access
}
```

### 📸 Testing Authorization with Postman

#### Setup Instructions

1. **Import API Collection**: Use the Bruno files in `ltr/ltr/` directory or create a Postman collection
2. **Set Base URL**: `http://localhost:5174`
3. **Test Sequence**: Follow the order below for best results

#### Test Case 1: Access Admin Route Without Token (401 Unauthorized)

**Request:**
```bash
GET http://localhost:5174/api/admin
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Authentication required. Token missing.",
  "errorCode": "AUTH_TOKEN_MISSING"
}
```

**Status Code:** 401 Unauthorized

**Screenshot:** Should show "No Authorization" in Postman and 401 response

---

#### Test Case 2: Register as Regular User

**Request:**
```bash
POST http://localhost:5174/api/auth/register
Content-Type: application/json

{
  "name": "John Regular",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 5,
    "name": "John Regular",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

**Status Code:** 201 Created

---

#### Test Case 3: Login as Regular User

**Request:**
```bash
POST http://localhost:5174/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 5,
    "email": "john@example.com",
    "name": "John Regular",
    "role": "USER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzM0NTQ2MDAwLCJleHAiOjE3MzUxNTA4MDB9.abc123..."
}
```

**Action:** Copy the token value for subsequent requests

---

#### Test Case 4: Access Admin Route with USER Token (403 Forbidden)

**Request:**
```bash
GET http://localhost:5174/api/admin
Authorization: Bearer <USER_TOKEN>
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required.",
  "errorCode": "FORBIDDEN_ACCESS"
}
```

**Status Code:** 403 Forbidden

**Screenshot:** Should show the token in Authorization header but access denied with 403

**Key Learning:** This demonstrates **authorization** - user is authenticated (valid token) but not authorized (wrong role)

---

#### Test Case 5: Access Users Route with USER Token (200 Success)

**Request:**
```bash
GET http://localhost:5174/api/users/5
Authorization: Bearer <USER_TOKEN>
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "name": "John Regular",
    "email": "john@example.com",
    "role": "USER",
    "createdAt": "2024-12-18T10:30:00.000Z"
  }
}
```

**Status Code:** 200 OK

**Key Learning:** USER can access their own profile (authenticated route, not admin-only)

---

#### Test Case 6: Login as Admin

**Request:**
```bash
POST http://localhost:5174/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Note:** Use credentials from your seeded database

**Expected Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "ADMIN"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3MzQ1NDYwMDAsImV4cCI6MTczNTE1MDgwMH0.xyz789..."
}
```

**Action:** Copy the admin token

---

#### Test Case 7: Access Admin Route with ADMIN Token (200 Success)

**Request:**
```bash
GET http://localhost:5174/api/admin
Authorization: Bearer <ADMIN_TOKEN>
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "message": "Welcome Admin! Access granted to admin@example.com",
    "statistics": {
      "users": 15,
      "projects": 8,
      "teams": 5,
      "tasks": 42,
      "trains": 12,
      "alerts": 3,
      "activeAlerts": 1,
      "adminUsers": 2
    },
    "recentActivity": {
      "users": [...],
      "projects": [...]
    },
    "accessLevel": "ADMIN"
  }
}
```

**Status Code:** 200 OK

**Key Learning:** ADMIN role has full access to admin-only routes

---

#### Test Case 8: Access with Invalid Token (403 Forbidden)

**Request:**
```bash
GET http://localhost:5174/api/admin
Authorization: Bearer invalid_token_12345
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Invalid or expired token. Please login again.",
  "errorCode": "AUTH_TOKEN_INVALID",
  "details": "jwt malformed"
}
```

**Status Code:** 403 Forbidden

---

### 📊 Test Results Summary Table

| Test Case | Route | Token | Expected Status | Result | Key Learning |
|-----------|-------|-------|-----------------|--------|--------------|
| 1 | `/api/admin` | None | 401 | ❌ Unauthorized | Must provide token |
| 2 | `/api/auth/register` | None | 201 | ✅ Success | Public route |
| 3 | `/api/auth/login` | None | 200 | ✅ Success | Public route, returns token |
| 4 | `/api/admin` | USER token | 403 | ❌ Forbidden | Wrong role (authorization) |
| 5 | `/api/users/5` | USER token | 200 | ✅ Success | Authenticated route |
| 6 | `/api/auth/login` | None | 200 | ✅ Success | Admin login |
| 7 | `/api/admin` | ADMIN token | 200 | ✅ Success | Correct role |
| 8 | `/api/admin` | Invalid | 403 | ❌ Forbidden | Invalid token |

---

### 🎯 Reflection: Authorization Best Practices

> **"Authorization isn't just about blocking users — it's about designing trust boundaries that scale with your application's growth."**

#### Key Principles Implemented

**1. Principle of Least Privilege**
- Users receive minimum necessary permissions by default (USER role)
- ADMIN access is granted only when explicitly needed
- Station Masters have limited scope (station operations only)
- Each role has clearly defined boundaries

**2. Defense in Depth**
- JWT validation at middleware level (first line of defense)
- Role checks in middleware (second line)
- Additional permission checks in route handlers (third line)
- Database constraints enforce data integrity (final line)

**3. Fail Secure**
- Default deny: Routes are protected unless explicitly made public
- Invalid tokens → 403 Forbidden (not 200 with error message)
- Missing tokens → 401 Unauthorized (clear error state)
- Wrong role → 403 Forbidden with descriptive message

**4. Separation of Concerns**
- Authentication: Handled by `/api/auth/*` routes
- Authorization: Enforced by `middleware.ts`
- Business Logic: Contained in individual route handlers
- Data Validation: Managed by Zod schemas

**5. Centralized Security**
- Single middleware file controls all authorization
- Consistent error responses across all routes
- Easy to audit and maintain
- Role changes only require middleware update

#### Why Role-Based Access Control (RBAC)?

**Scalability:**
- Adding new roles (e.g., MODERATOR, EDITOR) is straightforward
- No need to modify individual route handlers
- Roles can be assigned/revoked dynamically

**Maintainability:**
- Clear mental model: "What can this role do?"
- Less code duplication (vs permission checks in every route)
- Changes to permissions are centralized

**Security:**
- Easier to audit ("Show me all admin routes")
- Reduces attack surface (fewer permission checks = fewer bugs)
- Industry standard approach (well-understood pattern)

#### Future Extensibility

**Adding New Roles:**
```prisma
enum UserRole {
  ADMIN
  STATION_MASTER
  MODERATOR      // New role for content moderation
  EDITOR         // New role for content editing
  USER
}
```

**Then update middleware:**
```typescript
const protectedRoutes = {
  admin: ["/api/admin"],
  moderator: ["/api/moderate"],
  editor: ["/api/edit"],
  authenticated: ["/api/users", "/api/trains", /* ... */]
};
```

**No changes needed in existing routes!**

#### Common Pitfalls Avoided

✅ **Token in Header AND Cookie**: Supports both web and API clients  
✅ **User Context Injection**: Routes receive user info via headers  
✅ **Graceful Error Messages**: Users know exactly what went wrong  
✅ **Self-Deletion Prevention**: Admins cannot delete themselves  
✅ **Token Expiration**: 7-day expiry prevents stolen token abuse  
✅ **HTTP-Only Cookies**: Prevents XSS attacks on web clients  

#### Takeaways

- **Authentication** verifies identity (who you are)
- **Authorization** enforces permissions (what you can do)  
- Middleware provides **consistent**, **centralized** security
- Role-based systems **scale better** than permission-based systems
- Proper error messages improve **developer experience**
- Security is not optional — it's **foundational**

---

### 📁 Screenshots Documentation

For complete documentation, include the following screenshots in your project documentation:

1. **Postman Collection Structure**
   - Show organized folders: Auth, Admin, Users, etc.
   - Environment variables setup

2. **Test Case 1**: No token → 401 response
   - Show empty Authorization header
   - Highlight 401 status code and error message

3. **Test Case 4**: USER token on admin route → 403
   - Show Bearer token in header
   - Highlight "Access denied" message
   - Show 403 status code

4. **Test Case 7**: ADMIN token on admin route → 200
   - Show Bearer token in header
   - Show successful response with statistics
   - Highlight 200 status code

5. **Bruno API Client** (if using)
   - Show `.bru` files in project
   - Environment configuration

6. **Database View** (Prisma Studio)
   - Show User table with different roles
   - Highlight role column

Save screenshots to `ltr/screenshots/` directory with descriptive names:
- `01-no-token-401.png`
- `02-user-token-admin-route-403.png`
- `03-admin-token-admin-route-200.png`
- `04-prisma-studio-users-roles.png`

---

### Reflection: Why Authorization Matters

> "Authorization isn't just about blocking users — it's about designing trust boundaries that scale with your application's growth."

**Key Takeaways:**
- Authentication verifies identity (who you are)
- Authorization enforces permissions (what you can do)
- Middleware provides consistent, centralized security
- Role-based systems scale better than permission-based systems
- Proper error messages improve developer experience
- Security is not optional — it's foundational

## �💻 Development

### Available Scripts
- `npm run dev` - Start development server on port 5174
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:seed` - Seed database

### Project Structure
```
ltr/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API routes
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Home page
│   └── lib/              # Shared utilities
│       ├── prisma.ts     # Prisma client
│       ├── errorCodes.ts # Error codes
│       ├── responseHandler.ts # API response helpers
│       └── schemas/      # Zod validation schemas
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── seed.ts           # Database seeder
│   └── migrations/       # Migration history
├── public/               # Static assets
├── docker-compose.yml    # Docker configuration
└── package.json          # Dependencies and scripts
```

## 🔧 Technologies Used

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL 15
- **ORM**: Prisma 5
- **Validation**: Zod 4
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Styling**: Tailwind CSS 4
- **TypeScript**: TypeScript 5
- **Code Quality**: ESLint, Prettier, Husky, lint-staged

## 📚 Documentation

For detailed implementation documentation, see:

### Authorization & Security
- **[AUTHORIZATION_QUICK_REFERENCE.md](./AUTHORIZATION_QUICK_REFERENCE.md)** - Quick reference for developers
- **[AUTHORIZATION_TESTING_GUIDE.md](./AUTHORIZATION_TESTING_GUIDE.md)** - Complete testing guide with examples
- **[AUTHORIZATION_ARCHITECTURE.md](./AUTHORIZATION_ARCHITECTURE.md)** - System architecture and design

### Validation & Testing
- **[VALIDATION_TESTING.md](./VALIDATION_TESTING.md)** - Validation test cases
- **[QUICKSTART_TESTING.md](./QUICKSTART_TESTING.md)** - Quick testing guide
- **[ZOD_IMPLEMENTATION_SUMMARY.md](./ZOD_IMPLEMENTATION_SUMMARY.md)** - Zod implementation details
- **[TEST_DATA.md](./TEST_DATA.md)** - Test data and examples

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL container is running
docker ps

# Restart database container
docker restart postgres_db

# View database logs
docker logs postgres_db
```

### Migration Issues
```bash
# Check migration status
npx prisma migrate status

# Reset database (WARNING: deletes data)
npx prisma migrate reset

# Force apply migrations
npx prisma migrate deploy
```

### Port Already in Use
If port 5174 is already in use, modify `package.json`:
```json
"scripts": {
  "dev": "next dev -p 3000"
}
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Zod Documentation](https://zod.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🚢 Deployment

The easiest way to deploy is using [Vercel](https://vercel.com/new):

1. Push your code to GitHub
2. Import repository in Vercel
3. Configure environment variables
4. Deploy

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

**Note**: This is the technical implementation directory. For project overview, architecture, and assignment documentation, see the [main README](../README.md) in the root directory.

