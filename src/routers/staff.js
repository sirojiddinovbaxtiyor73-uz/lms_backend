import express from "express"
const router = express.Router()
import staffController from "../controllers/staff.js"
import validationMiddlaware from "../middleware/validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

router
    .get("/staff",authGuard,roleGuard("admin"),staffController.getAllStaff)
    .post("/staff",authGuard,roleGuard("admin"),validationMiddlaware.staffCreate,staffController.createStaff)
    .delete("/staff/:userId",authGuard,roleGuard("admin"),staffController.deleteStaff)
    
export default router