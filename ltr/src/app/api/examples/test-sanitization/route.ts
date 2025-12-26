/**
 * Input Sanitization Testing Endpoint
 * GET /api/examples/test-sanitization
 *
 * Tests various sanitization scenarios for demonstration
 */

import { NextRequest, NextResponse } from "next/server";
import {
  sanitizeHtml,
  sanitizeEmail,
  sanitizePhone,
  sanitizeUrl,
  sanitizeTrainNumber,
  sanitizeStationCode,
  containsXssPattern,
  containsSqlInjectionPattern,
} from "@/lib/sanitize";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const testInput = searchParams.get("input") || "";

  // Run all sanitization tests
  const results = {
    original: testInput,
    tests: {
      htmlSanitization: {
        input: testInput,
        output: sanitizeHtml(testInput),
        description: "Removes HTML tags and escapes dangerous characters",
      },
      emailSanitization: {
        input: testInput,
        output: sanitizeEmail(testInput),
        description: "Validates and cleans email addresses",
      },
      phoneSanitization: {
        input: testInput,
        output: sanitizePhone(testInput),
        description: "Allows only valid phone characters",
      },
      urlSanitization: {
        input: testInput,
        output: sanitizeUrl(testInput),
        description: "Validates URLs and allows only http/https",
      },
      trainNumberSanitization: {
        input: testInput,
        output: sanitizeTrainNumber(testInput),
        description: "Extracts 4-6 digit train numbers",
      },
      stationCodeSanitization: {
        input: testInput,
        output: sanitizeStationCode(testInput),
        description: "Extracts 3-4 letter station codes",
      },
    },
    securityChecks: {
      containsXss: containsXssPattern(testInput),
      containsSqlInjection: containsSqlInjectionPattern(testInput),
    },
    verdict: getVerdictFromInput(testInput),
  };

  return NextResponse.json({
    success: true,
    data: results,
  });
}

function getVerdictFromInput(input: string): {
  safe: boolean;
  reasons: string[];
  recommendation: string;
} {
  const reasons: string[] = [];

  if (containsXssPattern(input)) {
    reasons.push("Contains potential XSS patterns");
  }

  if (containsSqlInjectionPattern(input)) {
    reasons.push("Contains potential SQL injection patterns");
  }

  if (/<script/i.test(input)) {
    reasons.push("Contains script tags");
  }

  if (/javascript:/i.test(input)) {
    reasons.push("Contains javascript: protocol");
  }

  if (/on\w+\s*=/i.test(input)) {
    reasons.push("Contains event handler attributes");
  }

  const safe = reasons.length === 0;

  return {
    safe,
    reasons,
    recommendation: safe
      ? "Input appears safe to use"
      : "Input should be sanitized before use",
  };
}
