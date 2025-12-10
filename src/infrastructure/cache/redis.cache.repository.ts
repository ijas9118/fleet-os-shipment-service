import { redisClient } from "@/config/redis.connect";

import type { ICacheRepository } from "./cache.repository";

export class RedisCacheRepository implements ICacheRepository {
  async get<T>(key: string): Promise<T | null> {
    const raw = await redisClient.get(key);
    return raw ? JSON.parse(raw) : null;
  }

  async set<T>(key: string, value: T, ttlSeconds = 60): Promise<void> {
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
  }

  async delete(key: string): Promise<void> {
    await redisClient.del(key);
  }
}
