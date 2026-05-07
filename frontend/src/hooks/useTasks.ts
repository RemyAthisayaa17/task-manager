import { useState, useEffect, useCallback } from "react";
import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  PaginationMeta,
} from "../types/models";

import { PAGINATION_LIMIT } from "../constants/app.constants";
import { showToast } from "../utils/toast";

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

  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [draftSearch, setDraftSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  // ─────────────────────────────────────────────
  // CORE FETCH LOGIC (SINGLE SOURCE OF TRUTH)
  // ─────────────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      let res;

      // PRIORITY 1: SEARCH
      if (searchQuery.trim()) {
        res = await searchTasksApi(searchQuery);

        setTasks(res.data?.tasks ?? []);
        setPagination(null);
        return;
      }

      // PRIORITY 2: FILTER
      if (statusFilter) {
        res = await filterTasksApi(statusFilter);

        setTasks(res.data?.tasks ?? []);
        setPagination(null);
        return;
      }

      // PRIORITY 3: PAGINATION (DEFAULT)
      res = await getPaginatedTasksApi(page, PAGINATION_LIMIT);

      setTasks(res.data?.tasks ?? []);
      setPagination(res.data?.pagination ?? null);

    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to load tasks";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, page]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ─────────────────────────────────────────────
  // SEARCH
  // ─────────────────────────────────────────────
  const submitSearch = useCallback(() => {
    setStatusFilter("");
    setPage(1);
    setSearchQuery(draftSearch.trim());
  }, [draftSearch]);

  // ─────────────────────────────────────────────
  // FILTER
  // ─────────────────────────────────────────────
  const applyFilter = useCallback((status: string) => {
    setSearchQuery("");
    setDraftSearch("");
    setPage(1);
    setStatusFilter(status);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setDraftSearch("");
    setStatusFilter("");
    setPage(1);
  }, []);

  // ─────────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────────
  const createTask = async (data: CreateTaskInput): Promise<boolean> => {
    try {
      await createTaskApi(data);

      showToast("Task created successfully", "success");
      fetchTasks();

      return true;
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to create task";

      showToast(msg, "error");
      setError(msg);

      return false;
    }
  };

  // ─────────────────────────────────────────────
  // UPDATE
  // ─────────────────────────────────────────────
  const updateTask = async (
    id: number,
    data: UpdateTaskInput
  ): Promise<boolean> => {
    try {
      await updateTaskApi(id, data);

      showToast("Task updated successfully", "success");
      fetchTasks();

      return true;
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to update task";

      showToast(msg, "error");
      setError(msg);

      return false;
    }
  };

  // ─────────────────────────────────────────────
  // DELETE
  // ─────────────────────────────────────────────
  const deleteTask = async (id: number): Promise<boolean> => {
    try {
      await deleteTaskApi(id);

      showToast("Task deleted successfully", "success");
      fetchTasks();

      return true;
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to delete task";

      showToast(msg, "error");
      setError(msg);

      return false;
    }
  };

  // ─────────────────────────────────────────────
  // REFRESH
  // ─────────────────────────────────────────────
  const refresh = useCallback(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,

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

    refresh,
  };
};