export const logger = {
  info: (message: string, meta?: any) => {
    try {
      const payload = { level: "info", message, meta: meta ?? null, timestamp: new Date().toISOString() };
      // Keep logs structured for easier ingestion by log services
      console.log(JSON.stringify(payload));
    } catch (e) {
      // Fallback to plain logging
      // eslint-disable-next-line no-console
      console.log("info:", message, meta);
    }
  },
  error: (message: string, meta?: any) => {
    try {
      const payload = { level: "error", message, meta: meta ?? null, timestamp: new Date().toISOString() };
      // eslint-disable-next-line no-console
      console.error(JSON.stringify(payload));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("error:", message, meta);
    }
  },
};
