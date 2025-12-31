import { NextResponse } from "next/server";
import { testConnection } from "@/lib/dbConnection";
import { logApiError, logApiEvent } from "@/lib/logger";

/**
 * Database Health Check Endpoint
 * GET /api/health/db
 *
 * Tests connection to PostgreSQL database
 * Works with both local (Docker) and cloud (RDS/Azure) databases
 */
export async function GET(req: Request) {
  const start = Date.now();
  logApiEvent("info", req, "DB health check received");

  try {
    const isConnected = await testConnection();

    if (isConnected) {
      logApiEvent("info", req, "DB health check ok", {
        durationMs: Date.now() - start,
        status: 200,
      });
      return NextResponse.json({
        success: true,
        message: "Database connection successful",
        database: process.env.DATABASE_URL?.includes("rds.amazonaws.com")
          ? "AWS RDS PostgreSQL"
          : process.env.DATABASE_URL?.includes("postgres.database.azure.com")
            ? "Azure PostgreSQL"
            : "Local PostgreSQL (Docker)",
        timestamp: new Date().toISOString(),
      });
    } else {
      logApiEvent("warn", req, "DB health check failed", {
        durationMs: Date.now() - start,
        status: 500,
      });
      return NextResponse.json(
        {
          success: false,
          message: "Database connection failed",
          error: "Could not establish connection",
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    logApiError(req, error, "DB health check error", {
      durationMs: Date.now() - start,
      status: 500,
    });

    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        success: false,
        message: "Database health check failed",
        error: message,
      },
      { status: 500 }
    );
  }
}
