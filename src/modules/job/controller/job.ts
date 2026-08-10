import services from "@/job/service/job.js";
import { sendSuccessResponse } from "@/utils/sendResponse.js";
import type { Request, Response } from "express";
import status from "http-status";

const createJob = async (req: Request, res: Response) => {
  const result = await services.createJob(
    req.body,
    req.user!.id,
    req.user!.companyId,
  );

  sendSuccessResponse(res, status.CREATED, {
    message: "Job created successfully",
    data: result,
  });
};

const getJobs = async (req: Request, res: Response) => {
  const result = await services.getJobs(req.query);

  sendSuccessResponse(res, status.OK, {
    message: "Jobs retrieved successfully",
    ...result,
  });
};

const getJobsByUser = async (req: Request, res: Response) => {
  const result = await services.getJobsByUser(req.user!.id, req.query);

  sendSuccessResponse(res, status.OK, {
    message: "User jobs retrieved successfully",
    ...result,
  });
};

const getJobById = async (req: Request<{ id: string }>, res: Response) => {
  const result = await services.getJobById(req.params.id);

  sendSuccessResponse(res, status.OK, {
    message: "Job retrieved successfully",
    data: result,
  });
};

const updateJob = async (req: Request<{ id: string }>, res: Response) => {
  const result = await services.updateJob(
    req.params.id,
    req.body,
    req.user!.id,
  );

  sendSuccessResponse(res, status.OK, {
    message: "Job updated successfully",
    data: result,
  });
};

const deleteJob = async (req: Request<{ id: string }>, res: Response) => {
  const result = await services.deleteJob(req.params.id, req.user!.id);

  sendSuccessResponse(res, status.OK, {
    message: result.message,
  });
};

const updateJobStatus = async (req: Request<{ id: string }>, res: Response) => {
  const result = await services.updateJobStatus(
    req.params.id,
    req.body,
    req.user!.id,
  );

  sendSuccessResponse(res, status.OK, {
    message: "Job status updated successfully",
    data: result,
  });
};

const controllers = {
  createJob,
  getJobs,
  getJobsByUser,
  getJobById,
  updateJob,
  deleteJob,
  updateJobStatus,
};

export default controllers;
