import express from "express"
const router = express.Router()
import taskController from "../controllers/tasks.js"
import validationMiddleware from "../middleware/validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

router
    .get("/tasks/:lessonId", authGuard, roleGuard("admin", "teacher"), taskController.getLessonTasks)
    .get("/tasks/student/:studentId", authGuard, roleGuard("admin", "student"), taskController.getStudentTasks)
    .post("/tasks", authGuard, roleGuard("admin", "teacher"), validationMiddleware.TaskCreate, taskController.createTask)
    .patch("/tasks/:taskId", authGuard, roleGuard("admin", "teacher"), validationMiddleware.TaskUpdate, taskController.updateTask)
    .delete("/tasks/:taskId", authGuard, roleGuard("admin", "teacher"), taskController.deleteTask)

export default router