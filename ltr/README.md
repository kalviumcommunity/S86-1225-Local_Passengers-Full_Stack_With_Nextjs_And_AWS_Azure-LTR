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

## 💻 Development

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

