import express from "express"
const router = express.Router()
import studentsController from "../controllers/students.js"
import validationMiddleware from "../middleware/validation.js"
import {authGuard} from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

router
    .get("/students/all",authGuard,roleGuard("admin"),studentsController.getAllStudents)
    .get("/students/:studentId",authGuard,roleGuard("admin"),studentsController.getOneStudent)
    .post("/students",validationMiddleware.createStudent,studentsController.createStudent)
    .delete("/students/:studentId",authGuard,roleGuard("admin"),studentsController.deleteStudent)
    .patch("/students/:studentId",authGuard,roleGuard("admin"),validationMiddleware.studentUpdate,studentsController.updateStudent)

export default router