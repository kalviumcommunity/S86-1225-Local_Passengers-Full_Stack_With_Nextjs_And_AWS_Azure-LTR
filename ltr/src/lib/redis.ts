import Redis from "ioredis";

// Create Redis client with connection pooling
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  reconnectOnError(err) {
    const targetError = "READONLY";
    if (err.message.includes(targetError)) {
      // Only reconnect when the error contains "READONLY"
      return true;
    }
    return false;
  },
});

// Error handling
redis.on("error", (err) => {
  // eslint-disable-next-line no-console
  console.error("Redis Client Error:", err);
});

redis.on("connect", () => {
  // eslint-disable-next-line no-console
  console.log("✅ Redis connected successfully");
});

export default redis;
