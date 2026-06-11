type ApiError = {
  message: string;
  status?: number;
};

export type ApiResponse<T> = {
  message: string;
  data: T | null;
  success: boolean;
  error?: ApiError;
};
