import logger from "./logger";
import connectMongo from "./mongo.connect";
import { initRedisClient } from "./redis.connect";

export async function initConfig() {
  logger.info("Initializing application configuration...");
  await connectMongo();
  initRedisClient();
}
