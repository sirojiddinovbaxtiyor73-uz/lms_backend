import express from "express"
const router = express.Router()
import teacherController from "../controllers/teachers.js"
import validationMiddleware from "../middleware/validation.js"
import {authGuard} from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

router
    .get("/teachers",authGuard,roleGuard("admin"),teacherController.getTeachers)
    .post("/teachers",teacherController.createTeacher)

export default router