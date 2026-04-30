import { Response } from "express";
import { AuthRequest } from "../types/user.types";
import { sendSuccess, sendError } from "../utils/response";
import { getAllUsersService, getUserByIdService, deleteUserService } from "../services/admin.service";
import { HTTP_STATUS } from "../constants/httpStatus";

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await getAllUsersService();
    sendSuccess(res, "Users fetched successfully", { count: users.length, users });
  } catch (error: unknown) {
    sendError(res, "Failed to fetch users");
  }
};

export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId) || userId <= 0) {
      sendError(res, "Invalid user ID", HTTP_STATUS.BAD_REQUEST);
      return;
    }

    const user = await getUserByIdService(userId);
    sendSuccess(res, "User fetched successfully", user);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch user";
    const statusCode = message === "User not found" ? HTTP_STATUS.NOT_FOUND : HTTP_STATUS.SERVER_ERROR;
    sendError(res, message, statusCode);
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const targetId = parseInt(req.params.id);
    const adminId = req.user!.id;

    if (isNaN(targetId) || targetId <= 0) {
      sendError(res, "Invalid user ID", HTTP_STATUS.BAD_REQUEST);
      return;
    }

    if (targetId === adminId) {
      sendError(res, "You cannot delete your own account", HTTP_STATUS.BAD_REQUEST);
      return;
    }

    const deleted = await deleteUserService(targetId);
    sendSuccess(res, "User deleted successfully", deleted);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete user";
    const statusCode = message === "User not found" ? HTTP_STATUS.NOT_FOUND : HTTP_STATUS.SERVER_ERROR;
    sendError(res, message, statusCode);
  }
};