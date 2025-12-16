# Local Train Passengers Management System

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Database Setup](#database-setup)
- [Migration & Seeding](#migration--seeding)
- [Global API Response Handler](#global-api-response-handler)
- [Development](#development)
- [Learn More](#learn-more)
- [Deployment](#deployment)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Docker and Docker Compose
- PostgreSQL (via Docker)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ltr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start Docker containers**
   ```bash
   docker-compose up -d
   ```

4. **Set up environment variables**
   Create a `.env` file (if not exists):
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/ltr"
   ```

5. **Run database migrations**
   ```bash
   npm run prisma:migrate
   # or
   npx prisma migrate deploy
   ```

6. **Seed the database**
   ```bash
   npx prisma db seed
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 🗄️ Database Setup

This project uses **PostgreSQL** with **Prisma ORM** for database management.

### Starting the Database

```bash
# Start all containers (PostgreSQL, Redis, Next.js app)
docker-compose up -d

# Check container status
docker ps

# View database logs
docker logs postgres_db
```

### Stopping the Database

```bash
# Stop all containers
docker-compose down

# Stop and remove volumes (WARNING: deletes all data)
docker-compose down -v
```

## 🔄 Migration & Seeding

### Database Migrations

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

The project includes a comprehensive seed script that populates the database with test data.

**Run seed script:**
```bash
npx prisma db seed
# or
npm run prisma:seed
```

**What gets seeded:**
- 4 Users (with different roles)
- 2 Teams (Frontend & Backend)
- 3 Tags (Bug, Feature, Documentation)
- 2 Projects (passenger management scenarios)
- 5 Tasks (various statuses and priorities)
- 3 Subtasks
- 3 Comments
- 3 Notifications

**Seed output:**
```
🌱 Seeding database...
✅ Created 4 users
✅ Created 2 teams with members
✅ Created 3 tags
✅ Created 2 projects with tags
✅ Created 3 tasks for project 1
✅ Created 2 tasks for project 2
✅ Created 3 subtasks
✅ Created 3 comments
✅ Created 3 notifications
🎉 Database seeding completed successfully!

📊 Database Summary:
   Users: 4
   Teams: 2
   Projects: 2
   Tasks: 5
   Comments: 3
   Notifications: 3
```

### Prisma Studio

Open Prisma Studio to view and edit your database visually:

```bash
npx prisma studio
# or
npm run prisma:studio
```

This will open a browser at `http://localhost:5555` with a GUI to view all your data.

### Migration Workflow Summary

| Command | Purpose | Environment |
|---------|---------|-------------|
| `npx prisma migrate dev` | Create & apply migrations | Development |
| `npx prisma migrate deploy` | Apply migrations | Production |
| `npx prisma migrate reset` | Reset database & re-seed | Development |
| `npx prisma db seed` | Populate test data | Development |
| `npx prisma studio` | Visual database browser | All |
| `npx prisma generate` | Regenerate Prisma Client | After schema changes |

📚 **Detailed documentation:** See [MIGRATIONS_AND_SEEDING.md](./MIGRATIONS_AND_SEEDING.md) for comprehensive migration and seeding documentation including:
- Complete workflow guide
- Rollback procedures
- Production safety guidelines
- Troubleshooting tips

## 💻 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Prisma commands
npm run prisma:generate   # Regenerate Prisma Client
npm run prisma:migrate    # Run migrations
npm run prisma:studio     # Open Prisma Studio
npm run prisma:seed       # Seed database
```

### Project Structure

```
ltr/
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── seed.ts                 # Seed script
│   └── migrations/             # Migration history
│       ├── migration_lock.toml
│       └── 0_init/
│           └── migration.sql
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── lib/
│       └── prisma.ts          # Prisma client instance
├── docker-compose.yml          # Docker services
├── Dockerfile
├── package.json
├── MIGRATIONS_AND_SEEDING.md  # Detailed migration docs
├── SETUP_GUIDE.md
└── README.md
```

## 📖 Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial
- [Prisma Documentation](https://www.prisma.io/docs/) - learn about Prisma ORM
- [PostgreSQL Documentation](https://www.postgresql.org/docs/) - PostgreSQL database
- [Docker Documentation](https://docs.docker.com/) - containerization

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 🚢 Deployment

### Production Checklist

Before deploying to production:

- [ ] Set up production PostgreSQL database
- [ ] Configure production environment variables
- [ ] Run `npx prisma migrate deploy` (NEVER use `migrate dev`)
- [ ] Do NOT run seed script in production
- [ ] Set up database backups
- [ ] Configure monitoring and logging
- [ ] Test all API endpoints

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

**Important for Vercel deployment:**
1. Add PostgreSQL database (Vercel Postgres or external)
2. Set `DATABASE_URL` environment variable
3. Run migrations as part of build process:
   ```json
   "scripts": {
     "vercel-build": "prisma generate && prisma migrate deploy && next build"
   }
   ```

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## � Database Optimization & Transactions (Assignment 2.16)

### Indexes Added for Query Performance

Strategic indexes added to optimize frequently queried fields:

- **User**: `email` (unique lookups), `role` (filtering), `createdAt` (sorting)
- **Notification**: `userId`, `read` (combined for unread notifications), `createdAt` (recent queries)
- **Project, Task, Team**: Existing indexes on foreign keys (`createdBy`, `teamId`, `status`, `priority`)

**Migration Command:**
```bash
npx prisma migrate dev --name add_performance_indexes
```

### Transactions with Rollback

Implemented in `/src/app/api/transactions/route.ts`:

**Scenario**: Creating a project with team and initial setup
- All operations (team, project, task creation) execute atomically
- If any operation fails, Prisma automatically rolls back all changes
- Maintains data consistency and prevents partial writes

**Endpoints:**
```bash
# Execute successful transaction
POST http://localhost:3000/api/transactions
Body: {
  "projectName": "New Project",
  "teamName": "Development Team",
  "userIds": [1, 2, 3]
}

# Demo rollback behavior
GET http://localhost:3000/api/transactions/demo?mode=rollback
```

### Query Optimization

Implemented in `/src/app/api/query-optimization/route.ts`:

**Best Practices Applied:**
- ✅ **Field Selection**: Only select necessary fields (avoid over-fetching)
- ✅ **Pagination**: Use `skip/take` for scalable data retrieval
- ✅ **Indexed Queries**: Filter by indexed fields (`status`, `read`, `createdAt`)
- ✅ **Batch Operations**: Use `createMany()` for bulk inserts

**Endpoints:**
```bash
# Optimized queries with field selection
GET http://localhost:3000/api/query-optimization?mode=optimized&page=1

# Compare with inefficient approach (N+1 queries, over-fetching)
GET http://localhost:3000/api/query-optimization?mode=inefficient

# Batch create operations
POST http://localhost:3000/api/query-optimization/batch
Body: { "tags": ["Frontend", "Backend", "Database"] }
```

## 🔌 RESTful API Routes (Assignment 2.17)

### API Route Hierarchy

```
/api/
├── users/
│   ├── route.ts         (GET all, POST create)
│   └── [id]/route.ts    (GET by ID, PUT update, DELETE)
├── projects/
│   ├── route.ts         (GET all, POST create)
│   └── [id]/route.ts    (GET by ID, PUT update, DELETE)
├── tasks/
│   ├── route.ts         (GET all, POST create)
│   └── [id]/route.ts    (GET by ID, PUT update, DELETE)
├── teams/
│   ├── route.ts         (GET all, POST create)
│   └── [id]/route.ts    (GET by ID, PUT update, DELETE)
└── transactions/
    └── route.ts         (POST transactions, GET demo)
```

### Naming Conventions Applied

- ✅ **Resource-based**: Use nouns (users, projects, tasks) not verbs (getUsers, createProject)
- ✅ **Consistent pluralization**: All endpoints use plural resource names
- ✅ **Lowercase paths**: All routes lowercase and kebab-case for nested resources
- ✅ **HTTP verb semantics**: GET (read), POST (create), PUT (update), DELETE (remove)
- ✅ **Predictable hierarchy**: Resource then ID then sub-resources

### HTTP Status Codes Used

| Code | Usage |
|------|-------|
| **200** | Successful GET/PUT/DELETE request |
| **201** | Successful POST (resource created) |
| **400** | Bad request (missing/invalid parameters) |
| **404** | Resource not found |
| **500** | Internal server error |

### Users Endpoints

```bash
# Get all users (with pagination)
GET /api/users?page=1&limit=10
GET /api/users?role=ADMIN  # Filter by role

# Create a new user
POST /api/users
Body: {
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "1234567890",
  "role": "PROJECT_MANAGER"
}

# Get user by ID (with counts)
GET /api/users/1

# Update user
PUT /api/users/1
Body: { "name": "Updated Name", "phone": "0987654321" }

# Delete user
DELETE /api/users/1
```

### Projects Endpoints

```bash
# Get all projects (with pagination and filtering)
GET /api/projects?page=1&limit=10
GET /api/projects?status=IN_PROGRESS  # Filter by status

# Create a project
POST /api/projects
Body: {
  "name": "Local Passengers App",
  "description": "Transport management system",
  "status": "PLANNING",
  "createdBy": 1,
  "budget": 50000,
  "location": "Mumbai"
}

# Get project details
GET /api/projects/1

# Update project
PUT /api/projects/1
Body: { "status": "IN_PROGRESS", "budget": 60000 }

# Delete project
DELETE /api/projects/1
```

### Tasks Endpoints

```bash
# Get all tasks with filtering
GET /api/tasks?page=1&limit=10
GET /api/tasks?status=TODO&priority=HIGH
GET /api/tasks?projectId=1  # Filter by project

# Create a task
POST /api/tasks
Body: {
  "title": "Setup Database",
  "description": "Initialize PostgreSQL database",
  "status": "TODO",
  "priority": "HIGH",
  "projectId": 1,
  "assignedTo": 2,
  "dueDate": "2025-12-31"
}

# Get task with comments and subtasks
GET /api/tasks/1

# Update task
PUT /api/tasks/1
Body: { "status": "IN_PROGRESS", "priority": "URGENT" }

# Delete task
DELETE /api/tasks/1
```

### Teams Endpoints

```bash
# Get all teams
GET /api/teams?page=1&limit=10

# Create a team
POST /api/teams
Body: {
  "name": "Frontend Team",
  "description": "Responsible for UI/UX",
  "createdBy": 1
}

# Get team with members and projects
GET /api/teams/1

# Update team
PUT /api/teams/1
Body: { "description": "Updated description" }

# Delete team
DELETE /api/teams/1
```

### Pagination Pattern (All List Endpoints)

All GET endpoints follow consistent pagination:

```bash
GET /api/resource?page=1&limit=10

Response:
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

### Error Response Format (Consistent Across All Endpoints)

```bash
GET /api/users/999

Response (404):
{
  "error": "User not found"
}

Response (400):
{
  "error": "Email and name are required"
}
```

### Benefits of This Structure

- **Predictability**: Developers can guess endpoint URL without documentation
- **Consistency**: Same pattern applied across all resources
- **Scalability**: Easy to add new resources following same conventions
- **Integration**: Clear contracts reduce client-server integration errors
- **Maintenance**: Reduced cognitive load when onboarding new developers



### Anti-patterns Avoided

- ❌ N+1 queries: Instead of fetching all relations, we fetch counts and batch
- ❌ Over-fetching: Use `select` to get only needed fields
- ❌ Missing indexes: Added composite and single-column indexes for common queries
- ❌ Unbounded queries: All queries include pagination with `take/skip`
## 🌐 Global API Response Handler

### Overview

This project implements a **standardized API response structure** across all endpoints to ensure consistency, improve developer experience, and enhance observability in production.

Every API endpoint returns responses in a predictable format, making it easier for frontend developers to handle results and errors uniformly.

### Why Standardized Responses Matter

Without a standard response format, different endpoints might return data in different shapes, leading to:
- **Inconsistent Error Handling**: Frontend must adapt to various error formats
- **Difficult Debugging**: No standard way to track and log errors
- **Poor Developer Experience**: Increased code complexity and maintenance cost
- **Unpredictable Integration**: API consumers cannot rely on consistent structure

### Unified Response Envelope

All API responses follow this structure:

#### Success Response Format
```typescript
{
  "success": true,
  "message": string,
  "data": any,
  "timestamp": string (ISO 8601)
}
```

#### Error Response Format
```typescript
{
  "success": false,
  "message": string,
  "error": {
    "code": string,
    "details"?: any
  },
  "timestamp": string (ISO 8601)
}
```

### Response Handler Utility

Located at: `src/lib/responseHandler.ts`

The utility provides helper functions for consistent responses:

```typescript
// Success responses
sendSuccess(data, message?, status?)
sendSuccess(users, "Users fetched successfully", 200)

// Generic error
sendError(message, code, status, details?)

// Specific error helpers
sendValidationError(message, details?)     // 400
sendAuthError(message, details?)           // 401
sendForbiddenError(message, details?)      // 403
sendNotFoundError(message, details?)       // 404
sendConflictError(message, details?)       // 409
sendDatabaseError(message, details?)       // 500
sendExternalAPIError(message, details?)    // 502
```

### Error Codes

Located at: `src/lib/errorCodes.ts`

All errors use standardized error codes for easy tracking and debugging:

| Code Range | Category | Examples |
|------------|----------|----------|
| E001-E099 | Validation Errors | `E001`: Validation Error, `E002`: Missing Required Field |
| E100-E199 | Authentication Errors | `E100`: Auth Error, `E101`: Invalid Credentials |
| E200-E299 | Authorization Errors | `E200`: Forbidden, `E201`: Insufficient Permissions |
| E300-E399 | Resource Errors | `E300`: Not Found, `E301`: User Not Found |
| E400-E499 | Conflict Errors | `E400`: Conflict, `E401`: User Already Exists |
| E500-E599 | Database Errors | `E500`: Database Error, `E502`: Query Failed |
| E600-E699 | External API Errors | `E600`: External API Error, `E601`: Railway API Error |
| E700-E799 | Server Errors | `E700`: Internal Error, `E702`: Service Unavailable |
| E800-E899 | Business Logic Errors | `E800`: Operation Failed, `E801`: Alert Creation Failed |

### Implementation Examples

#### Example 1: GET /api/trains

```typescript
import { sendSuccess, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";

export async function GET(req: NextRequest) {
  try {
    const trains = await fetchTrainsFromAPI();
    return sendSuccess(
      { trains, pagination: {...} },
      "Trains fetched successfully"
    );
  } catch (err) {
    return sendError(
      "Failed to fetch trains",
      ERROR_CODES.TRAIN_FETCH_FAILED,
      500,
      err
    );
  }
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Trains fetched successfully",
  "data": {
    "trains": [
      {
        "trainId": "12301",
        "trainName": "Howrah Rajdhani Express",
        "source": "New Delhi",
        "destination": "Howrah"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  },
  "timestamp": "2025-12-16T10:00:00.000Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Failed to fetch trains",
  "error": {
    "code": "E802",
    "details": "Network timeout"
  },
  "timestamp": "2025-12-16T10:00:00.000Z"
}
```

#### Example 2: POST /api/auth/register

```typescript
import {
  sendSuccess,
  sendValidationError,
  sendConflictError,
  sendError,
} from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return sendValidationError("Email and password are required");
    }
    
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return sendConflictError("User with this email already exists");
    }
    
    const user = await createUser({ email, password });
    return sendSuccess(user, "User registered successfully", 201);
    
  } catch (err) {
    return sendError(
      "Failed to register user",
      ERROR_CODES.USER_CREATION_FAILED,
      500,
      err
    );
  }
}
```

**Validation Error Response (400):**
```json
{
  "success": false,
  "message": "Email and password are required",
  "error": {
    "code": "E001"
  },
  "timestamp": "2025-12-16T10:00:00.000Z"
}
```

**Conflict Error Response (409):**
```json
{
  "success": false,
  "message": "User with this email already exists",
  "error": {
    "code": "E401"
  },
  "timestamp": "2025-12-16T10:00:00.000Z"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2025-12-16T10:00:00.000Z"
  },
  "timestamp": "2025-12-16T10:00:00.000Z"
}
```

#### Example 3: GET /api/alerts

```typescript
import { sendSuccess, sendAuthError, sendError } from "@/lib/responseHandler";
import { ERROR_CODES } from "@/lib/errorCodes";

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    
    if (!user) {
      return sendAuthError("Not authenticated");
    }
    
    const alerts = await prisma.alert.findMany({
      where: { userId: user.userId }
    });
    
    return sendSuccess(alerts, "Alerts fetched successfully");
    
  } catch (err) {
    return sendError(
      "Failed to fetch alerts",
      ERROR_CODES.DATABASE_ERROR,
      500,
      err
    );
  }
}
```

**Auth Error Response (401):**
```json
{
  "success": false,
  "message": "Not authenticated",
  "error": {
    "code": "E100"
  },
  "timestamp": "2025-12-16T10:00:00.000Z"
}
```

### API Routes Using Global Handler

The following routes have been updated to use the standardized response handler:

1. **Authentication Routes**
   - `POST /api/auth/register` - User registration
   - `POST /api/auth/login` - User login

2. **Train Routes**
   - `GET /api/trains` - Fetch trains with pagination

3. **Alert Routes**
   - `GET /api/alerts` - Fetch user alerts
   - `POST /api/alerts` - Create new alert

### Benefits of This Approach

#### 1. **Developer Experience (DX)**
- **Predictable Structure**: Frontend developers always know what to expect
- **Easy Debugging**: Error codes and timestamps make tracking issues simple
- **Reduced Boilerplate**: Reusable helpers reduce repetitive code
- **Type Safety**: TypeScript types ensure correct usage

#### 2. **Observability & Monitoring**
- **Consistent Logging**: All errors follow same format for log aggregation
- **Error Tracking**: Error codes enable easy integration with Sentry/Datadog
- **Timestamp Tracking**: ISO timestamps help correlate issues across services
- **Details Field**: Captures additional context for debugging

#### 3. **Maintainability**
- **Single Source of Truth**: All response logic in one place
- **Easy Updates**: Change format once, affects all endpoints
- **Code Consistency**: New developers follow established patterns
- **Testing**: Predictable structure simplifies test assertions

#### 4. **Production Readiness**
- **API Documentation**: Easy to document with consistent structure
- **Client Integration**: Mobile/web apps handle responses uniformly
- **Monitoring Dashboards**: Standard format enables metric tracking
- **Error Alerting**: Error codes trigger appropriate alerts

### Testing the Response Handler

Use the provided test data files:
- [comprehensive-testing.bru](ltr/comprehensive-testing.bru) - Bruno API test collection
- [test-data.json](test-data.json) - Sample test data
- [TEST_DATA.md](TEST_DATA.md) - Documentation with examples

### Best Practices

1. **Always use helper functions** - Don't create responses manually
2. **Use appropriate error codes** - Follow the defined code categories
3. **Include meaningful messages** - Help users understand what went wrong
4. **Add details for debugging** - Include error objects in non-production
5. **Log errors** - Console log before returning error responses
6. **Be consistent** - All endpoints must follow the same format

### Reflection: Why This Matters

The global response handler is like proper punctuation in writing — it doesn't just make individual sentences (endpoints) readable; it makes your entire story (application) coherent and professional.

By standardizing responses:
- **Frontend teams** can build robust error handling once, not per endpoint
- **DevOps teams** can set up monitoring and alerting with confidence
- **QA teams** can write consistent test assertions
- **Future developers** can understand the API contract instantly

This investment in structure pays dividends in reduced debugging time, faster feature development, and improved production stability.
## �🛠️ Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL container is running
docker ps

# Restart database container
docker restart postgres_db

# View database logs
docker logs postgres_db
```

