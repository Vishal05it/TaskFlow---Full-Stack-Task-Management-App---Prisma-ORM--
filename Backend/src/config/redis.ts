import { createClient } from "redis";
declare global {
  var redisClient: ReturnType<typeof createClient> | undefined;
}
export const redis =
  global.redisClient ??
  createClient({
    username: process.env.REDIS_USERNAME as string,
    password: process.env.REDIS_PASSWORD as string,
    socket: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT) as number,
    },
  });
if (!global.redisClient) {
  global.redisClient = redis;
  redis.on("error", (err) => {
    console.log("Error connecting Redis : ", err);
  });
  (async () => {
    if (!redis.isOpen) {
      await redis.connect();
      console.log("Redis Connected");
    }
  })();
  async function shutDown() {
    await redis.quit();
    console.log("Closing Redis connection");
    process.exit(0);
  }
  process.on("SIGINT", shutDown);
  process.on("SIGTERM", shutDown);
}
