export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  status: Status;
  error: ApiError | null;
}

export type Role = 'admin' | 'manager' | 'sales_rep' | 'external';

export interface User extends BaseEntity {
  email: string;
  name: string;
  role: Role;
  avatar_url?: string;
  is_active: boolean;
}
