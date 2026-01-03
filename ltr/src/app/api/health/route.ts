import { NextResponse } from "next/server";

/**
 * Application Health Check
 * GET /api/health
 *
 * Returns 200 when healthy. Set environment variable `FORCE_HEALTH_FAIL=1`
 * to simulate a failing health check (returns 500) for rollback testing.
 */
export async function GET() {
  try {
    if (process.env.FORCE_HEALTH_FAIL === "1") {
      return NextResponse.json(
        {
          success: false,
          status: "fail",
          message: "Forced failure for CI rollback testing",
          uptime: process.uptime(),
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        success: false,
        status: "error",
        message,
      },
      { status: 500 }
    );
  }
}
