// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  gender?: string;
  role: string;
  isActive?: boolean;
  createdAt?: string;
  /** Returned by admin service: prisma _count relation */
  _count?: { tasks: number };
}

/**
 * Stored in AuthContext after login.
 * Backend loginService returns: { id, name, email, role }
 */
export interface JwtPayload {
  id: number;
  name: string;
  email: string;
  role: string;
}

// ─── Task ────────────────────────────────────────────────────────────────────

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

// ─── Pagination ──────────────────────────────────────────────────────────────

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedTasksResponse {
  tasks: Task[];
  pagination: PaginationMeta;
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

// ─── Form Inputs ──────────────────────────────────────────────────────────────

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  password: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: string;
}
