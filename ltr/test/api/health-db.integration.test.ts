import {
  describe,
  expect,
  it,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";

jest.mock("@/lib/dbConnection", () => {
  return {
    testConnection: jest.fn(),
  };
});

// eslint-disable-next-line @typescript-eslint/no-require-imports
const dbConnection = require("@/lib/dbConnection") as {
  testConnection: jest.Mock;
};

describe("Integration: GET /api/health/db", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    dbConnection.testConnection.mockReset();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns 200 + AWS label when DB is connected (RDS)", async () => {
    dbConnection.testConnection.mockResolvedValue(true);
    process.env.DATABASE_URL = "postgresql://example.rds.amazonaws.com/db";

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { GET } = require("@/app/api/health/db/route") as {
      GET: () => Promise<Response>;
    };

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe("Database connection successful");
    expect(body.database).toBe("AWS RDS PostgreSQL");
    expect(typeof body.timestamp).toBe("string");
  });

  it("returns 200 + Azure label when DB is connected (Azure PG)", async () => {
    dbConnection.testConnection.mockResolvedValue(true);
    process.env.DATABASE_URL =
      "postgresql://user@postgres.database.azure.com:5432/db";

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { GET } = require("@/app/api/health/db/route") as {
      GET: () => Promise<Response>;
    };

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.database).toBe("Azure PostgreSQL");
  });

  it("returns 200 + Local label when DB is connected (local URL)", async () => {
    dbConnection.testConnection.mockResolvedValue(true);
    process.env.DATABASE_URL = "postgresql://localhost:5432/db";

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { GET } = require("@/app/api/health/db/route") as {
      GET: () => Promise<Response>;
    };

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.database).toBe("Local PostgreSQL (Docker)");
  });

  it("returns 500 when DB is not connected", async () => {
    dbConnection.testConnection.mockResolvedValue(false);

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { GET } = require("@/app/api/health/db/route") as {
      GET: () => Promise<Response>;
    };

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.message).toBe("Database connection failed");
  });

  it("returns 500 when DB check throws", async () => {
    dbConnection.testConnection.mockRejectedValue(new Error("db error"));

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { GET } = require("@/app/api/health/db/route") as {
      GET: () => Promise<Response>;
    };

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.message).toBe("Database health check failed");
    expect(body.error).toBe("db error");
  });
});
