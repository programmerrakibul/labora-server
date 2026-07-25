import type { Response } from "express";
import type { CustomLabels } from "mongoose";

export type TPaginateLabel = CustomLabels<number | boolean | null | undefined>;

export type TPagination = {
  totalDocs: TPaginateLabel["totalDocs"];
  hasPrevPage: TPaginateLabel["hasPrevPage"];
  hasNextPage: TPaginateLabel["hasNextPage"];
  totalPages: TPaginateLabel["totalPages"];
  page?: TPaginateLabel["page"];
};

export type TSuccessResponse<T> = {
  success: true;
  message: string;
  data?: T;
  pagination?: TPagination;
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
