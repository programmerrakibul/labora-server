import { authorize } from "@/middlewares/authorize.js";
import controllers from "@/user/controller/user.js";
import { Role } from "@/user/interface/user.js";
import { Router } from "express";

const router = Router();

router.get("/", authorize(Role.ADMIN), controllers.getUsers);
router.get("/:id", controllers.getUserById);

router.put("/profile", controllers.updateProfile);

router.patch(
  "/:id/status",
  authorize(Role.ADMIN),
  controllers.updateUserStatus,
);
router.patch("/:id/role", authorize(Role.ADMIN), controllers.updateUserRole);
router.delete("/:id", authorize(Role.ADMIN), controllers.deleteUser);

export default router;
