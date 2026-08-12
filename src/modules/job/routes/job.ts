import controllers from "@/job/controller/job.js";
import { authorize } from "@/middlewares/authorize.js";
import { Role } from "@/user/interface/user.js";
import { Router } from "express";

const router = Router();

router.get("/", controllers.getJobs);
router.get(
  "/user",
  authorize(Role.COMPANY_OWNER, Role.COMPANY_MEMBER),
  controllers.getJobsByUser,
);
router.get("/:id", controllers.getJobById);

router.post(
  "/",
  authorize(Role.COMPANY_OWNER, Role.COMPANY_MEMBER),
  controllers.createJob,
);
router.put(
  "/:id",
  authorize(Role.COMPANY_OWNER, Role.COMPANY_MEMBER),
  controllers.updateJob,
);
router.patch(
  "/:id/status",
  authorize(Role.COMPANY_OWNER, Role.COMPANY_MEMBER),
  controllers.updateJobStatus,
);
router.delete(
  "/:id",
  authorize(Role.COMPANY_OWNER, Role.COMPANY_MEMBER),
  controllers.deleteJob,
);

export default router;
