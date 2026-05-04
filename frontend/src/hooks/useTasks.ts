import { useState, useEffect, useCallback } from "react";
import type { Task, CreateTaskInput, UpdateTaskInput, PaginationMeta } from "../types/models";
import { PAGINATION_LIMIT } from "../constants/app.constants";

import {
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
  searchTasksApi,
  filterTasksApi,
  getPaginatedTasksApi,
} from "../api/task.api";

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string;
  success: string;
  pagination: PaginationMeta | null;

  searchQuery: string;
  draftSearch: string;
  statusFilter: string;
  page: number;

  setDraftSearch: (v: string) => void;
  setPage: (v: number) => void;

  submitSearch: () => void;
  applyFilter: (status: string) => void;
  clearFilters: () => void;

  createTask: (data: CreateTaskInput) => Promise<boolean>;
  updateTask: (id: number, data: UpdateTaskInput) => Promise<boolean>;
  deleteTask: (id: number) => Promise<boolean>;

  refresh: () => void;
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [draftSearch, setDraftSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  // ── FETCH TASKS ─────────────────────────────
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      if (searchQuery.trim()) {
        const res = await searchTasksApi(searchQuery);
        setTasks(res.data?.tasks ?? []);
        setPagination(null);
      } else if (statusFilter) {
        const res = await filterTasksApi(statusFilter);
        setTasks(res.data?.tasks ?? []);
        setPagination(null);
      } else {
        const res = await getPaginatedTasksApi(page, PAGINATION_LIMIT);
        setTasks(res.data?.tasks ?? []);
        setPagination(res.data?.pagination ?? null);
      }
    } catch {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, page]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ── FILTERS ─────────────────────────────
  const submitSearch = useCallback(() => {
    setStatusFilter("");
    setPage(1);
    setSearchQuery(draftSearch);
  }, [draftSearch]);

  const applyFilter = useCallback((status: string) => {
    setStatusFilter(status);
    setSearchQuery("");
    setDraftSearch("");
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setDraftSearch("");
    setStatusFilter("");
    setPage(1);
  }, []);

  // ── CREATE ─────────────────────────────
  const createTask = async (data: CreateTaskInput): Promise<boolean> => {
    try {
      await createTaskApi(data);
      setSuccess("Task created");
      fetchTasks();
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Create failed");
      return false;
    }
  };

  // ── UPDATE ─────────────────────────────
  const updateTask = async (id: number, data: UpdateTaskInput): Promise<boolean> => {
    try {
      await updateTaskApi(id, data);
      setSuccess("Task updated");
      fetchTasks();
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Update failed");
      return false;
    }
  };

  // ── DELETE (FIXED) ─────────────────────────────
  const deleteTask = async (id: number): Promise<boolean> => {
    try {
      await deleteTaskApi(id);
      setSuccess("Task deleted");
      fetchTasks();
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Delete failed");
      return false;
    }
  };

  return {
    tasks,
    loading,
    error,
    success,
    pagination,

    searchQuery,
    draftSearch,
    statusFilter,
    page,

    setDraftSearch,
    setPage,

    submitSearch,
    applyFilter,
    clearFilters,

    createTask,
    updateTask,
    deleteTask,

    refresh: fetchTasks,
  };
};