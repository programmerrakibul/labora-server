import services from "@/upload/service/upload.js";
import { sendSuccessResponse } from "@/utils/sendResponse.js";
import type { Request, Response } from "express";
import { UnprocessableEntityError } from "http-errors-enhanced";
import status from "http-status";

const uploadFile = async (req: Request, res: Response) => {
  if (!req.file) {
    throw new UnprocessableEntityError("No file uploaded.");
  }

  const result = await services.createAsset(req.file);

  sendSuccessResponse(res, status.CREATED, {
    message: "File uploaded successfully",
    data: result,
  });
};

const getAssetById = async (req: Request<{ id: string }>, res: Response) => {
  const result = await services.getAssetById(req.params.id);

  sendSuccessResponse(res, status.OK, {
    message: "Asset retrieved successfully",
    data: result,
  });
};

const deleteAsset = async (req: Request<{ id: string }>, res: Response) => {
  const result = await services.deleteAsset(req.params.id);

  sendSuccessResponse(res, status.OK, {
    message: result.message,
  });
};

const controllers = {
  uploadFile,
  getAssetById,
  deleteAsset,
};

export default controllers;
