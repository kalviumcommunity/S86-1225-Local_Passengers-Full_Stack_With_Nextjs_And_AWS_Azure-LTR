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
