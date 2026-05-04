export const TASK_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
} as const;

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const;

export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL ?? "http://localhost:5000/api";

export const PAGINATION_LIMIT = 10;

// ─── Admin credentials (single assigned admin account) ────────────────────────

export const ADMIN_EMAIL    = "admin@taskmanager.com";
export const ADMIN_PASSWORD = "Admin@1234";