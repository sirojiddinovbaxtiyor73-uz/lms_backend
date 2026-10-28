import staffRouter from "./staff.js"
import { Router } from "express"


const main=Router()

main.use("/api/v1",staffRouter)

export default main