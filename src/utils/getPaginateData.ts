import type { TSuccessResponse } from "@/utils/sendResponse.js";
import type { PaginateResult } from "mongoose";

export const getPaginateData = <T>(
  result: PaginateResult<T>,
): Required<Pick<TSuccessResponse<T[]>, "data" | "pagination">> => {
  const { docs, ...pagination } = result;

  return {
    data: docs,
    pagination: {
      totalDocs: pagination.totalDocs,
      totalPages: pagination.totalPages,
      hasPrevPage: pagination.hasPrevPage,
      hasNextPage: pagination.hasNextPage,
      page: pagination.page,
    },
  };
};
