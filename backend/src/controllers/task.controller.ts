import { Response } from "express";
import { AuthRequest } from "../types/user.types";
import { sendSuccess, sendError } from "../utils/response";
import {
  createTaskService,
  getAllTasksService,
  getTaskByIdService,
  updateTaskService,
  deleteTaskService,
  searchTasksService,
  filterTasksByStatusService,
  getPaginatedTasksService,
} from "../services/task.service";
import { TASK_STATUS } from "../constants/taskStatus";
import { HTTP_STATUS, HttpStatusValue } from "../constants/httpStatus";

const getErrorStatus = (message: string): HttpStatusValue => {
  if (message === "Task not found") return HTTP_STATUS.NOT_FOUND;
  if (message === "Forbidden") return HTTP_STATUS.FORBIDDEN;
  return HTTP_STATUS.SERVER_ERROR;
};

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await createTaskService({
      title: req.body.title,
      description: req.body.description,
      userId: req.user!.id,
    });
    sendSuccess(res, "Task created successfully", task, HTTP_STATUS.CREATED);
  } catch {
    sendError(res, "Failed to create task", HTTP_STATUS.SERVER_ERROR);
  }
};

export const getAllTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: userId, role } = req.user!;
    const tasks = await getAllTasksService(userId, role);
    sendSuccess(res, "Tasks fetched successfully", { count: tasks.length, tasks });
  } catch {
    sendError(res, "Failed to fetch tasks", HTTP_STATUS.SERVER_ERROR);
  }
};

export const getTaskById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: userId, role } = req.user!;
    const task = await getTaskByIdService(parseInt(req.params.id), userId, role);
    sendSuccess(res, "Task fetched successfully", task);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch task";
    sendError(res, message, getErrorStatus(message));
  }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: userId, role } = req.user!;
    const task = await updateTaskService(parseInt(req.params.id), userId, role, req.body);
    sendSuccess(res, "Task updated successfully", task);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update task";
    sendError(res, message, getErrorStatus(message));
  }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: userId, role } = req.user!;
    await deleteTaskService(parseInt(req.params.id), userId, role);
    sendSuccess(res, "Task deleted successfully", null);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete task";
    sendError(res, message, getErrorStatus(message));
  }
};

export const searchTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: userId, role } = req.user!;
    const query = (req.query.q as string) || "";

    if (!query.trim()) {
      sendError(res, "Search query is required", HTTP_STATUS.BAD_REQUEST);
      return;
    }

    const tasks = await searchTasksService(userId, role, query);
    sendSuccess(res, "Search results fetched", { count: tasks.length, tasks });
  } catch {
    sendError(res, "Search failed", HTTP_STATUS.SERVER_ERROR);
  }
};

export const filterTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: userId, role } = req.user!;
    const status = req.query.status as string;

    const isValidStatus = status === TASK_STATUS.PENDING || status === TASK_STATUS.COMPLETED;

    if (!status || !isValidStatus) {
      sendError(res, "Status must be pending or completed", HTTP_STATUS.BAD_REQUEST);
      return;
    }

    const tasks = await filterTasksByStatusService(userId, role, status);
    sendSuccess(res, "Filtered tasks fetched", { count: tasks.length, tasks });
  } catch {
    sendError(res, "Filter failed", HTTP_STATUS.SERVER_ERROR);
  }
};

export const getPaginatedTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: userId, role } = req.user!;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));

    const result = await getPaginatedTasksService(userId, role, page, limit);
    sendSuccess(res, "Tasks fetched with pagination", result);
  } catch {
    sendError(res, "Pagination failed", HTTP_STATUS.SERVER_ERROR);
  }
};