import { sendErrorResponse } from "@/utils/sendResponse.js";
import type { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors-enhanced";

export const globalErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error("Error from global error handler: ", err);
  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof HttpError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  return sendErrorResponse(res, statusCode, message);
};
