import express from "express"
const router = express.Router()
import sectionController from "../controllers/section.js"
import validationMiddleware from "../middleware/validation.js"
import {authGuard} from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

router
    .get("/sections",authGuard,roleGuard("teacher","admin"),sectionController.getAllSection)
    .post("/sections",authGuard,roleGuard("teacher","admin"),sectionController.createSections)
    .patch("/sections/:id",authGuard,roleGuard("teacher","admin"), sectionController.updateSection)
    .delete("/sections/:id",authGuard,roleGuard("teacher","admin"),sectionController.deleteSection)

export default router