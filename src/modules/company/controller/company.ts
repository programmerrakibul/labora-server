import services from "@/company/service/company.js";
import { sendSuccessResponse } from "@/utils/sendResponse.js";
import type { Request, Response } from "express";
import { CREATED, OK } from "http-errors-enhanced";

const createCompany = async (req: Request, res: Response) => {
  const result = await services.createCompany(req.body, req.user!);

  sendSuccessResponse(res, CREATED, {
    message: "Company created successfully",
    data: result,
  });
};

const getCompanies = async (req: Request, res: Response) => {
  const result = await services.getCompanies(req.query);

  sendSuccessResponse(res, OK, {
    message: "Companies retrieved successfully",
    ...result,
  });
};

const getCompanyById = async (req: Request<{ id: string }>, res: Response) => {
  const result = await services.getCompanyById(req.params.id);

  sendSuccessResponse(res, OK, {
    message: "Company retrieved successfully",
    data: result,
  });
};

const updateCompany = async (req: Request<{ id: string }>, res: Response) => {
  const result = await services.updateCompany(
    req.params.id,
    req.body,
    req.user!.id,
  );

  sendSuccessResponse(res, OK, {
    message: "Company updated successfully",
    data: result,
  });
};

const deleteCompany = async (req: Request<{ id: string }>, res: Response) => {
  const result = await services.deleteCompany(req.params.id, req.user!.id);

  sendSuccessResponse(res, OK, {
    message: result.message,
  });
};

const requestJoin = async (req: Request<{ id: string }>, res: Response) => {
  const result = await services.requestJoin(req.params.id, req.user!.id);

  sendSuccessResponse(res, CREATED, {
    message: "Join request submitted successfully",
    data: result,
  });
};

const cancelJoinRequest = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const result = await services.cancelJoinRequest(req.params.id, req.user!.id);

  sendSuccessResponse(res, OK, {
    message: "Join request cancelled successfully",
    data: result,
  });
};

const getJoinRequests = async (req: Request<{ id: string }>, res: Response) => {
  const result = await services.getJoinRequests(
    req.params.id,
    req.user!.id,
    req.query,
  );

  sendSuccessResponse(res, OK, {
    message: "Join requests retrieved successfully",
    ...result,
  });
};

const respondToRequest = async (
  req: Request<{ id: string; requestId: string }>,
  res: Response,
) => {
  const result = await services.respondToRequest(
    req.params.id,
    req.params.requestId,
    req.body,
    req.user!.id,
  );

  sendSuccessResponse(res, OK, {
    message: "Join request updated successfully",
    data: result,
  });
};

const getMembers = async (req: Request<{ id: string }>, res: Response) => {
  const result = await services.getMembers(
    req.params.id,
    req.user!.id,
    req.query,
  );

  sendSuccessResponse(res, OK, {
    message: "Company members retrieved successfully",
    ...result,
  });
};

const removeMember = async (
  req: Request<{ id: string; userId: string }>,
  res: Response,
) => {
  const result = await services.removeMember(
    req.params.id,
    req.user!.id,
    req.params.userId,
  );

  sendSuccessResponse(res, OK, {
    message: "Member removed successfully",
    data: result,
  });
};

const leaveCompany = async (req: Request, res: Response) => {
  const result = await services.leaveCompany(req.user!.id, req.user!.companyId);

  sendSuccessResponse(res, OK, {
    message: "You left the company successfully",
    data: result,
  });
};

const getMyMembership = async (req: Request, res: Response) => {
  const result = await services.getMyMembership(req.user!.id);

  sendSuccessResponse(res, OK, {
    message: "Membership status retrieved successfully",
    data: result,
  });
};

const controllers = {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  requestJoin,
  cancelJoinRequest,
  getJoinRequests,
  respondToRequest,
  getMembers,
  removeMember,
  leaveCompany,
  getMyMembership,
};

export default controllers;
