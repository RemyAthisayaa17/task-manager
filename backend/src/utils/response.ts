import { Response } from "express";

export const sendSuccess = (
  res: Response,
  message: string,
  data: unknown = null,
  statusCode: number = 200
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  errors: unknown = null
): void => {
  const response: any = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  res.status(statusCode).json(response);
};