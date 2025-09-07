import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export class ResponseHelper {
  public static success<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
    };

    return res.status(statusCode).json(response);
  }

  public static error(
    res: Response,
    message: string = 'Error',
    statusCode: number = 500,
    errors?: Array<{ field: string; message: string }>
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      errors,
    };

    return res.status(statusCode).json(response);
  }

  public static paginated<T>(
    res: Response,
    data: T[],
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    },
    message: string = 'Success'
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      pagination,
    };

    return res.json(response);
  }
}

