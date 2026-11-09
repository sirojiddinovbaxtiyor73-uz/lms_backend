import express from "express"
const router = express.Router()
import lessonController from "../controllers/lessons.js"
import validationMiddleware from "../middleware/validation.js"
import {authGuard} from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

router
    .get("/lessons/:sectionId",authGuard,roleGuard("teacher","admin"),lessonController.getAllLessons)
    .post("/lessons",authGuard,roleGuard("teacher","admin"),validationMiddleware.LessonCreate,lessonController.createLesson)
    .patch("/lessons/:lessonId",authGuard,roleGuard("teacher","admin"),validationMiddleware.LessonUpdate, lessonController.updateLesson)
    .delete("/lessons/:lessonId",authGuard,roleGuard("teacher","admin"),lessonController.deleteLesson)

export default router