import type { IShipmentCacheRepository } from "@/domain/repositories";

import { redisClient } from "@/config/redis.connect";
import { Shipment } from "@/domain/entities/shipment";

const TTL_SECONDS = 60;

export class ShipmentCacheRedis implements IShipmentCacheRepository {
  private key(id: string, tenantId: string) {
    return `shipment:${tenantId}:${id}`;
  }

  async getById(id: string, tenantId: string): Promise<Shipment | null> {
    const raw = await redisClient.get(this.key(id, tenantId));
    if (!raw)
      return null;
    const parsed = JSON.parse(raw);
    return new Shipment(parsed);
  }

  async set(shipment: Shipment): Promise<void> {
    const snapshot = shipment.propsSnapshot;
    await redisClient.setEx(
      this.key(snapshot.id!, snapshot.tenantId),
      TTL_SECONDS,
      JSON.stringify(snapshot),
    );
  }

  async invalidate(id: string, tenantId: string): Promise<void> {
    await redisClient.del(this.key(id, tenantId));
  }
}
