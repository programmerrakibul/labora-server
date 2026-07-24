import controllers from "@/user/controller/user.js";
import { Router } from "express";

const router = Router();

router.get("/", controllers.getUsers);
router.get("/:id", controllers.getUserById);

export default router;
