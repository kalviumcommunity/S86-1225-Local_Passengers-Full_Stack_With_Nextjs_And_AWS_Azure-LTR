# Local Train Passengers Management System

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Database Setup](#database-setup)
- [Migration & Seeding](#migration--seeding)
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

### Anti-patterns Avoided

- ❌ N+1 queries: Instead of fetching all relations, we fetch counts and batch
- ❌ Over-fetching: Use `select` to get only needed fields
- ❌ Missing indexes: Added composite and single-column indexes for common queries
- ❌ Unbounded queries: All queries include pagination with `take/skip`

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

