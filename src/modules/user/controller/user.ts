import services from "@/user/service/user.js";
import { sendSuccessResponse } from "@/utils/sendResponse.js";
import type { Request, Response } from "express";
import status from "http-status";

const getUsers = async (req: Request, res: Response) => {
  const result = await services.getUsers(req.query);

  sendSuccessResponse(res, status.OK, {
    message: "Users retrieved successfully",
    ...result,
  });
};

const getUserById = async (req: Request<{ id: string }>, res: Response) => {
  const result = await services.getUserById(req.params.id);

  sendSuccessResponse(res, status.OK, {
    message: "User retrieved successfully",
    data: result,
  });
};

const updateProfile = async (req: Request, res: Response) => {
  const result = await services.updateProfile(req.user!.id, req.body);

  sendSuccessResponse(res, status.OK, {
    message: "Profile updated successfully",
    data: result,
  });
};

const updateUserStatus = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const result = await services.updateUserStatus(req.params.id, req.body);

  sendSuccessResponse(res, status.OK, {
    message: "User status updated successfully",
    data: result,
  });
};

const updateUserRole = async (req: Request<{ id: string }>, res: Response) => {
  const result = await services.updateUserRole(req.params.id, req.body);

  sendSuccessResponse(res, status.OK, {
    message: "User role updated successfully",
    data: result,
  });
};

const deleteUser = async (req: Request<{ id: string }>, res: Response) => {
  const result = await services.deleteUser(req.params.id);

  sendSuccessResponse(res, status.OK, {
    message: result.message,
  });
};

const controllers = {
  getUsers,
  getUserById,
  updateProfile,
  updateUserStatus,
  updateUserRole,
  deleteUser,
};

export default controllers;
