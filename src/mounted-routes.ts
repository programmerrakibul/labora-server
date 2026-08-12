import { toNodeHandler } from "better-auth/node";
import express, { type Request, type Response } from "express";

import applicationRouter from "@/application/routes/application.js";
import companyRouter from "@/company/routes/company.js";
import { initAuth } from "@/config/auth.js";
import dashboardRouter from "@/dashboard/routes/dashboard.js";
import jobRouter from "@/job/routes/job.js";
import assetRouter from "@/upload/routes/upload.js";
import userRouter from "@/user/routes/user.js";
import { sendSuccessResponse } from "@/utils/sendResponse.js";
import { NOT_FOUND, OK } from "http-errors-enhanced";

const API_PREFIX = "/api" as const;

const mountedRoutes = (app: express.Application) => {
  const auth = initAuth();

  app.all(`${API_PREFIX}/auth/*splat`, toNodeHandler(auth));

  app.use(express.json());

  app.get("/", (_req: Request, res: Response) => {
    sendSuccessResponse(res, OK, { message: "Server is running" });
  });

  app.use(`${API_PREFIX}/users`, userRouter);
  app.use(`${API_PREFIX}/companies`, companyRouter);
  app.use(`${API_PREFIX}/jobs`, jobRouter);
  app.use(`${API_PREFIX}/applications`, applicationRouter);
  app.use(`${API_PREFIX}/assets`, assetRouter);
  app.use(`${API_PREFIX}/dashboard`, dashboardRouter);

  app.use((_req: Request, res: Response) => {
    res.status(NOT_FOUND).send({
      success: false,
      message: "Route not found",
    });
  });
};

export default mountedRoutes;
