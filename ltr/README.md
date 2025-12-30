## Local Train Passengers (LTR)

This is a Next.js application for the Local Train Passengers system.

## Getting Started (Local)

Run the development server:

```bash
npm run dev
```

## Secure Environment Setup on Cloud (AWS Secrets Manager)

Production secrets (DB URLs, JWT secrets, API keys) should not live in plaintext `.env` files.
This app supports retrieving secrets at runtime from a cloud-managed secret store.

### What this repo supports

- AWS Secrets Manager: fetch a single JSON secret containing key/value pairs.
- Runtime verification endpoint: `GET /api/health/secrets` (returns metadata only).
- Database connection can use cloud-managed `DATABASE_URL` at runtime.

Implementation:
- Secrets helper: `src/lib/cloudSecrets.ts`
- DB uses secrets if needed: `src/lib/dbConnection.ts`
- Verification route: `src/app/api/health/secrets/route.ts`

### AWS Secrets Manager

1) Create a secret (Console → Secrets Manager → Store a new secret)

- Type: “Other type of secret”
- Store as JSON key/value pairs (example):

```json
{
	"DATABASE_URL": "postgresql://...",
	"JWT_SECRET": "...",
	"JWT_REFRESH_SECRET": "..."
}
```

2) Configure environment variables for the running service/container:

- `AWS_REGION`
- `AWS_SECRET_ARN` (or `AWS_SECRET_ID` / `AWS_SECRETS_MANAGER_SECRET_ID`)

3) Least-privilege IAM (example policy)

Grant only read access to the specific secret:

```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Action": ["secretsmanager:GetSecretValue"],
			"Resource": "arn:aws:secretsmanager:REGION:ACCOUNT_ID:secret:nextjs/app-secrets-*"
		}
	]
}
```

Attach this policy to the workload identity (ECS task role / EC2 instance role), not a personal IAM user.

### Validate runtime injection (safe)

Call the verification endpoint:

- Dev/local (no token required):

```bash
curl http://localhost:5174/api/health/secrets
```

- Production: set `SECRETS_DEBUG_TOKEN` and call with header `x-debug-token`.

This endpoint never returns secret values—only provider metadata and key names.

### Rotation and access practices

- Rotation: rotate DB credentials / JWT secrets on a regular cadence (e.g., monthly) or immediately after any suspected leak.
- Access control: use workload identities (ECS task role / Azure Managed Identity) with least-privilege permissions.
- Observability: avoid logging secret values. This repo’s `/api/health/secrets` returns metadata only.

## Deployment with Docker on Azure (ACR + App Service)

This project is containerized using Docker and can be deployed to Azure App Service for Containers.

### Dockerfile

- Dockerfile path: `ltr/Dockerfile`
- Uses a 2-stage build (builder + runner) for smaller runtime images.

### Build and run locally (Docker)

From the `ltr/` directory:

```bash
docker build -t ltr-nextjs-app .
docker run -p 3000:3000 ltr-nextjs-app
```

Open `http://localhost:3000`.

Note: If you see a TypeScript build “out of memory” issue on some machines, increase Node heap:

```bash
set NODE_OPTIONS=--max-old-space-size=4096
```

### Push image to Azure Container Registry (ACR)

Example commands:

```bash
az acr login --name <acrName>
docker tag ltr-nextjs-app <acrLoginServer>/<repoName>:latest
docker push <acrLoginServer>/<repoName>:latest
```

### Deploy to Azure App Service (Container)

High-level configuration:

- Create an App Service (Web App) configured for a single container.
- Set `WEBSITES_PORT=3000`.
- Point the Web App to the ACR image.

### CI/CD pipeline

GitHub Actions workflow:

- `.github/workflows/deploy-azure-appservice-container.yml`

It performs:

- Build Docker image from `ltr/`
- Push image to ACR
- Update App Service container to the new image

Required GitHub secrets:

- `AZURE_CREDENTIALS` (service principal JSON)
- `ACR_NAME`
- `ACR_LOGIN_SERVER`
- `ACR_IMAGE_REPO`
- `AZURE_RESOURCE_GROUP`
- `AZURE_WEBAPP_NAME`
- `ACR_USERNAME`, `ACR_PASSWORD` (if using ACR admin credentials)

### Autoscaling and resource sizing (reflection)

- Start with a small plan (CPU/RAM) and scale based on real metrics (CPU, memory, request latency).
- Configure scale-out rules (e.g., 1–3 instances based on CPU %).
- Cold starts: smaller images and fewer runtime dependencies reduce startup time.
- Health checks: prefer a lightweight endpoint (e.g., `/api/health/db` if DB is reachable) and configure App Service health check path.

### Evidence to capture (screenshots)

- ACR repository + pushed image tag
- App Service “Container settings” showing the image
- Live URL working in browser

