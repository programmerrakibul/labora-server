import controllers from "@/upload/controller/upload.js";
import { upload } from "@/upload/service/upload.js";
import { Router } from "express";

const router = Router();

router.post("/upload", upload.single("file"), controllers.uploadFile);
router.get("/:id", controllers.getAssetById);
router.delete("/:id", controllers.deleteAsset);

export default router;
