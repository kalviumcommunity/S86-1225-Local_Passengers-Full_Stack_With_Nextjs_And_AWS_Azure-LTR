import { NextResponse } from "next/server";
import { logger } from "./logger";

export function handleError(error: any, context = "unknown") {
  const isProd = process.env.NODE_ENV === "production";

  const message = error?.message || "Something went wrong";

  // Log full details internally; redact stack in production
  logger.error(`Error in ${context}`, {
    message,
    stack: isProd ? "REDACTED" : error?.stack ?? null,
    name: error?.name ?? null,
  });

  const errorResponse: Record<string, any> = {
    success: false,
    message: isProd ? "Something went wrong. Please try again later." : message,
  };

  if (!isProd) {
    errorResponse.stack = error?.stack ?? null;
  }

  return NextResponse.json(errorResponse, { status: 500 });
}

export default handleError;
