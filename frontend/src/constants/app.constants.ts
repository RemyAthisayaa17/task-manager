export const TASK_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
} as const;

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const;

// Backend default port is 3000 (see backend/src/server.ts: PORT || 3000)
// Override via VITE_API_BASE_URL in .env
export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL ?? "http://localhost:3000/api";

export const PAGINATION_LIMIT = 10;