import controllers from "@/company/controller/company.js";
import { authorize } from "@/middlewares/authorize.js";
import { Role } from "@/user/interface/user.js";
import { Router } from "express";

const router = Router();

const ANY_AUTHENTICATED = Object.values(Role);

router.get("/", controllers.getCompanies);

router.get(
  "/me/membership",
  authorize(...ANY_AUTHENTICATED),
  controllers.getMyMembership,
);
router.delete(
  "/me/membership",
  authorize(Role.COMPANY_MEMBER),
  controllers.leaveCompany,
);

router.get("/:id", controllers.getCompanyById);

router.post("/", authorize(Role.JOB_SEEKER), controllers.createCompany);
router.put("/:id", authorize(Role.COMPANY_OWNER), controllers.updateCompany);
router.patch(
  "/:id/status",
  authorize(Role.ADMIN),
  controllers.updateCompanyStatus,
);
router.delete(
  "/:id",
  authorize(Role.COMPANY_OWNER, Role.ADMIN),
  controllers.deleteCompany,
);

router.post("/:id/join", authorize(Role.JOB_SEEKER), controllers.requestJoin);
router.delete(
  "/:id/join",
  authorize(...ANY_AUTHENTICATED),
  controllers.cancelJoinRequest,
);
router.get(
  "/:id/requests",
  authorize(Role.COMPANY_OWNER),
  controllers.getJoinRequests,
);
router.patch(
  "/:id/requests/:requestId",
  authorize(Role.COMPANY_OWNER),
  controllers.respondToRequest,
);
router.get(
  "/:id/members",
  authorize(Role.COMPANY_OWNER),
  controllers.getMembers,
);
router.delete(
  "/:id/members/:userId",
  authorize(Role.COMPANY_OWNER),
  controllers.removeMember,
);

export default router;
