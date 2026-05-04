import api from "./axios";
import type { ApiResponse, User } from "../types/models";

export const getAllUsersApi = async (): Promise<
  ApiResponse<{ count: number; users: User[] }>
> => {
  const res = await api.get("/admin/users");
  return res.data;
};

export const getUserByIdApi = async (id: number): Promise<ApiResponse<User>> => {
  const res = await api.get(`/admin/users/${id}`);
  return res.data;
};

export const deleteUserApi = async (id: number): Promise<ApiResponse<null>> => {
  const res = await api.delete(`/admin/users/${id}`);
  return res.data;
};
