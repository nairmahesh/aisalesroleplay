import { ApiResponse, ApiError } from '../types';

export abstract class BaseService {
  protected handleError(error: any): ApiError {
    console.error('Service error:', error);

    if (error.code) {
      return {
        code: error.code,
        message: error.message || 'An error occurred',
        details: error.details,
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: error.message || 'An unexpected error occurred',
    };
  }

  protected success<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
    };
  }

  protected error(error: ApiError): ApiResponse<never> {
    return {
      success: false,
      error,
    };
  }
}
