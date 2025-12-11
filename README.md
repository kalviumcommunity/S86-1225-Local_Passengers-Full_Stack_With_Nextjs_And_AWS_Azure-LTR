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