import express from "express"
const router = express.Router()
import examController from "../controllers/exams.js"
import validationMiddleware from "../middleware/validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

router
    .get("/exams/:lessonId", authGuard, roleGuard("admin", "teacher"), examController.getAllExams)
    .post("/exams", authGuard, roleGuard("admin", "teacher"), validationMiddleware.ExamCreate, examController.createExam)
    .patch("/exams/:examId", authGuard, roleGuard("admin", "teacher"), validationMiddleware.ExamUpdate, examController.updateExam)
    .delete("/exams/:examId", authGuard, roleGuard("admin", "teacher"), examController.deleteExam)

    .get("/exams/student/:lessonId", authGuard, roleGuard("student"), examController.getStudentExams)
    .post("/exams/student/:lessonId/submit", authGuard, roleGuard("student"), examController.submitStudentExam)


export default router