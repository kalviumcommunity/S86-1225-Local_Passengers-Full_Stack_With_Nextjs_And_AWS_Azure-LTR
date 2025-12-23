# S86-1225-Local_Passengers-Full_Stack_With_Nextjs_And_AWS_Azure-LTR
**Project Plan – LocalPassengers: Real-Time Train Delay & Reroute System**

## Screenshot
![Local Dev](./ltr/screenshots/local-dev.png)


**1.Problem Statement & Solution Overview**

As a team, we observed that millions of local train commuters in India face frequent delays, platform changes, and unreliable updates. These issues cause missed connections, longer travel times, and daily uncertainty. Commuters often rely on fragmented information sources or word-of-mouth updates at stations, which are neither consistent nor reliable.

To address this challenge, we are building LocalPassengers, a web-based system designed to deliver accurate, real-time information and intelligent rerouting assistance. Our solution focuses on improving the commuting experience through clarity, predictability, and reliable decision-making support.

LocalPassengers will collect and display real-time data such as train delays, expected arrival times, platform changes, and cancellations. The system will present this information in a clean, easy-to-understand interface so that users can immediately know the latest status of their intended train.

In addition to showing live updates, the system will also generate reroute suggestions when trains are delayed or unavailable. These recommendations will include alternate trains on the same route, nearby stations with earlier departures, and smarter combinations of slow/fast trains. This allows commuters to adjust their travel plan instantly instead of waiting blindly at the station.

The platform will also provide a personalized dashboard, where users can save frequently used trains or routes. Once a train is saved, the system will proactively notify the user about delays or platform changes, ensuring they stay informed before even reaching the station.

---
**2. Scope & Boundaries**

 **In Scope**

* User authentication
* Train search and real-time status
* Reroute suggestions
* User dashboard
* Alerts for saved trains
* Backend APIs with a database
* Responsive UI and cloud deployment

**Out of Scope**

* Mobile application
* AI-based predictions
* Offline mode
* GPS-based live tracking

---

**3. Team Roles & Responsibilities**

* Chaithanya will focus on frontend development, building the user interface and key pages.
* Vaishnavi will work on backend development, including the database, APIs, and business logic.
* Arun kumar will handle DevOps, testing, and deployment.
*
  We will collaborate closely, share blockers, and support one another throughout the sprint.

---

**4. Sprint Timeline (4 Weeks)**

**Week 1 – Setup & Planning**

We will complete project setup, define architecture, design the database, finalize HLD/LLD, and implement basic authentication.

**Week 2 – Core Development**

We will build the key backend APIs, implement train search and live status features, develop the reroute logic, and build the main UI screens.

**Week 3 – Integration & Deployment**

We will integrate the frontend and backend, configure cloud services, set up CI/CD, add security layers, and begin testing.

**Week 4 – Finalization & Submission**

We will polish the UI, fix issues, complete documentation, conduct final testing, and deploy the MVP for submission.

---

**5. MVP (Minimum Viable Product)**

Our MVP will include:

* Login and signup
* Train search
* Live train status (delay, platform)
* Reroute suggestions
* Dashboard for saved trains
* Basic notifications

---

**6. Functional Requirements**

* Users must be able to register and log in.
* Users should be able to search for a train and view its live status.
* The system should show reroute suggestions when delays occur.
* Users must be able to save trains and receive alerts.

---

**7. Non-Functional Requirements**

* Fast API responses
* Secure authentication
* Responsive design on all devices
* Reliable cloud deployment
* Basic logging and error handling

---

**8. Success Metrics**

* All MVP features completed and functional
* Successful deployment with no critical issues
* Smooth end-to-end user experience
* Positive feedback during demo
* Stable performance during testing

---

**9. Risks & Mitigation**

* If external data sources fail, we will use fallback mock data.
* If deployment issues arise, we will begin DevOps tasks early.
* If delays occur in development, we will redistribute tasks within the team.

---

**10. TypeScript & ESLint Configuration**

### Overview

To ensure code quality, consistency, and catch errors early in the development process, we have implemented a comprehensive TypeScript and ESLint configuration with Prettier for automatic code formatting and Husky with lint-staged for pre-commit hooks.

### Why Strict TypeScript Configuration?

Strict TypeScript mode significantly reduces runtime bugs by:

- **Type Safety**: `strict: true` enforces strict null checks and ensures all types are explicitly defined
- **Implicit Any Prevention**: `noImplicitAny: true` prevents variables from having the `any` type, requiring explicit type annotations
- **Unused Code Detection**: `noUnusedLocals: true` and `noUnusedParameters: true` identify and remove dead code that could cause confusion or bloat
- **Casing Consistency**: `forceConsistentCasingInFileNames: true` prevents import errors caused by incorrect file name casing on case-sensitive systems
- **Skip Library Checks**: `skipLibCheck: true` speeds up compilation by skipping type checking of declaration files

### TypeScript Configuration (`tsconfig.json`)

