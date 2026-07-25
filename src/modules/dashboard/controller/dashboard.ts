import services from "@/dashboard/service/dashboard.js";
import { sendSuccessResponse } from "@/utils/sendResponse.js";
import type { Request, Response } from "express";
import status from "http-status";

const getAdminStats = async (_req: Request, res: Response) => {
  const result = await services.getAdminStats();

  sendSuccessResponse(res, status.OK, {
    message: "Admin dashboard stats retrieved successfully",
    data: result,
  });
};

const getRecruiterStats = async (req: Request, res: Response) => {
  const result = await services.getRecruiterStats(req.user!.id);

  sendSuccessResponse(res, status.OK, {
    message: "Recruiter dashboard stats retrieved successfully",
    data: result,
  });
};

const getJobSeekerStats = async (req: Request, res: Response) => {
  const result = await services.getJobSeekerStats(req.user!.id);

  sendSuccessResponse(res, status.OK, {
    message: "Job seeker dashboard stats retrieved successfully",
    data: result,
  });
};

const controllers = {
  getAdminStats,
  getRecruiterStats,
  getJobSeekerStats,
};

export default controllers;
