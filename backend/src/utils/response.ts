import { Response } from "express";
import { HttpStatusValue } from "../constants/httpStatus";

export const sendSuccess = (
  res: Response,
  message: string,
  data: unknown = null,
  statusCode: HttpStatusValue = 200
): void => {
  res.status(statusCode).json({
    statusCode,
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: HttpStatusValue = 500,
  errors: unknown = null
): void => {
  const body: Record<string, unknown> = {
    statusCode,
    success: false,
    message,
  };

  if (errors !== null) {
    body.errors = errors;
  }

  res.status(statusCode).json(body);
};