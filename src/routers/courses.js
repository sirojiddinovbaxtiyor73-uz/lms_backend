import express from "express"
const router = express.Router()
import validationMiddleware from "../middleware/validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"
import courseController from "../controllers/courses.js"

router
    .get("/courses", authGuard, roleGuard("admin"), courseController.getAllCourses)
    .post("/courses", authGuard, roleGuard("admin", "teacher"), validationMiddleware.CourseCreate, courseController.createCourse)
    .delete("/courses/:courseId", authGuard, roleGuard("admin", "teacher"), courseController.deleteCourse)
    .patch("/courses/:courseId", authGuard, roleGuard("admin", "teacher"), validationMiddleware.CourseUpdate, courseController.updateCourse)
export default router