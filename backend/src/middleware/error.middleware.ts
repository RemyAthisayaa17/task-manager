import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);
  res.status(HTTP_STATUS.SERVER_ERROR).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
};