
// Define custom API error type that includes response property
export interface ApiError extends Error {
  response?: {
    data?: {
      error?: string;
    };
  };
}
