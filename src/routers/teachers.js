import express from "express"
const router = express.Router()
import teacherController from "../controllers/teachers.js"
import courseController from "../controllers/courses.js"
import validationMiddleware from "../middleware/validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

router
    .get("/teachers", authGuard, roleGuard("admin"), teacherController.getTeachers)
    .get("/teachers/:teacherId/courses", authGuard, roleGuard("admin", "teacher"), courseController.getTeacherCourses)
    .post("/teachers", authGuard, roleGuard("admin"), validationMiddleware.teacherCreate, teacherController.createTeacher)
    .delete("/teachers/:teacherId", authGuard, roleGuard("admin"), teacherController.deleteTeacher)
    .patch("/teachers/:teacherId", authGuard, roleGuard("admin"), validationMiddleware.teacherUpdate, teacherController.updateTeacher)

export default router