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

## Logging & Monitoring (CloudWatch / Azure Monitor)

This repo emits **structured JSON logs** to stdout/stderr so they can be ingested by either AWS CloudWatch Logs or Azure Monitor/App Service Log Stream.

### Structured logs (JSON)

- Logger implementation: `src/lib/logger.ts`
- API routes log using `logApiEvent()` / `logApiError()`
- Logs include a **correlation ID** in `requestId` (derived from the `x-request-id` header)

Example log line (shape):

```json
{
	"timestamp": "2025-12-31T12:00:00.000Z",
	"level": "info",
	"message": "Alert created",
	"meta": {
		"requestId": "<uuid>",
		"endpoint": "http://.../api/alerts",
		"method": "POST",
		"status": 201,
		"durationMs": 42,
		"userId": "123"
	}
}
```

### Correlation IDs (request tracing)

- Middleware sets a correlation header for all API requests: `x-request-id` (generated if missing)
- The same ID is returned back to clients in the response header `x-request-id`
- In cloud logging tools, filter/group by `requestId` to trace a single request across multiple logs

Middleware file: `middleware.ts`

### AWS CloudWatch (typical container setup)

If running on ECS/Fargate or EC2 with Docker, configure a log driver (example):

```json
"logConfiguration": {
	"logDriver": "awslogs",
	"options": {
		"awslogs-group": "/ecs/nextjs-app",
		"awslogs-region": "ap-south-1",
		"awslogs-stream-prefix": "ecs"
	}
}
```

Common follow-ups:

- Create a **Metric Filter** to count errors (filter: `$.level = "error"`)
- Add a CloudWatch **Alarm** for spikes (example: `> 10 errors / 5 min`)
- Set log retention (7/14/30 days) on the log group

### Azure Monitor / App Service

For Azure App Service (Container):

- Enable log streaming: App Service → Monitoring → Log stream
- (Optional) Send logs to Log Analytics: App Service → Diagnostic settings → Log Analytics workspace

Example Kusto query for errors:

```kusto
AppServiceConsoleLogs
| where ResultDescription has '"level":"error"'
| summarize count() by bin(TimeGenerated, 1h)
```

Suggested alerts:

- `error` logs > 10 in 5 minutes
- average request duration > 2000ms (if you add duration-based dashboards)
- CPU > 80% for 5 minutes

### Retention (cost + compliance)

- Operational logs: 7–14 days
- Audit/security logs (if required): 90+ days
- Archive older logs to S3 (AWS) or Blob Storage (Azure) if needed

### Evidence to capture (screenshots)

- ACR repository + pushed image tag
- App Service “Container settings” showing the image
- Live URL working in browser

## Domain & SSL Setup (Azure DNS + App Service)

This section documents how to connect a custom domain and enable HTTPS for the deployed Azure App Service (Container).

### 1) Connect your domain to Azure DNS (or use your registrar DNS)

Option A — Azure DNS Zone:

- Create an Azure DNS Zone for your domain (e.g., `example.com`).
- Copy the NS records from Azure DNS.
- Update nameservers in your registrar to the Azure DNS NS values.

Option B — Keep DNS at registrar:

- You can keep DNS at Namecheap/GoDaddy/etc. and still add the required CNAME/TXT records there.

### 2) Add DNS records for App Service custom domain

In Azure Portal → App Service → Custom domains:

- Add your domain (root or subdomain).
- Azure will prompt you to add verification records.

Typical records you’ll add:

- `CNAME` (for a subdomain like `www`):
	- Host/Name: `www`
	- Value/Target: `<your-app>.azurewebsites.net`

- `TXT` (domain ownership verification):
	- Host/Name: `asuid.www` (or as instructed by Azure)
	- Value: (provided by Azure)

For apex/root domain (`example.com`), Azure commonly uses an `A` record to an App Service IP plus a TXT verification record.

### 3) Issue and bind an SSL certificate

Use an App Service Managed Certificate (simple + auto-renew):

- Azure Portal → App Service → TLS/SSL settings
- Create “App Service Managed Certificate”
- Bind it to your custom domain under “TLS/SSL bindings”

### 4) Force HTTPS

Do both (recommended):

- Azure Portal → App Service → TLS/SSL settings → **HTTPS Only: ON**
- App-level redirect support is included via middleware when `FORCE_HTTPS=true` (checks `x-forwarded-proto`).

### 5) Verify

- Visit `https://<your-domain>` and confirm the browser shows the HTTPS padlock.
- Optional: run an SSL Labs check: https://www.ssllabs.com/ssltest/

### Evidence to capture (screenshots)

- DNS records (CNAME/TXT and/or A record) in Azure DNS or your registrar
- App Service custom domain added successfully
- Certificate status / TLS binding
- Browser showing `https://` with padlock

### Reflection (what to mention)

- Renewal: App Service Managed Certificates auto-renew (reduced operational overhead)
- Multi-env: use subdomains like `dev.<domain>` / `staging.<domain>` / `api.<domain>`
- Cost/maintenance: DNS hosting + App Service plan tier requirements for certain TLS features

