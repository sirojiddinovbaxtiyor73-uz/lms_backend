import staffRouter from "./staff.js"
import authRouter from "./auth.js"
import teacherRouter from "./teachers.js"
import studentRouter from "./students.js"
import categoryRouter from "./categories.js"
import courseRouter from "./courses.js"
import sectionRouter from "./sections.js"
import lessonRouter from "./lessons.js"
import materialsRouter from "./materials.js"
import paymentsRouter from "./payments.js"
import tasksRouter from "./tasks.js"
import examsRouter from "./exams.js"
import { Router } from "express"

const main=Router()

main.use("/api/v1",staffRouter)
    .use("/api/v1",authRouter)
    .use("/api/v1",teacherRouter)
    .use("/api/v1",studentRouter)
    .use("/api/v1", categoryRouter)
    .use("/api/v1", courseRouter)
    .use("/api/v1", sectionRouter)
    .use("/api/v1", lessonRouter)
    .use("/api/v1", materialsRouter)
    .use("/api/v1", paymentsRouter)
    .use("/api/v1", tasksRouter)
    .use("/api/v1", examsRouter)

export default main