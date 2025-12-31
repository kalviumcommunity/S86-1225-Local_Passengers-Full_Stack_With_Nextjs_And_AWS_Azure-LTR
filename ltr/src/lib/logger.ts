export type LogLevel = "debug" | "info" | "warn" | "error";

type LogMeta = Record<string, unknown> | null | undefined;

function writeLog(level: LogLevel, message: string, meta?: LogMeta) {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    meta: meta ?? null,
  };

  try {
    const line = JSON.stringify(payload);
    if (level === "error") {
      // eslint-disable-next-line no-console
      console.error(line);
    } else {
      // eslint-disable-next-line no-console
      console.log(line);
    }
  } catch {
    // Fallback to plain logging
    // eslint-disable-next-line no-console
    (level === "error" ? console.error : console.log)(
      level + ":",
      message,
      meta
    );
  }
}

export const logger = {
  debug: (message: string, meta?: LogMeta) => writeLog("debug", message, meta),
  info: (message: string, meta?: LogMeta) => writeLog("info", message, meta),
  warn: (message: string, meta?: LogMeta) => writeLog("warn", message, meta),
  error: (message: string, meta?: LogMeta) => writeLog("error", message, meta),
};

export function getRequestIdFromHeaders(headers: Headers): string | undefined {
  return (
    headers.get("x-request-id") ??
    headers.get("x-correlation-id") ??
    headers.get("x-amzn-trace-id") ??
    undefined
  );
}

export function getRequestMeta(req: {
  headers: Headers;
  url?: string;
  method?: string;
}) {
  const requestId = getRequestIdFromHeaders(req.headers);

  return {
    requestId,
    endpoint: req.url,
    method: req.method,
    userId: req.headers.get("x-user-id") ?? undefined,
    userRole: req.headers.get("x-user-role") ?? undefined,
  } satisfies Record<string, unknown>;
}

export function logApiEvent(
  level: LogLevel,
  req: { headers: Headers; url?: string; method?: string },
  message: string,
  meta?: Record<string, unknown>
) {
  const reqMeta = getRequestMeta(req);
  logger[level](message, { ...reqMeta, ...(meta ?? {}) });
}

export function logApiError(
  req: { headers: Headers; url?: string; method?: string },
  error: unknown,
  message = "API request failed",
  meta?: Record<string, unknown>
) {
  const isProd = process.env.NODE_ENV === "production";
  const err = error instanceof Error ? error : new Error(String(error));
  logApiEvent("error", req, message, {
    ...(meta ?? {}),
    errorName: err.name,
    errorMessage: err.message,
    errorStack: isProd ? "REDACTED" : (err.stack ?? null),
  });
}
