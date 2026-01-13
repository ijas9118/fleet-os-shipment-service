/**
 * Helper class for extracting and validating data from HTTP requests
 */
export class RequestHelper {
  /**
   * Parse and validate pagination parameters from query string
   */
  static parsePaginationParams(query: {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
  }): {
    page: number;
    limit: number;
    search?: string;
    status?: string;
  } {
    const page = Number.parseInt(query.page || "1") || 1;
    const limit = Number.parseInt(query.limit || "10") || 10;
    const search = query.search;
    const status = query.status;

    return { page, limit, search, status };
  }
}
