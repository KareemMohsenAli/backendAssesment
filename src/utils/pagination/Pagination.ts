export interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export class Pagination {
  public static calculateOffset(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  public static calculateTotalPages(total: number, limit: number): number {
    return Math.ceil(total / limit);
  }

  public static createPaginationResult<T>(
    data: T[],
    options: PaginationOptions
  ): PaginationResult<T> {
    const { page, limit, total } = options;
    const totalPages = this.calculateTotalPages(total, limit);

    return {
      data,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  public static validatePaginationParams(page?: number, limit?: number): {
    page: number;
    limit: number;
  } {
    const defaultPage = 1;
    const defaultLimit = 10;
    const maxLimit = 100;

    const validatedPage = page && page > 0 ? page : defaultPage;
    const validatedLimit = limit && limit > 0 && limit <= maxLimit ? limit : defaultLimit;

    return {
      page: validatedPage,
      limit: validatedLimit,
    };
  }
}

