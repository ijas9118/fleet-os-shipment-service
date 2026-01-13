1. User creates shipment →
2. Shipment Service calls Inventory Service API →
3. Inventory Service validates stock & creates reservation →
4. Returns reservationId (or throws InsufficientStockError) →
5. Shipment Service stores reservationId and creates shipment
