export interface ListShipmentsDTO {
  tenantId: string;
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  includeCancelled?: boolean;
}
