import {
  describe,
  expect,
  it,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";

jest.mock("@/lib/cloudSecrets", () => {
  return {
    getSecretsDiagnostics: jest.fn(),
    getSecretValue: jest.fn(),
  };
});

// eslint-disable-next-line @typescript-eslint/no-require-imports
const cloudSecrets = require("@/lib/cloudSecrets") as {
  getSecretsDiagnostics: jest.Mock;
  getSecretValue: jest.Mock;
};

describe("Integration: GET /api/health/secrets", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    cloudSecrets.getSecretsDiagnostics.mockReset();
    cloudSecrets.getSecretValue.mockReset();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns 200 with metadata (dev mode)", async () => {
    process.env.NODE_ENV = "development";

    cloudSecrets.getSecretsDiagnostics.mockResolvedValue({
      provider: "aws-secrets-manager",
      keys: ["DATABASE_URL", "JWT_SECRET"],
    });

    cloudSecrets.getSecretValue.mockImplementation(async (key: string) => {
      if (key === "DATABASE_URL") return "postgres://masked";
      if (key === "JWT_SECRET") return "masked";
      if (key === "JWT_REFRESH_SECRET") return null;
      return null;
    });

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { GET } = require("@/app/api/health/secrets/route") as {
      GET: (req: Request) => Promise<Response>;
    };

    const req = new Request("http://localhost:5174/api/health/secrets");
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.provider).toBe("aws-secrets-manager");
    expect(Array.isArray(body.keysLoaded)).toBe(true);
    expect(body.probes).toEqual({
      DATABASE_URL: true,
      JWT_SECRET: true,
      JWT_REFRESH_SECRET: false,
    });
    expect(typeof body.timestamp).toBe("string");
  });

  it("returns 404 in production when SECRETS_DEBUG_TOKEN is not set", async () => {
    process.env.NODE_ENV = "production";
    delete process.env.SECRETS_DEBUG_TOKEN;

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { GET } = require("@/app/api/health/secrets/route") as {
      GET: (req: Request) => Promise<Response>;
    };

    const req = new Request("http://localhost:5174/api/health/secrets");
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.success).toBe(false);
    expect(body.message).toBe("Not found");
  });

  it("returns 403 in production when debug token is wrong", async () => {
    process.env.NODE_ENV = "production";
    process.env.SECRETS_DEBUG_TOKEN = "expected";

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { GET } = require("@/app/api/health/secrets/route") as {
      GET: (req: Request) => Promise<Response>;
    };

    const req = new Request("http://localhost:5174/api/health/secrets", {
      headers: {
        "x-debug-token": "wrong",
      },
    });

    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.message).toBe("Forbidden");
  });

  it("returns 500 when secrets provider throws", async () => {
    process.env.NODE_ENV = "development";
    cloudSecrets.getSecretsDiagnostics.mockRejectedValue(
      new Error("provider down")
    );

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { GET } = require("@/app/api/health/secrets/route") as {
      GET: (req: Request) => Promise<Response>;
    };

    const req = new Request("http://localhost:5174/api/health/secrets");
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.message).toBe("Secrets retrieval failed");
    expect(body.error).toBe("provider down");
  });
});