The following strict compiler options have been enabled:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  }
}
```

### ESLint Configuration (`eslint.config.mjs`)

Our project uses ESLint's flat config format (the modern approach). The configuration includes strict rules that enforce consistent code style and catch potential problems:

```javascript
{
  rules: {
    "no-console": "error",
    "semi": ["error", "always"],
    "quotes": ["error", "double"],
  },
}
```

**ENV Managment**
- `Set up .env.local for real secrets and .env.example for placeholders to support team setup.`
- `Updated .gitignore to ensure environment secrets are never committed.`
- `Documented server-only vs client-exposed variables and demonstrated safe process.env usage in code.`

**Rules Explanation:**

- `no-console`: **ERROR** - Blocks console.log statements from being committed (helps keep production code clean)
- `semi`: **ERROR** - Requires semicolons at the end of statements (prevents potential issues with automatic semicolon insertion)
- `quotes`: **ERROR** - Enforces double quotes throughout the codebase (improves consistency)
- These rules integrate with Next.js core-web-vitals recommendations

### Prettier Configuration (`.prettierrc`)

Prettier automatically formats code consistently without debates:

```json
{
  "singleQuote": false,
  "semi": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

**Options:**

- `singleQuote: false`: Uses double quotes (aligns with ESLint rules)
- `semi: true`: Adds semicolons automatically
- `tabWidth: 2`: Uses 2 spaces for indentation
- `trailingComma: "es5"`: Adds trailing commas in objects and arrays (valid ES5 syntax)

### Pre-Commit Hooks with Husky & lint-staged

We use Husky and lint-staged to automatically run linting and formatting before commits, ensuring no code quality issues slip through.

**Setup:**

1. Husky is initialized and manages git hooks
2. The `.husky/pre-commit` hook runs lint-staged on staged files
3. lint-staged configuration in `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"]
  }
}
```

This configuration automatically:
- Runs ESLint with `--fix` to auto-correct issues
- Runs Prettier to format code
- Only applies to staged TypeScript and JavaScript files
- Prevents committing code that violates our standards

### Installation & Setup

All packages have been installed and configured:

**Installed Packages:**
- `prettier`: Code formatter
- `eslint-plugin-prettier`: ESLint plugin for Prettier
- `eslint-config-prettier`: ESLint config to disable conflicting rules
- `husky`: Git hooks manager
- `lint-staged`: Run linters on staged files

### How to Use

1. **Development**: Code as normal. ESLint and Prettier will highlight issues in your editor.
2. **Committing**: When you run `git commit`, the pre-commit hook automatically:
   - Formats your code with Prettier
   - Fixes auto-fixable ESLint issues
   - Prevents commit if there are remaining violations
3. **Manual Check**: Run `npm run lint` to check for linting issues

### Benefits for Team Consistency

- **No Style Debates**: Prettier and ESLint remove subjective formatting decisions
- **Early Error Detection**: Strict TypeScript catches bugs before runtime
- **Clean Git History**: Only properly formatted code is committed
- **Onboarding Ease**: New team members follow the same rules automatically
- **Code Reviews**: Reviewers focus on logic, not style
- **Prevents Bugs**: Catches common errors like unused variables and type issues

---

## Branching & PR Workflow

Our team (LocalPassengers Team-3) follows a structured Git workflow to maintain clean collaboration and avoid merge conflicts.

### Branch naming conventions
We follow these patterns:
- feature/<short-descriptive-name> — for new features (e.g. feature/train-status-api)c
- fix/<short-description> — for bug fixes (e.g. fix/navbar-overflow)
- chore/<task> — for config/maintenance tasks (e.g. chore/update-eslint)
- docs/<update> — for documentation updates (e.g. docs/add-env-setup)

### Pull Request (PR) guidelines
- Every PR must use the `.github/pull_request_template.md` file.
- PR titles follow the format: `feature: ...`, `fix: ...`, etc.
- Each PR must include:
  - Summary of the change
  - How to test it
  - Screenshots if UI is affected
  - At least one teammate as reviewer

### Review checklist
Before approving a PR, we ensure:
- The project builds (`npm run build` / `npm run dev`)
- ESLint + Prettier checks pass (`npm run lint`)
- No sensitive env variables are used in client components
- Tests pass (if present)
- No unnecessary or large files are included
- Code follows our folder structure (`src/app`, `src/components`, etc.)

### Branch protection (main)
Our `main` branch is protected with:
- Required pull request review (minimum 1 reviewer)
- Required status checks (CI workflow: lint + build)
- Branch must be up-to-date before merging
- Direct commits to `main` are blocked

---

## Docker & Docker Compose Setup for Local Development

### Overview

This project uses Docker and Docker Compose to containerize the entire application stack — the Next.js app, PostgreSQL database, and Redis cache. This setup ensures a fully functional local environment that mirrors production and eliminates the "it works on my machine" problem. All team members can run the exact same containerized environment, ensuring consistency across development, testing, and production.

### Architecture

The Docker setup includes three main services:

1. **Next.js App** (`nextjs_app`): The frontend and backend API, running on port 3000
2. **PostgreSQL** (`postgres_db`): The relational database, running on port 5432
3. **Redis** (`redis_cache`): The caching layer, running on port 6379

All services communicate through a custom Docker bridge network (`localnet`) and use named volumes for data persistence.

### Files

#### **Dockerfile**

The `Dockerfile` uses a multi-stage build approach for optimal image size:

- **Builder Stage**: Installs dependencies, builds the Next.js app, and compiles TypeScript
- **Production Stage**: Copies only production dependencies and built artifacts, reducing the final image size

Key features:
- Uses lightweight `node:20-alpine` base image
- Multi-stage build reduces final image size by ~50%
- Sets `NODE_ENV=production` for optimal Next.js performance
- Exposes port 3000 for the application

#### **docker-compose.yml**

Defines three services with health checks, environment variables, volumes, and networking:

**App Service:**
- Builds from the Dockerfile
- Runs on port 3000
- Depends on both db and redis services
- Environment variables for database and cache URLs
- Health check ensures the container is fully ready

**PostgreSQL Service:**
- Uses official `postgres:15-alpine` image
- Runs on port 5432
- Persists data using the `db_data` named volume
- Health check verifies database readiness
- Default credentials: `postgres:postgres`

**Redis Service:**
- Uses official `redis:7-alpine` image
- Runs on port 6379
- Persists data using the `redis_data` named volume
- Health check via `redis-cli ping`

**Networking:**
- All services connected through `localnet` bridge network
- Enables service-to-service communication via service names (e.g., `db:5432`, `redis:6379`)

**Volumes:**
- `db_data`: Persists PostgreSQL data across container restarts
- `redis_data`: Persists Redis data across container restarts

### Getting Started

#### Prerequisites

Ensure you have installed:
- [Docker](https://docs.docker.com/get-docker/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)

Verify installation:
```bash
docker --version
docker-compose --version
```

#### Running the Application

1. **Start all services:**
   ```bash
   docker-compose up --build
   ```
   - `--build` flag rebuilds the Next.js image
   - First run takes longer due to dependency installation and build process
   - Remove `--build` on subsequent runs for faster startup

2. **Verify all containers are running:**
   ```bash
   docker ps
   ```
   Output should show three running containers:
   - `nextjs_app`
   - `postgres_db`
   - `redis_cache`

3. **Access the application:**
   - **Next.js App**: http://localhost:3000
   - **PostgreSQL**: `localhost:5432` (connect with credentials postgres:postgres)
   - **Redis CLI**: `docker-compose exec redis redis-cli`

#### Stopping the Application

```bash
docker-compose down
```
- Stops and removes containers

---

## Transactional Email Integration (SES / SendGrid)

Transactional emails are essential for LocalPassengers to keep commuters informed about saved trains, delays, platform changes, reroutes, and security alerts.

### Why Transactional Emails Matter

- **Critical updates:** notify users about delays or alternate routes.
- **Security:** password resets and account alerts.
- **Trust:** confirmation emails (signup, bookings) improve user confidence.

### Choosing a Provider

Feature | AWS SES | SendGrid
:---|:---:|:---:
Pricing | Pay-per-email | Free tier (100/day) + paid plans
Setup | Domain/email verification, IAM | API key, sender verification
Best for | Backend automation, tight AWS integration | Rapid development, easy API

### Environment Variables

Add one of the following to your `.env.local` for SES:

```
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=ap-south-1
SES_EMAIL_SENDER=no-reply@yourdomain.com
```

Or for SendGrid:

```
SENDGRID_API_KEY=your-api-key
SENDGRID_SENDER=no-reply@yourdomain.com
```

### Install SDKs

```
npm install @aws-sdk/client-ses
npm install @sendgrid/mail
```

### Example Next.js API Route (app/api/email/route.ts)

Option A — AWS SES

```ts
import { NextResponse } from "next/server";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({ region: process.env.AWS_REGION });

export async function POST(req: Request) {
  try {
    const { to, subject, message } = await req.json();

    const params = {
      Destination: { ToAddresses: [to] },
      Message: {
        Body: { Html: { Charset: "UTF-8", Data: message } },
        Subject: { Charset: "UTF-8", Data: subject },
      },
      Source: process.env.SES_EMAIL_SENDER!,
    };

    const response = await ses.send(new SendEmailCommand(params));
    console.log("Email sent:", response.MessageId);
    return NextResponse.json({ success: true, messageId: response.MessageId });
  } catch (error) {
    console.error("Email send failed:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
```

Option B — SendGrid

```ts
import { NextResponse } from "next/server";
import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(req: Request) {
  try {
    const { to, subject, message } = await req.json();

    const emailData = { to, from: process.env.SENDGRID_SENDER!, subject, html: message };
    const response = await sendgrid.send(emailData);
    console.log("Email sent headers:", response[0]?.headers || response);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email send failed:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
```

### Reusable HTML Template

```ts
export const welcomeTemplate = (userName: string) => `
  <h2>Welcome to LocalPassengers, ${userName}!</h2>
  <p>We’re thrilled to have you onboard 🎉</p>
  <p>Save trains to get real-time delay and reroute alerts.</p>
  <hr/>
  <small>This is an automated email. Please do not reply.</small>
`;
```

### Testing the Email API

Run locally (Next dev) and test with curl or Postman:

```bash
curl -X POST http://localhost:3000/api/email \
  -H "Content-Type: application/json" \
  -d '{"to":"student@example.com","subject":"Welcome!","message":"<h3>Hello from LocalPassengers 🚀</h3>"}'
```

Expected response (SES example):

```json
{ "success": true, "messageId": "01010189b2example123" }
```

Console log sample:

```
Email sent: 01010189b2example123
```

Note: SES sandbox will only deliver to verified addresses.

### Common Issues & Mitigations

- Emails not delivered: check sandbox mode, verify sender and recipient.
- Rate limits: implement job queue and retry/backoff (BullMQ, AWS SQS).
- Bounces & complaints: monitor provider dashboards and webhook events.
- Slow sends: send asynchronously and batch where appropriate.

### Security & Deliverability

- Use domain verification, SPF, DKIM for production senders.
- Keep API keys/secrets in server-only env files and never expose to client.

### How this helps LocalPassengers

- Notify users who saved trains about delays, platform changes, or reroute suggestions.
- Automatically send a reroute recommendation when a saved train is canceled or delayed beyond threshold.
- Send security alerts (password resets, suspicious logins).

### Deliverables Checklist

- [x] README updated with integration guide and examples
- [ ] Implement API route in `app/api/email/route.ts` (see above snippets)
- [x] HTML template example included
- [ ] Capture logs/screenshots when sending from real account (attach here)

---

Pro Tip: Emails are the heartbeat of trust in digital systems — automate them carefully, monitor them consistently, and secure them relentlessly.
- Networks are destroyed
- Volumes persist (data remains)

To remove everything including volumes:
```bash
docker-compose down -v
```

### Common Commands

#### View logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs app
docker-compose logs db
docker-compose logs redis

# Follow logs in real-time
docker-compose logs -f app
```

#### Execute commands inside containers
```bash
# Connect to Next.js container bash
docker-compose exec app sh

# Connect to PostgreSQL database
docker-compose exec db psql -U postgres -d ltr_db

# Redis CLI
docker-compose exec redis redis-cli
```

#### Rebuild images
```bash
# Rebuild all
docker-compose build

# Rebuild specific service
docker-compose build app
```

#### View container status
```bash
# Detailed container info
docker-compose ps -a

# View specific container logs with timestamps
docker-compose logs --timestamps app
```

### Environment Variables

The Docker Compose setup uses the following environment variables (defined in `docker-compose.yml`):

| Variable | Value | Purpose |
|----------|-------|---------|
| `DATABASE_URL` | `postgres://postgres:postgres@db:5432/ltr_db` | Database connection string |
| `REDIS_URL` | `redis://redis:6379` | Redis connection string |
| `NODE_ENV` | `production` | Sets Next.js to production mode |
| `POSTGRES_USER` | `postgres` | PostgreSQL username |
| `POSTGRES_PASSWORD` | `postgres` | PostgreSQL password |
| `POSTGRES_DB` | `ltr_db` | PostgreSQL database name |

**Note:** These are development credentials. For production, use secure values stored in `.env.production` and secret management tools.

### Health Checks

All services include health checks that verify:
- **App**: HTTP GET request to `http://localhost:3000`
- **PostgreSQL**: `pg_isready` command verifies database availability
- **Redis**: `redis-cli ping` returns PONG

Docker Compose waits for health checks before marking containers as "healthy" and allows dependent services to start only when their dependencies are ready.

### Development Workflow

1. **Local changes**: Modify code in the `src/` directory
2. **Rebuild**: Run `docker-compose up --build` to rebuild the app image
3. **Test**: Access http://localhost:3000 and verify changes
4. **Database changes**: Connect to the database:
   ```bash
   docker-compose exec db psql -U postgres -d ltr_db
   ```

### Troubleshooting

#### Port conflicts
If ports 3000, 5432, or 6379 are already in use:
```bash
# Find what's using the port (example: port 3000)
lsof -i :3000

# Modify docker-compose.yml to use different ports
# Change "3000:3000" to "3001:3000" (first number is host port)
```

#### Container fails to start
```bash
# Check logs for errors
docker-compose logs app

# Rebuild without cache
docker-compose build --no-cache app

# Remove all containers and try again
docker-compose down -v
docker-compose up --build
```

#### Permission errors
If you encounter permission errors on Windows PowerShell:
```powershell
# Run PowerShell as Administrator
docker-compose up --build
```

#### Slow build process
- First build takes 2-3 minutes due to dependency installation
- Subsequent builds are faster if no dependencies changed
- Use `.dockerignore` to exclude unnecessary files

#### Database connection errors
```bash
# Verify database is healthy
docker-compose exec db pg_isready -U postgres

# Check environment variables in app container
docker-compose exec app env | grep DATABASE_URL
```

### Build & Image Size

The multi-stage Dockerfile optimizes image size:
- **Builder stage**: ~500MB (includes build tools)
- **Production stage**: ~150MB (only runtime dependencies)

View image sizes:
```bash
docker images | grep nextjs_app
```

### Next Steps

1. Set up the PostgreSQL schema (see `PostgreSQL Schema Design` section)
2. Configure environment variables in `.env.local` for secrets
3. Implement database migrations
4. Set up CI/CD pipelines for automated Docker builds
5. Deploy to cloud platforms (AWS, Azure) using Docker images


### Migration Issues

```bash
# Check migration status
npx prisma migrate status

# Reset database (WARNING: deletes data)
npx prisma migrate reset

# Force apply migrations
npx prisma migrate deploy
```

### Seed Issues

```bash
# Clear database and re-seed
npx prisma migrate reset

# Run seed manually
npx prisma db seed
```

For more troubleshooting help, see [MIGRATIONS_AND_SEEDING.md](./MIGRATIONS_AND_SEEDING.md).

---

## API Route Structure and Naming Convention

### Overview

Our **LocalPassengers** API follows RESTful design principles with file-based routing in Next.js App Router. All API endpoints are organized under the `/api/` directory with predictable, resource-based naming conventions that make the backend self-documenting and easy to integrate.

### Why REST and Consistent Naming Matter

Following REST principles ensures:
- **Predictable endpoints**: Developers can guess endpoint URLs without documentation
- **HTTP verb semantics**: Each verb (GET, POST, PUT, DELETE) has a clear, single responsibility
- **Reduced integration errors**: Consistent patterns mean fewer bugs during frontend/backend integration
- **Maintainability**: New team members can quickly understand the API structure

### File-Based Routing Structure

In Next.js 14 App Router, each `route.ts` file under `app/api/` automatically becomes an API endpoint:

```
src/app/api/
├── trains/
│   ├── route.ts              # GET /api/trains, POST /api/trains
│   └── [id]/
│       └── route.ts          # GET /api/trains/:id, PUT /api/trains/:id, DELETE /api/trains/:id
├── stations/
│   ├── route.ts              # GET /api/stations, POST /api/stations
│   └── [id]/
│       └── route.ts          # GET /api/stations/:id, PUT /api/stations/:id, DELETE /api/stations/:id
├── routes/
│   └── route.ts              # GET /api/routes, POST /api/routes
├── search/
│   └── route.ts              # GET /api/search (train search between stations)
├── delays/
│   ├── route.ts              # GET /api/delays, POST /api/delays
│   └── [id]/
│       └── route.ts          # GET /api/delays/:id, PUT /api/delays/:id, DELETE /api/delays/:id
├── cancellations/
│   └── route.ts              # GET /api/cancellations, POST /api/cancellations
├── reroutes/
│   └── route.ts              # GET /api/reroutes, POST /api/reroutes
├── saved-trains/
│   └── route.ts              # GET /api/saved-trains, POST /api/saved-trains, DELETE /api/saved-trains
├── alerts/
│   └── route.ts              # GET /api/alerts, POST /api/alerts, PATCH /api/alerts
└── users/
    ├── route.ts              # GET /api/users, POST /api/users
    └── [id]/
        └── route.ts          # GET /api/users/:id, PUT /api/users/:id, DELETE /api/users/:id
```

---

## Domain-Specific API Endpoints

Our API is designed specifically for the **Local Train Passengers** domain. Below is the complete hierarchy:

### 1. Trains Management (`/api/trains`)

**Resource**: Train records (train number, name, type, operating days)

| HTTP Method | Endpoint | Purpose | Query Params |
|------------|----------|---------|-------------|
| `GET` | `/api/trains` | List all trains with pagination | `page`, `limit`, `trainNumber`, `trainType`, `search`, `isActive` |
| `POST` | `/api/trains` | Create a new train | - |
| `GET` | `/api/trains/:id` | Get specific train details with routes, delays, cancellations | - |
| `PUT` | `/api/trains/:id` | Update train information | - |
| `DELETE` | `/api/trains/:id` | Deactivate a train (soft delete) | - |

**Sample Request**:
```bash
# Get all EXPRESS trains
curl -X GET "http://localhost:3000/api/trains?trainType=EXPRESS&page=1&limit=10"

# Create a new train
curl -X POST http://localhost:3000/api/trains \
  -H "Content-Type: application/json" \
  -d '{
    "trainNumber": "12345",
    "trainName": "Mumbai Express",
    "trainType": "EXPRESS",
    "operatingDays": ["MON", "TUE", "WED", "THU", "FRI"],
    "isActive": true
  }'
```

**Sample Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "trainNumber": "12345",
      "trainName": "Mumbai Express",
      "trainType": "EXPRESS",
      "operatingDays": ["MON", "TUE", "WED", "THU", "FRI"],
      "isActive": true,
      "createdAt": "2025-12-16T10:00:00Z",
      "_count": {
        "routes": 3,
        "delays": 2
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

---

### 2. Stations Management (`/api/stations`)

**Resource**: Railway station information (code, name, city, facilities)

| HTTP Method | Endpoint | Purpose | Query Params |
|------------|----------|---------|-------------|
| `GET` | `/api/stations` | List all stations with pagination | `page`, `limit`, `code`, `city`, `search` |
| `POST` | `/api/stations` | Create a new station | - |
| `GET` | `/api/stations/:id` | Get specific station with all routes | - |
| `PUT` | `/api/stations/:id` | Update station details | - |
| `DELETE` | `/api/stations/:id` | Delete a station | - |

**Sample Request**:
```bash
# Search stations in Mumbai
curl -X GET "http://localhost:3000/api/stations?city=Mumbai&page=1&limit=10"

# Create a new station
curl -X POST http://localhost:3000/api/stations \
  -H "Content-Type: application/json" \
  -d '{
    "code": "CST",
    "name": "Chhatrapati Shivaji Terminus",
    "city": "Mumbai",
    "state": "Maharashtra",
    "latitude": 18.9398,
    "longitude": 72.8355,
    "facilities": ["parking", "restroom", "food", "wifi"]
  }'
```

---

### 3. Train Routes (`/api/routes`)

**Resource**: Train route information (origin, destination, timings, fare)

| HTTP Method | Endpoint | Purpose | Query Params |
|------------|----------|---------|-------------|
| `GET` | `/api/routes` | List all routes with pagination | `page`, `limit`, `trainId`, `originStationId`, `destinationStationId` |
| `POST` | `/api/routes` | Create a new route for a train | - |

**Sample Request**:
```bash
# Get routes for train ID 1
curl -X GET "http://localhost:3000/api/routes?trainId=1"

# Create a new route
curl -X POST http://localhost:3000/api/routes \
  -H "Content-Type: application/json" \
  -d '{
    "trainId": 1,
    "originStationId": 1,
    "destinationStationId": 2,
    "departureTime": "08:30",
    "arrivalTime": "10:45",
    "duration": 135,
    "distance": 45.5,
    "fare": 25.00
  }'
```

---

### 4. Train Search (`/api/search`)

**Resource**: Search trains between two stations with live delay information

| HTTP Method | Endpoint | Purpose | Query Params |
|------------|----------|---------|-------------|
| `GET` | `/api/search` | Search trains between origin and destination | `origin` (required), `destination` (required), `date` (optional), `trainType` (optional) |

**Sample Request**:
```bash
# Search trains from CST to Thane
curl -X GET "http://localhost:3000/api/search?origin=CST&destination=Thane"

# Search with date filter
curl -X GET "http://localhost:3000/api/search?origin=Mumbai&destination=Pune&date=2025-12-20&trainType=EXPRESS"
```

**Sample Response**:
```json
{
  "success": true,
  "data": {
    "origin": {
      "id": 1,
      "code": "CST",
      "name": "Chhatrapati Shivaji Terminus",
      "city": "Mumbai"
    },
    "destination": {
      "id": 2,
      "code": "THN",
      "name": "Thane",
      "city": "Thane"
    },
    "searchDate": "2025-12-16",
    "routes": [
      {
        "id": 1,
        "departureTime": "08:30",
        "arrivalTime": "09:15",
        "duration": 45,
        "distance": 30,
        "fare": 15.00,
        "train": {
          "trainNumber": "12345",
          "trainName": "Mumbai Local",
          "trainType": "LOCAL"
        },
        "delay": {
          "delayMinutes": 10,
          "reason": "Signal failure",
          "status": "DELAYED"
        }
      }
    ],
    "totalResults": 5
  }
}
```

---

### 5. Delays Management (`/api/delays`)

**Resource**: Train delay records with reasons and updated timings

| HTTP Method | Endpoint | Purpose | Query Params |
|------------|----------|---------|-------------|
| `GET` | `/api/delays` | List all delays with pagination | `page`, `limit`, `trainId`, `status`, `date` |
| `POST` | `/api/delays` | Create a new delay record | - |
| `GET` | `/api/delays/:id` | Get specific delay details | - |
| `PUT` | `/api/delays/:id` | Update delay information | - |
| `DELETE` | `/api/delays/:id` | Delete a delay record | - |

**Sample Request**:
```bash
# Get today's delays
curl -X GET "http://localhost:3000/api/delays?date=2025-12-16"

# Report a new delay
curl -X POST http://localhost:3000/api/delays \
  -H "Content-Type: application/json" \
  -d '{
    "trainId": 1,
    "delayMinutes": 15,
    "reason": "Signal failure at Dadar",
    "expectedArrival": "09:30",
    "status": "DELAYED"
  }'
```

---

### 6. Cancellations (`/api/cancellations`)

**Resource**: Train cancellation records

| HTTP Method | Endpoint | Purpose | Query Params |
|------------|----------|---------|-------------|
| `GET` | `/api/cancellations` | List all cancellations | `page`, `limit`, `trainId`, `date` |
| `POST` | `/api/cancellations` | Create a cancellation record | - |

**Sample Request**:
```bash
# Get cancellations for train ID 1
curl -X GET "http://localhost:3000/api/cancellations?trainId=1"

# Report a cancellation
curl -X POST http://localhost:3000/api/cancellations \
  -H "Content-Type: application/json" \
  -d '{
    "trainId": 1,
    "date": "2025-12-20T00:00:00Z",
    "reason": "Track maintenance",
    "isFullDay": true,
    "affectedStations": []
  }'
```

---

### 7. Reroute Suggestions (`/api/reroutes`)

**Resource**: Alternative route suggestions when trains are delayed

| HTTP Method | Endpoint | Purpose | Query Params |
|------------|----------|---------|-------------|
| `GET` | `/api/reroutes` | List reroute suggestions | `page`, `limit`, `originalRouteId`, `isActive` |
| `POST` | `/api/reroutes` | Create a reroute suggestion | - |

**Sample Request**:
```bash
# Get active reroute suggestions
curl -X GET "http://localhost:3000/api/reroutes?isActive=true"

# Create a reroute suggestion
curl -X POST http://localhost:3000/api/reroutes \
  -H "Content-Type: application/json" \
  -d '{
    "originalRouteId": 1,
    "alternateTrainNumber": "12346",
    "reason": "Original train delayed by 30 minutes",
    "timeSaved": 15,
    "additionalCost": 0,
    "suggestion": "Take train 12346 from Platform 2. Arrives 15 minutes earlier."
  }'
```

---

### 8. Saved Trains (`/api/saved-trains`)

**Resource**: User's frequently used trains with notification preferences

| HTTP Method | Endpoint | Purpose | Query Params |
|------------|----------|---------|-------------|
| `GET` | `/api/saved-trains` | Get user's saved trains | `userId` (required), `page`, `limit` |
| `POST` | `/api/saved-trains` | Save a train for a user | - |
| `DELETE` | `/api/saved-trains` | Remove a saved train | - |

**Sample Request**:
```bash
# Get saved trains for user ID 1
curl -X GET "http://localhost:3000/api/saved-trains?userId=1"

# Save a train
curl -X POST http://localhost:3000/api/saved-trains \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "trainId": 1,
    "nickname": "My morning train",
    "notifyOnDelay": true,
    "notifyOnPlatformChange": true
  }'

# Remove a saved train
curl -X DELETE http://localhost:3000/api/saved-trains \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "trainId": 1
  }'
```

---

### 9. Alerts & Notifications (`/api/alerts`)

**Resource**: User notifications for delays, cancellations, platform changes

| HTTP Method | Endpoint | Purpose | Query Params |
|------------|----------|---------|-------------|
| `GET` | `/api/alerts` | Get user's alerts | `userId` (required), `page`, `limit`, `isRead`, `type` |
| `POST` | `/api/alerts` | Create a new alert | - |
| `PATCH` | `/api/alerts` | Mark alerts as read | - |

**Sample Request**:
```bash
# Get unread alerts for user ID 1
curl -X GET "http://localhost:3000/api/alerts?userId=1&isRead=false"

# Mark specific alerts as read
curl -X PATCH http://localhost:3000/api/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "alertIds": [1, 2, 3]
  }'

# Mark all alerts as read
curl -X PATCH http://localhost:3000/api/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "markAllAsRead": true
  }'
```

---

### 10. Users Management (`/api/users`)

**Resource**: Commuter/admin user accounts

| HTTP Method | Endpoint | Purpose | Query Params |
|------------|----------|---------|-------------|
| `GET` | `/api/users` | List all users | `page`, `limit`, `role` |
| `POST` | `/api/users` | Create a new user | - |
| `GET` | `/api/users/:id` | Get specific user | - |
| `PUT` | `/api/users/:id` | Update user details | - |
| `DELETE` | `/api/users/:id` | Delete a user | - |

---

## API Design Principles & Best Practices

### 1. RESTful Resource Naming
- ✅ **Use plural nouns**: `/api/trains`, `/api/stations` (not `/api/train` or `/api/getTrains`)
- ✅ **Use nouns, not verbs**: `/api/users` (not `/api/getUsers` or `/api/createUser`)
- ✅ **Hierarchical relationships**: `/api/trains/:id/routes` (if needed)
- ✅ **Kebab-case for multi-word resources**: `/api/saved-trains`, `/api/platform-changes`

### 2. HTTP Method Semantics
- **GET**: Retrieve data (read-only, idempotent, no side effects)
- **POST**: Create new resources
- **PUT/PATCH**: Update existing resources
- **DELETE**: Remove resources (soft delete in our case)

### 3. Pagination & Filtering
All list endpoints support:
- `page` (default: 1)
- `limit` (default: 10, max: 100)
- Resource-specific filters (e.g., `trainType`, `city`, `status`)

**Example**:
```bash
curl -X GET "http://localhost:3000/api/trains?page=2&limit=20&trainType=EXPRESS"
```

### 4. Error Handling & Status Codes
| Status Code | Meaning | Usage |
|------------|---------|-------|
| `200 OK` | Success | GET requests |
| `201 Created` | Resource created | POST requests |
| `400 Bad Request` | Invalid input | Missing required fields, validation errors |
| `404 Not Found` | Resource doesn't exist | GET/PUT/DELETE on non-existent ID |
| `409 Conflict` | Resource already exists | Duplicate train number, station code |
| `500 Internal Server Error` | Server error | Unexpected errors |

**Error Response Format**:
```json
{
  "success": false,
  "error": "Train not found",
  "message": "No train found with ID 999"
}
```

### 5. Consistent Response Structure
All successful responses follow this format:
```json
{
  "success": true,
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

---

## Testing the API

We provide comprehensive test commands in [API_TESTING_GUIDE.md](./ltr/API_TESTING_GUIDE.md).

**Quick test**:
```bash
# Health check
curl -X GET "http://localhost:3000/api/stations?limit=1"

# Search trains
curl -X GET "http://localhost:3000/api/search?origin=Mumbai&destination=Pune"
```

---

## Database Schema Design

The new domain-specific Prisma schema is available in [ltr/prisma/schema-trains.prisma](./ltr/prisma/schema-trains.prisma).

**Key Models**:
- `Train` - Train records (number, name, type)
- `Station` - Railway stations
- `TrainRoute` - Routes between stations
- `StopPoint` - Intermediate stops on a route
- `Delay` - Delay records
- `Cancellation` - Cancellation records
- `Reroute` - Alternative route suggestions
- `SavedTrain` - User's saved trains
- `Alert` - User notifications
- `User` - Commuter accounts

---

## Reflection: Why This Design Matters

### Consistency & Predictability
By following strict RESTful conventions, our API becomes **self-documenting**. A developer who sees `/api/trains` can immediately guess:
- `GET /api/trains` - list trains
- `POST /api/trains` - create train
- `GET /api/trains/:id` - get specific train
- `PUT /api/trains/:id` - update train
- `DELETE /api/trains/:id` - delete train

This predictability reduces integration errors and onboarding time.

### Error Prevention Through Design
Our API design prevents common mistakes:
- Required fields validated upfront (400 errors)
- Duplicate resources rejected (409 errors)
- Foreign key relationships enforced (404 errors)
- Pagination limits prevent overload

### Scalability & Maintainability
- Each endpoint has a single, clear responsibility
- Adding new resources follows the same pattern
- Filters and pagination keep responses fast
- Soft deletes preserve data integrity

### Domain-Driven Design
Our endpoints reflect the **actual problem domain** of local train passengers:
- Search trains between stations
- Track delays and cancellations
- Save frequently used trains
- Receive alerts for disruptions
- Get reroute suggestions

This alignment between domain concepts and API structure makes the system intuitive for both developers and end-users.

---

---

## ✅ Input Validation with Zod (Assignment 2.19)

### Overview

Comprehensive input validation has been implemented using **Zod**, a TypeScript-first schema validation library. All POST and PUT API requests are validated to ensure data integrity and prevent malformed requests from reaching the database.

### Why Zod?

- **Type Safety**: Automatic TypeScript type inference from schemas
- **Schema Reusability**: Same schemas work on client and server
- **Clear Error Messages**: Descriptive validation feedback for users
- **Runtime Validation**: Catches invalid data before processing
- **Zero Dependencies**: Lightweight and fast

### Implementation

#### Validation Schemas Created

All validation schemas are located in `ltr/src/lib/schemas/` with centralized exports:
- **userSchema.ts** - User registration, login, and profile updates
- **alertSchema.ts** - Train alert creation and modifications
- **rerouteSchema.ts** - Reroute generation validation
- **trainSchema.ts** - Train query parameters
- **index.ts** - Central export for all schemas

#### API Routes Updated with Validation

**Authentication Routes:**
- `POST /api/auth/register` - Validates email format, password strength (min 8 chars, uppercase, lowercase, number), and name length
- `POST /api/auth/login` - Validates email format and password presence

**Alert Routes:**
- `POST /api/alerts` - Validates trainId, trainName, source, destination, and alertType enum (all | delay | cancellation | platform_change | reroute)

**Reroute Routes:**
- `POST /api/reroutes` - Validates trainId, source, destination, and reason length (max 500 chars)

**User Routes:**
- `PUT /api/users/:id` - Validates name length, phone format, profilePicture URL, and role enum

### Validation Rules

**User Registration & Login:**
- Email must be valid format
- Password must be at least 8 characters with uppercase, lowercase, and number
- Name must be 2-100 characters (optional)
- Phone must match international format (optional)

**Alert Creation:**
- Train ID is required
- Train name is required (max 200 characters)
- Source and destination stations required (max 100 characters each)
- Alert type must be one of predefined enums

**Reroute Generation:**
- Train ID, source, and destination are required
- Reason is optional but limited to 500 characters

**User Updates:**
- All fields optional but must meet format requirements if provided
- Phone must match valid international format
- Profile picture must be valid URL
- Role must be ADMIN, PROJECT_MANAGER, TEAM_LEAD, or USER

### Error Response Format

All validation errors return structured responses with:
- `success: false` status
- `message` describing the error type
- `errors` array with specific field errors showing which field failed and why
- HTTP 400 status code

### Benefits Delivered

**Data Integrity:**
- Invalid data caught before reaching database
- Prevents application crashes from malformed inputs
- Ensures consistency across all API endpoints

**Security:**
- Prevents injection attacks through strict validation
- Enforces password complexity requirements
- Validates email formats and data types
- Limits string lengths to prevent overflow

**Developer Experience:**
- Single source of truth for validation rules
- Automatic TypeScript types from schemas
- Clear, descriptive error messages
- Easy to test and maintain
- Schema reusability between client and server

**Consistency:**
- Same validation rules apply on both frontend and backend
- Uniform error response format across all endpoints
- Predictable API behavior



### Verification Checklist

All validation scenarios tested and verified:
- ✅ Valid requests succeed with proper data
- ✅ Invalid email format rejected
- ✅ Weak passwords rejected  
- ✅ Missing required fields rejected
- ✅ Invalid enums rejected
- ✅ String length limits enforced
- ✅ Multiple validation errors shown together
- ✅ Consistent error response format

---

## ✅ State Management using Context & Hooks (Assignment 2.28)

### Overview

Global state management has been implemented using **React Context API** and **custom hooks** to handle authentication, UI preferences, and notifications across the entire application. This architecture eliminates prop-drilling and provides a clean, maintainable way to share state between components.

### Why Context and Hooks?

| Concept | Purpose | Example |
|---------|---------|---------|
| **Context** | Share data through component tree without props | Logged-in user available everywhere |
| **Custom Hook** | Encapsulate reusable logic for cleaner components | `useAuth()` handles login, logout, state |
| **Provider Pattern** | Centralize state management | AuthProvider wraps entire app |

### Folder Structure

```
ltr/src/
├── context/
│   ├── AuthContext.tsx       ← Authentication state
│   └── UIContext.tsx          ← Theme, sidebar, notifications
├── hooks/
│   ├── useAuth.ts             ← Custom auth hook
│   └── useUI.ts               ← Custom UI hook
├── app/
│   ├── layout.tsx             ← Providers wrap app
│   └── context-demo/
│       └── page.tsx           ← Demo implementation
```

---

### Implementation Details

#### 1. **AuthContext** (`src/context/AuthContext.tsx`)

Manages user authentication state globally with persistent login detection.

**Features:**
- ✅ User login/logout functionality
- ✅ JWT-based authentication
- ✅ Persistent session check on app mount
- ✅ Loading states during auth operations
- ✅ Type-safe user interface


**State Flow:**
1. App loads → `checkAuth()` verifies existing session
2. User logs in → `login()` → API call → update state → set user
3. User logs out → `logout()` → API call → clear state → redirect

---

#### 2. **UIContext** (`src/context/UIContext.tsx`)

Manages UI preferences and notifications with localStorage persistence.

**Features:**
- ✅ Light/Dark theme toggle with localStorage persistence
- ✅ Sidebar open/close state
- ✅ Global notification system with auto-dismiss
- ✅ Four notification types: info, success, warning, error


```

**Notification System:**
- Auto-dismiss after 5 seconds
- Visual feedback with color-coded types
- Stack multiple notifications
- Manual dismiss option

---

#### 3. **Custom Hooks**

##### `useAuth()` Hook (`src/hooks/useAuth.ts`)

Simplified interface to authentication context.

```typescript
const { user, isAuthenticated, login, logout, isAdmin } = useAuth();
```

**Additional computed properties:**
- `isAdmin` - Check if user has ADMIN role
- `isStationMaster` - Check if user has STATION_MASTER role

##### `useUI()` Hook (`src/hooks/useUI.ts`)

Convenient access to UI state and helper methods.

```typescript
const { 
  theme, 
  toggleTheme, 
  isDarkMode,
  showSuccess, 
  showError 
} = useUI();


**Helper methods:**
- `showSuccess(message)` - Quick success notification
- `showError(message)` - Quick error notification
- `showInfo(message)` - Quick info notification
- `showWarning(message)` - Quick warning notification

#### 4. **Global Provider Setup** (`src/app/layout.tsx`)

All contexts are provided at the root level, making state available throughout the app.

```typescript
<AuthProvider>
  <UIProvider>
    <LayoutWrapper>{children}</LayoutWrapper>
  </UIProvider>
</AuthProvider>
```

**Nesting order matters:**
- AuthProvider is outermost (authentication is fundamental)
- UIProvider wraps content (depends on auth for certain UI behaviors)

---

### Demo Page

**Location:** `/context-demo`

Interactive demonstration showing all context features:

✅ **Authentication Section:**
- Login form with email/password
- Display current user info
- Logout functionality
- Admin badge for admin users

✅ **UI Controls Section:**
- Theme toggle (Light ☀️ / Dark 🌙)
- Real-time theme display
- Sidebar toggle demonstration

✅ **Notification Testing:**
- Four buttons to test each notification type
- Live notification display in top-right corner
- Auto-dismiss and manual close

✅ **State Overview:**
- Real-time context status display
- Confirmation of active providers


### Reflection

**Why This Design Matters:**

**Scalability:** Adding new global state (e.g., shopping cart, user preferences) follows the same pattern - create context, add provider, expose via custom hook.

**Maintainability:** State logic is centralized. Changes to auth flow only require updating AuthContext, not every component.

**Performance:** Context splitting prevents unnecessary re-renders. Only components using specific context re-render when that context changes.

**Developer Productivity:** Custom hooks provide intuitive APIs. New team members can use `useAuth()` without understanding internal implementation.

**Real-world Application:** In LocalPassengers, this architecture enables:
- User authentication across all pages
- Theme preference for better accessibility
- Global notifications for train alerts
- Sidebar state management without props




**Project**: Local Train Passengers Management System  
**Author**: Kalvium Student  
**Last Updated**: December 17, 2025


## Authentication APIs (Signup / Login)

This project uses a secure authentication system to manage user access. The authentication flow is implemented using Next.js API routes, Prisma, bcrypt, JWT, and Zod for validation.

Signup (Register)

Users can register using email and password.

Input data is validated using Zod schemas to ensure correct format.

Passwords are hashed using bcrypt before storing in the database.

Duplicate email registrations are prevented.

Login

Users can log in using their registered email and password.

Credentials are validated using Zod.

Passwords are verified using bcrypt.

On successful login, a JWT token is generated.

The token is stored securely in an HTTP-only cookie.

🛡️ Authorization Middleware

The application implements comprehensive **Role-Based Access Control (RBAC)** with JWT-based authorization middleware.

**Features:**
- ✅ JWT token validation from cookies or Authorization header
- ✅ Role-based access control (ADMIN, PROJECT_MANAGER, TEAM_LEAD, USER)
- ✅ Protected routes with middleware enforcement
- ✅ Admin-only routes for system management
- ✅ User context injection for route handlers
- ✅ Graceful error handling with proper HTTP status codes


The middleware checks for a valid JWT token in:

HTTP-only cookies, or

Authorization header (Bearer token)

If the token is missing or invalid, access is denied.

Protected routes include:
- `/api/users/*` - User management (authenticated users)
- `/api/projects/*` - Project management (authenticated users)
- `/api/admin/*` - Admin dashboard and user management (ADMIN role only)

/api/tasks

/api/alerts

This ensures secure access control across the application.

✅ Input Validation with Zod

All authentication-related inputs are validated using Zod.

Centralized schema files are used for maintainability.

Invalid requests return clear and structured validation error messages.

🧪 Testing

The APIs were tested using Postman:

Signup with valid and invalid inputs

Login with correct and incorrect credentials

Accessing protected routes with and without JWT token

