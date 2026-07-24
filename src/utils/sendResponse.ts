import type { Response } from "express";

export type TSuccessResponse<T> = {
  success: true;
  message: string;
  data?: T;
  pagination?: unknown;
};

export type TErrorResponse = {
  success: false;
  error: string;
};

export type TResponse<T> = TSuccessResponse<T> | TErrorResponse;

export const sendSuccessResponse = <T>(
  res: Response,
  statusCode: number,
  data: Omit<TSuccessResponse<T>, "success">,
) => {
  return sendResponse(res, statusCode, { success: true, ...data });
};

export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  error: TErrorResponse["error"],
) => {
  return sendResponse(res, statusCode, { success: false, error });
};

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  data: TResponse<T>,
) => {
  return res.status(statusCode).send(data);
};
