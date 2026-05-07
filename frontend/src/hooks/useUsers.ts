import { useState, useEffect, useCallback } from "react";
import type { User } from "../types/models";
import { getAllUsersApi, deleteUserApi } from "../api/admin.api";
import { showToast } from "../utils/toast";

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string;
  success: string;
  deleteUser: (id: number) => Promise<boolean>;
  refresh: () => void;
}

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 3000);
    return () => clearTimeout(t);
  }, [success]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllUsersApi();
      setUsers(res.data?.users ?? []);
    } catch {
      const msg = "Failed to load users.";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // NOTE: Confirmation is handled by DeleteUserModal — no window.confirm here
  const deleteUser = async (id: number): Promise<boolean> => {
    try {
      await deleteUserApi(id);
      const msg = "User removed successfully.";
      setSuccess(msg);
      showToast(msg, "success");
      fetchUsers();
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message ?? "Failed to delete user.";
      setError(msg);
      showToast(msg, "error");
      return false;
    }
  };

  return { users, loading, error, success, deleteUser, refresh: fetchUsers };
};