import cors from "cors";
import dns from "dns";
import express from "express";

import { connectDB } from "@/config/db.js";
import { getEnv, NODE_ENV } from "@/config/env.js";
import { globalErrorHandler } from "@/middlewares/global-error-handler.js";
import { verifyToken } from "@/middlewares/verify-token.js";
import mountedRoutes from "./mounted-routes.js";

const { PORT, CLIENT_URL, ...env } = getEnv();
const app = express();

if (env.NODE_ENV !== NODE_ENV.PRODUCTION) {
  dns.setServers(["8.8.8.8", "8.8.4.4", "0.0.0.0"]);
}

app.use(verifyToken);
app.use(
  cors({
    origin: [CLIENT_URL],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    exposedHeaders: ["Set-Cookie"],
  }),
);

let db: Awaited<ReturnType<typeof connectDB>> | null = null;

try {
  db = await connectDB();

  mountedRoutes(app);

  app.use(globalErrorHandler);

  app.listen(PORT, () => {
    console.log("Server running in port:", PORT);
  });
} catch (error: unknown) {
  console.error("Error starting the server: ", error);

  if (db) db.disconnect();

  process.exit(1);
}

export default app;
