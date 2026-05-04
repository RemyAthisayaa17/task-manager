import api from "./axios";
import type {
  ApiResponse,
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  PaginatedTasksResponse,
} from "../types/models";

export const getAllTasksApi = async (): Promise<
  ApiResponse<{ count: number; tasks: Task[] }>
> => {
  const res = await api.get("/tasks");
  return res.data;
};

export const getTaskByIdApi = async (id: number): Promise<ApiResponse<Task>> => {
  const res = await api.get(`/tasks/${id}`);
  return res.data;
};

export const createTaskApi = async (
  data: CreateTaskInput
): Promise<ApiResponse<Task>> => {
  const res = await api.post("/tasks", data);
  return res.data;
};

export const updateTaskApi = async (
  id: number,
  data: UpdateTaskInput
): Promise<ApiResponse<Task>> => {
  const res = await api.put(`/tasks/${id}`, data);
  return res.data;
};

export const deleteTaskApi = async (id: number): Promise<ApiResponse<null>> => {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
};

export const searchTasksApi = async (
  query: string
): Promise<ApiResponse<{ count: number; tasks: Task[] }>> => {
  const res = await api.get(`/tasks/search?q=${encodeURIComponent(query)}`);
  return res.data;
};

export const filterTasksApi = async (
  status: string
): Promise<ApiResponse<{ count: number; tasks: Task[] }>> => {
  const res = await api.get(`/tasks/filter?status=${status}`);
  return res.data;
};

export const getPaginatedTasksApi = async (
  page: number,
  limit: number
): Promise<ApiResponse<PaginatedTasksResponse>> => {
  const res = await api.get(`/tasks/paginated?page=${page}&limit=${limit}`);
  return res.data;
};