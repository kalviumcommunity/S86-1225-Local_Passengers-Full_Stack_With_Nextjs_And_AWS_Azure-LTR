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

### User Roles Hierarchy

```
ADMIN               → Full system access
PROJECT_MANAGER     → Project and team management
TEAM_LEAD          → Team and task management  
USER               → Basic access (default)
```

### Authorization Flow

```
┌─────────────────┐
│  Client Request │
│  with JWT Token │
└────────┬────────┘
         │
         ▼
┌────────────────────────────────────────┐
│         Middleware (middleware.ts)     │
│  1. Extract token (header or cookie)   │
│  2. Verify JWT signature               │
│  3. Decode user info (id, email, role) │
│  4. Check route requirements           │
│     - Public routes → Skip checks      │
│     - Protected → Require valid token  │
│     - Admin → Require ADMIN role       │
│  5. Attach user info to headers        │
└────────┬───────────────────────────────┘
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
- `POST /api/admin/users` - Create new user
- `GET /api/admin/users/[id]` - Get specific user details
- `PATCH /api/admin/users/[id]` - Update user role or details
- `DELETE /api/admin/users/[id]` - Delete user

#### Authenticated Routes (Requires valid token)
- `/api/users/*` - User management
- `/api/projects/*` - Project management
- `/api/tasks/*` - Task management
- `/api/teams/*` - Team management
- `/api/alerts/*` - Alert system
- `/api/trains/*` - Train operations
- `/api/reroutes/*` - Route management
- `/api/transactions/*` - Transaction handling
- `/api/query-optimization/*` - Query optimization

#### Public Routes (No authentication required)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Middleware Implementation

The middleware is located at `middleware.ts` in the root of the ltr directory and automatically intercepts all API requests.

**Key Features:**
- ✅ JWT token validation (from Authorization header or cookies)
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

## � Redis Caching Layer

### Overview
This project implements Redis as a caching layer to improve API performance and reduce database load. Caching significantly reduces response latency for frequently accessed data.

### Why Caching?
- **Reduced Latency**: Cache hits serve data in milliseconds vs database queries
- **Lower DB Load**: Fewer database connections and queries
- **Better Scalability**: Handles high traffic more efficiently
- **Cost Effective**: Reduces compute and database costs

### Cache Implementation

#### Setup
Redis connection is configured in `src/lib/redis.ts`:
```typescript
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    return Math.min(times * 50, 2000);
  },
});

export default redis;
```

#### Cached Endpoints

##### 1. Trains API (`/api/trains`)
- **TTL**: 120 seconds (2 minutes)
- **Cache Key Pattern**: `trains:list:page={page}:limit={limit}:source={source}:dest={destination}`
- **Strategy**: Cache-aside pattern
- **Invalidation**: On train status updates

```typescript
// Cache hit example
const cachedData = await redis.get(cacheKey);
if (cachedData) {
  return sendSuccess(JSON.parse(cachedData), "From cache", 200);
}

// Cache miss - fetch and store
const data = await fetchTrains();
await redis.set(cacheKey, JSON.stringify(data), "EX", 120);
```

##### 2. Users API (`/api/admin/users`)
- **TTL**: 90 seconds
- **Cache Key Pattern**: `users:station-masters:page={page}:limit={limit}`
- **Invalidation**: On user creation or updates

#### Cache Invalidation Strategy

We use **active invalidation** - when data changes, we immediately clear related cache:

```typescript
// Invalidate all trains cache
const pattern = "trains:list:*";
const keys = await redis.keys(pattern);
if (keys.length > 0) {
  await redis.del(...keys);
  console.log(`🗑️ Cache invalidated: ${keys.length} keys deleted`);
}
```

**Invalidation Triggers:**
- Train status update → Clear all trains cache
- User creation → Clear users cache
- Train assignment → Clear trains cache

### Performance Metrics

#### Test Results
Run the cache test script:
```bash
node test-cache.js
```

**Expected Improvements:**
- Cold start (cache miss): ~80-150ms
- Cache hit: ~5-15ms
- **Speed improvement: 85-95%** (10-20x faster)

#### Real-World Impact
```
Without Cache:
- 1000 requests → 1000 DB queries
- Response time: ~100ms average
- Database load: HIGH

With Cache (120s TTL):
- 1000 requests → ~8 DB queries (120s windows)
- Response time: ~10ms average
- Database load: LOW
```

### Cache Coherence & Stale Data

#### Risks
- **Stale Data**: Users might see outdated info between updates and cache expiry
- **Inconsistency**: Multiple cache keys may have different versions

#### Mitigation Strategies
1. **Active Invalidation**: Clear cache immediately on updates
2. **Short TTL**: 90-120 seconds keeps data relatively fresh
3. **Pattern Matching**: Use wildcard keys to invalidate related caches
4. **Versioning**: Include timestamps in cache keys for critical data

#### When NOT to Cache
- User authentication tokens (security risk)
- Real-time critical data (payment status, live location)
- Personalized user data with PII
- Data that changes frequently (< 30s intervals)

### TTL (Time-To-Live) Policy

| Data Type | TTL | Reasoning |
|-----------|-----|-----------|
| Train List | 120s | Train schedules change moderately |
| User List | 90s | User data relatively static |
| Train Details | 60s | Individual train status may change faster |
| Public Routes | 300s | Route data rarely changes |

### Running Redis Locally

#### Install Redis
**Windows (via Chocolatey):**
```bash
choco install redis-64
```

**Windows (via WSL):**
```bash
wsl --install
sudo apt update
sudo apt install redis-server
sudo service redis-server start
```

**macOS:**
```bash
brew install redis
brew services start redis
```

**Linux:**
```bash
sudo apt install redis-server
sudo systemctl start redis
```

#### Verify Redis
```bash
redis-cli ping
# Should return: PONG
```

#### Monitor Cache
```bash
# View all keys
redis-cli keys "*"

# Get value
redis-cli get "trains:list:page=1:limit=10:source=all:dest=all"

# Monitor live commands
redis-cli monitor

# Check cache stats
redis-cli info stats
```

### Environment Variables
Add to `.env`:
```env
REDIS_URL="redis://localhost:6379"
# Or for Redis Cloud:
# REDIS_URL="redis://username:password@hostname:port"
```

### Production Considerations

#### Redis Cloud Services
- **Redis Cloud** (Managed Redis)
- **AWS ElastiCache**
- **Azure Cache for Redis**
- **Google Cloud Memorystore**

#### Cache Clustering
For high availability, use Redis Cluster or Sentinel mode:
```typescript
const redis = new Redis.Cluster([
  { host: 'node1', port: 6379 },
  { host: 'node2', port: 6379 },
  { host: 'node3', port: 6379 },
]);
```

#### Monitoring
Track these metrics:
- Cache hit ratio (aim for >80%)
- Average response time improvement
- Memory usage
- Eviction rate

### Reflection

#### What Worked Well
✅ Significant latency reduction (10-20x faster)
✅ Reduced database load and connection pooling issues
✅ Simple implementation with ioredis
✅ Pattern-based invalidation ensures consistency

#### Challenges & Solutions
⚠️ **Challenge**: Stale data risk
✅ **Solution**: Active invalidation + short TTL

⚠️ **Challenge**: Cache key management
✅ **Solution**: Structured naming convention with patterns

⚠️ **Challenge**: Memory management
✅ **Solution**: Set appropriate TTLs and maxmemory-policy

#### Future Improvements
- Implement cache warming on startup
- Add cache statistics dashboard
- Use Redis Pub/Sub for distributed cache invalidation
- Implement tiered caching (Redis + CDN)
- Add cache compression for large payloads

### Key Learnings
> "Cache is like short-term memory — it makes things fast, but only if you remember to forget at the right time."

- Caching is not a silver bullet - choose what to cache wisely
- Invalidation strategy is as important as caching itself
- Monitor cache hit ratio to validate effectiveness
- Balance between performance and data freshness
- TTL should match data volatility

---

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Redis Documentation](https://redis.io/docs)
- [Zod Documentation](https://zod.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🚢 Deployment

The easiest way to deploy is using [Vercel](https://vercel.com/new):

1. Push your code to GitHub
2. Import repository in Vercel
3. Configure environment variables (including REDIS_URL)
4. Deploy

See [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

**Note**: This is the technical implementation directory. For project overview, architecture, and assignment documentation, see the [main README](../README.md) in the root directory.

