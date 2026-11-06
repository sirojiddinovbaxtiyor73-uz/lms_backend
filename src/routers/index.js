import staffRouter from "./staff.js"
import authRouter from "./auth.js"
import teacherRouter from "./teachers.js"
import studentRouter from "./students.js"
import categoryRouter from "./categories.js"
import courseRouter from "./courses.js"
import sectionRouter from "./sections.js"
import { Router } from "express"

const main=Router()

main.use("/api/v1",staffRouter)
    .use("/api/v1",authRouter)
    .use("/api/v1",teacherRouter)
    .use("/api/v1",studentRouter)
    .use("/api/v1", categoryRouter)
    .use("/api/v1", courseRouter)
    .use("/api/v1", sectionRouter)

export default main