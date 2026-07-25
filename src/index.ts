import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express, { type Request, type Response } from "express";
import status from "http-status";

import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4", "0.0.0.0"]);

import applicationRouter from "@/application/routes/application.js";
import { initAuth } from "@/config/auth.js";
import { connectDB } from "@/config/db.js";
import { getEnv } from "@/config/env.js";
import dashboardRouter from "@/dashboard/routes/dashboard.js";
import jobRouter from "@/job/routes/job.js";
import { globalErrorHandler } from "@/middlewares/global-error-handler.js";
import { verifyToken } from "@/middlewares/verify-token.js";
import assetRouter from "@/upload/routes/upload.js";
import userRouter from "@/user/routes/user.js";
import { sendSuccessResponse } from "@/utils/sendResponse.js";

const app = express();
const { PORT, CLIENT_URL, BETTER_AUTH_URL } = getEnv();
const API_PREFIX = "/api" as const;

app.use(verifyToken);
app.use(
  cors({
    origin: ["http://localhost:5173", CLIENT_URL, BETTER_AUTH_URL],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);

const startServer = async () => {
  const db = await connectDB();
  const auth = initAuth();

  try {
    app.all(`${API_PREFIX}/auth/*splat`, toNodeHandler(auth));

    app.use(express.json());

    app.get("/", (_req: Request, res: Response) => {
      sendSuccessResponse(res, status.OK, { message: "Server is running" });
    });

    app.use(`${API_PREFIX}/users`, userRouter);
    app.use(`${API_PREFIX}/jobs`, jobRouter);
    app.use(`${API_PREFIX}/applications`, applicationRouter);
    app.use(`${API_PREFIX}/assets`, assetRouter);
    app.use(`${API_PREFIX}/dashboard`, dashboardRouter);

    app.use((_req: Request, res: Response) => {
      res.status(status.NOT_FOUND).send({
        success: false,
        message: "Route not found",
      });
    });

    app.use(globalErrorHandler);
  } catch (error: unknown) {
    console.error(error);

    if (db) db.disconnect();

    process.exit(1);
  }
};

app.listen(PORT, () => {
  console.log("Server running in port:", PORT);
});

startServer();
