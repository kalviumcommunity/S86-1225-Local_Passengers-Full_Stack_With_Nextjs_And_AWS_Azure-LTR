import { Pool } from "pg";
import { getSecretValue } from "./cloudSecrets";
import { logger } from "./logger";

/**
 * PostgreSQL Connection Utility
 *
 * Supports both local (Docker) and cloud (AWS RDS/Azure) databases
 * Automatically handles SSL for cloud connections
 */

let pool: Pool | null = null;

async function getDatabaseUrl(): Promise<string> {
  const url = (await getSecretValue("DATABASE_URL"))?.trim();
  if (!url) {
    throw new Error(
      "DATABASE_URL is not configured (set it in env or provide it via AWS Secrets Manager)"
    );
  }
  return url;
}

async function getPool(): Promise<Pool> {
  if (pool) return pool;

  const databaseUrl = await getDatabaseUrl();

  pool = new Pool({
    connectionString: databaseUrl,
    // Enable SSL for cloud databases (RDS/Azure)
    ssl:
      databaseUrl.includes("rds.amazonaws.com") ||
      databaseUrl.includes("postgres.database.azure.com")
        ? { rejectUnauthorized: false }
        : false,
    // Connection pool settings
    max: 20, // Maximum connections in pool
    idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
    connectionTimeoutMillis: 2000, // Connection timeout
  });

  return pool;
}

/**
 * Test database connection
 * Useful for health checks and debugging
 */
export async function testConnection(): Promise<boolean> {
  try {
    const dbPool = await getPool();
    const result = await dbPool.query(
      "SELECT NOW() as current_time, version() as db_version"
    );
    logger.info("Database connected", {
      time: result.rows[0].current_time,
      version:
        result.rows[0].db_version.split(" ")[0] +
        " " +
        result.rows[0].db_version.split(" ")[1],
    });
    return true;
  } catch (error) {
    logger.error("Database connection failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

/**
 * Execute a query
 */
export async function query(text: string, params?: unknown[]) {
  const start = Date.now();
  try {
    const dbPool = await getPool();
    const res = await dbPool.query(text, params);
    const duration = Date.now() - start;
    logger.info("Executed query", { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    logger.error("Query error", {
      text,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

/**
 * Get a client from the pool for transactions
 */
export async function getClient() {
  const dbPool = await getPool();
  const client = await dbPool.connect();
  const release = client.release;

  // Set a timeout of 5 seconds, after which we will log this client's last query
  const timeout = setTimeout(() => {
    logger.error("A client has been checked out for more than 5 seconds");
  }, 5000);

  client.release = () => {
    clearTimeout(timeout);
    client.release = release;
    return release.apply(client);
  };

  return client;
}

export { getPool };

export default pool;
