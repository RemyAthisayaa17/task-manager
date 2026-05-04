import { useState, useEffect, useCallback } from "react";
import type { User } from "../types/models";
import { getAllUsersApi, deleteUserApi } from "../api/admin.api";

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
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const deleteUser = async (id: number): Promise<boolean> => {
    if (!window.confirm("Delete this user and all their tasks? This cannot be undone.")) return false;
    try {
      await deleteUserApi(id);
      setSuccess("User deleted successfully.");
      fetchUsers();
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to delete user.");
      return false;
    }
  };

  return { users, loading, error, success, deleteUser, refresh: fetchUsers };
};
