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

