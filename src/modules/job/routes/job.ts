import controllers from "@/job/controller/job.js";
import { authorize } from "@/middlewares/authorize.js";
import { Role } from "@/user/interface/user.js";
import { Router } from "express";

const router = Router();

router.get("/", controllers.getJobs);
router.get("/user", controllers.getJobsByUser);
router.get("/:id", controllers.getJobById);

router.post("/", authorize(Role.RECRUITER), controllers.createJob);
router.put("/:id", authorize(Role.RECRUITER), controllers.updateJob);
router.patch("/:id/status", authorize(Role.RECRUITER), controllers.updateJobStatus);
router.delete("/:id", authorize(Role.RECRUITER), controllers.deleteJob);

export default router;
