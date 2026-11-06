import express from "express"
const router = express.Router()
import studentsController from "../controllers/students.js"
import validationMiddleware from "../middleware/validation.js"
import {authGuard} from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

router
    .get("/students",authGuard,roleGuard("admin"),studentsController.getAllStudents)
    .post("/students",validationMiddleware.createStudent,studentsController.createStudent)

export default router