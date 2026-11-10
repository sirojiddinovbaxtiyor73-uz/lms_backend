import express from "express"
const router = express.Router()
import materialController from "../controllers/materials.js"
import validationMiddleware from "../middleware/validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

router
    .get("/materials/:lessonId", authGuard, roleGuard("admin", "teacher"), materialController.getAllMaterials)
    .post("/materials", authGuard, roleGuard("admin", "teacher"), validationMiddleware.MaterialCreate, materialController.createMaterial)
    .patch("/materials/:materialId", authGuard, roleGuard("admin", "teacher"), validationMiddleware.MaterialUpdate, materialController.updateMaterial)
    .delete("/materials/:materialId", authGuard, roleGuard("admin", "teacher"), materialController.deleteMaterial)

export default router