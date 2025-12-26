/**
 * Example API Route with Input Sanitization
 * POST /api/examples/sanitized-alert
 *
 * Demonstrates proper input sanitization and OWASP compliance
 */

import { NextRequest, NextResponse } from "next/server";
import {
  withInputSanitization,
  sanitizeRequestBody,
} from "@/lib/sanitizationMiddleware";
import { sanitizeInput } from "@/lib/sanitize";
import { z } from "zod";

// Zod schema for validation (first line of defense)
const alertSchema = z.object({
  trainNumber: z.string().min(4).max(10),
  trainName: z.string().min(1).max(200),
  message: z.string().min(1).max(500),
  severity: z.enum(["low", "medium", "high", "critical"]),
});

export async function POST(req: NextRequest) {
  try {
    // Step 1: Check for malicious patterns (second line of defense)
    const maliciousCheck = await withInputSanitization(req);
    if (maliciousCheck) return maliciousCheck;

    // Step 2: Sanitize request body (third line of defense)
    const sanitizedBody = await sanitizeRequestBody(req);

    // Step 3: Validate with Zod schema
    const validation = alertSchema.safeParse(sanitizedBody);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { trainNumber, trainName, message, severity } = validation.data;

    // Step 4: Additional field-specific sanitization
    const cleanTrainNumber = sanitizeInput(trainNumber, {
      type: "alphanumeric",
    });
    const cleanTrainName = sanitizeInput(trainName, {
      type: "text",
      maxLength: 200,
    });
    const cleanMessage = sanitizeInput(message, {
      type: "text",
      maxLength: 500,
    });

    // Step 5: Database operation (Prisma prevents SQL injection by default)
    // const alert = await prisma.alert.create({
    //   data: {
    //     trainNumber: cleanTrainNumber,
    //     trainName: cleanTrainName,
    //     message: cleanMessage,
    //     severity,
    //   },
    // });

    // Simulated response
    const alert = {
      id: Math.floor(Math.random() * 10000),
      trainNumber: cleanTrainNumber,
      trainName: cleanTrainName,
      message: cleanMessage,
      severity,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Alert created successfully with sanitized input",
      data: alert,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create alert",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
