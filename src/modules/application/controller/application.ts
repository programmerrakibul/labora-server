import services from "@/application/service/application.js";
import { sendSuccessResponse } from "@/utils/sendResponse.js";
import type { Request, Response } from "express";
import status from "http-status";

const createApplication = async (req: Request, res: Response) => {
  const result = await services.createApplication(req.body, req.user!.id);

  sendSuccessResponse(res, status.CREATED, {
    message: "Application submitted successfully",
    data: result,
  });
};

const getApplications = async (req: Request, res: Response) => {
  const result = await services.getApplications(
    req.query,
    req.user!.id,
    req.user!.role,
  );

  sendSuccessResponse(res, status.OK, {
    message: "Applications retrieved successfully",
    ...result,
  });
};

const getApplicationById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const result = await services.getApplicationById(req.params.id);

  sendSuccessResponse(res, status.OK, {
    message: "Application retrieved successfully",
    data: result,
  });
};

const updateApplicationStatus = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const result = await services.updateApplicationStatus(
    req.params.id,
    req.body,
    req.user!.id,
    req.user!.role,
  );

  sendSuccessResponse(res, status.OK, {
    message: "Application status updated successfully",
    data: result,
  });
};

const withdrawApplication = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const result = await services.withdrawApplication(
    req.params.id,
    req.user!.id,
  );

  sendSuccessResponse(res, status.OK, {
    message: "Application withdrawn successfully",
    data: result,
  });
};

const controllers = {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication,
};

export default controllers;
