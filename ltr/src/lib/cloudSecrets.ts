import "server-only";

type SecretsProvider = "aws" | "none";

type SecretsMap = Record<string, string>;

let cachedProvider: SecretsProvider | null = null;
let cachedSecrets: SecretsMap | null = null;
let pendingLoad: Promise<{
  provider: SecretsProvider;
  secrets: SecretsMap;
}> | null = null;

function normalizeProvider(value: string | undefined): SecretsProvider | null {
  if (!value) return null;
  const v = value.trim().toLowerCase();
  if (v === "aws") return "aws";
  if (v === "none") return "none";
  return null;
}

function isAwsConfigured(): boolean {
  const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
  const secretId =
    process.env.AWS_SECRET_ARN ||
    process.env.AWS_SECRET_ID ||
    process.env.AWS_SECRETS_MANAGER_SECRET_ID ||
    process.env.SECRET_ARN;
  return Boolean(region && secretId);
}

function resolveProvider(): SecretsProvider {
  const forced = normalizeProvider(process.env.CLOUD_SECRETS_PROVIDER);
  if (forced) return forced;
  if (isAwsConfigured()) return "aws";
  return "none";
}

async function loadAwsSecrets(): Promise<SecretsMap> {
  const { SecretsManagerClient, GetSecretValueCommand } =
    await import("@aws-sdk/client-secrets-manager");

  const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
  const secretId =
    process.env.AWS_SECRET_ARN ||
    process.env.AWS_SECRET_ID ||
    process.env.AWS_SECRETS_MANAGER_SECRET_ID ||
    process.env.SECRET_ARN;

  if (!region) {
    throw new Error(
      "AWS_REGION is required to retrieve secrets from AWS Secrets Manager"
    );
  }
  if (!secretId) {
    throw new Error(
      "AWS secret identifier is required (set AWS_SECRET_ARN or AWS_SECRET_ID or AWS_SECRETS_MANAGER_SECRET_ID)"
    );
  }

  const client = new SecretsManagerClient({ region });
  const response = await client.send(
    new GetSecretValueCommand({ SecretId: secretId })
  );
  const secretString = response.SecretString;
  if (!secretString) {
    throw new Error("AWS Secrets Manager returned an empty SecretString");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(secretString);
  } catch {
    throw new Error(
      "AWS secret must be a JSON object string (key/value pairs)"
    );
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("AWS secret JSON must be an object of key/value pairs");
  }

  const secrets: SecretsMap = {};
  for (const [key, value] of Object.entries(
    parsed as Record<string, unknown>
  )) {
    if (typeof value === "string") secrets[key] = value;
  }

  return secrets;
}

/**
 * Loads and caches secrets from the configured provider.
 * - AWS: single JSON secret containing many key/value pairs.
 */
export async function getCloudSecrets(): Promise<{
  provider: SecretsProvider;
  secrets: SecretsMap;
}> {
  if (cachedProvider && cachedSecrets)
    return { provider: cachedProvider, secrets: cachedSecrets };
  if (pendingLoad) return pendingLoad;

  pendingLoad = (async () => {
    const provider = resolveProvider();

    if (provider === "none") {
      cachedProvider = "none";
      cachedSecrets = {};
      return { provider: "none" as const, secrets: {} };
    }

    if (provider === "aws") {
      const secrets = await loadAwsSecrets();
      cachedProvider = "aws";
      cachedSecrets = secrets;
      return { provider: "aws" as const, secrets };
    }

    cachedProvider = "none";
    cachedSecrets = {};
    return { provider: "none" as const, secrets: {} };
  })();

  try {
    return await pendingLoad;
  } finally {
    pendingLoad = null;
  }
}

/**
 * Returns a secret value by name.
 * Priority order:
 * 1) process.env[name]
 * 2) Cloud secret manager (AWS JSON object)
 */
export async function getSecretValue(
  name: string
): Promise<string | undefined> {
  const direct = process.env[name];
  if (direct) return direct;

  const { provider, secrets } = await getCloudSecrets();
  if (provider === "aws") return secrets[name];
  return undefined;
}

export async function getSecretsDiagnostics(): Promise<{
  provider: SecretsProvider;
  keys: string[];
}> {
  const { provider, secrets } = await getCloudSecrets();
  return { provider, keys: Object.keys(secrets).sort() };
}
