export interface ListShipmentsDTO {
  tenantId: string;
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  // startDate?: Date;
  // endDate?: Date;
  includeCancelled?: boolean;
}
