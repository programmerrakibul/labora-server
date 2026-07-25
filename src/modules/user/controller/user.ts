import services from "@/user/service/user.js";
import { sendSuccessResponse } from "@/utils/sendResponse.js";
import type { Request, Response } from "express";
import status from "http-status";

const getUsers = async (_req: Request, res: Response) => {
  const result = await services.getUsers();

  sendSuccessResponse(res, status.OK, {
    message: "Users data successfully retrieved",
    ...result,
  });
};

const getUserById = async (req: Request<{ id: string }>, res: Response) => {
  const result = await services.getUserById(req.params.id);

  sendSuccessResponse(res, status.OK, {
    message: "Single user data retrieved successfully",
    data: result,
  });
};

const controllers = {
  getUserById,
  getUsers,
};

export default controllers;
