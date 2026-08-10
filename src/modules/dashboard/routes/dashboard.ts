import controllers from "@/dashboard/controller/dashboard.js";
import { authorize } from "@/middlewares/authorize.js";
import { Role } from "@/user/interface/user.js";
import { Router } from "express";

const router = Router();

router.get("/admin", authorize(Role.ADMIN), controllers.getAdminStats);
router.get(
  "/recruiter",
  authorize(Role.COMPANY_OWNER, Role.COMPANY_MEMBER),
  controllers.getRecruiterStats,
);
router.get(
  "/job-seeker",
  authorize(Role.JOB_SEEKER),
  controllers.getJobSeekerStats,
);

export default router;
