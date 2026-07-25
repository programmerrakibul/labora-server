import controllers from "@/application/controller/application.js";
import { authorize } from "@/middlewares/authorize.js";
import { Role } from "@/user/interface/user.js";
import { Router } from "express";

const router = Router();

router.get("/", controllers.getApplications);
router.get("/:id", controllers.getApplicationById);

router.post("/", authorize(Role.JOB_SEEKER), controllers.createApplication);
router.patch(
  "/:id/status",
  authorize(Role.RECRUITER, Role.ADMIN),
  controllers.updateApplicationStatus,
);
router.delete(
  "/:id",
  authorize(Role.JOB_SEEKER),
  controllers.withdrawApplication,
);

export default router;
