import express from "express"
import main from "./routers/index.js"
import fs from "fs"
import path from "path"
import fileUpload from "express-fileupload"
import { configDotenv } from "dotenv"
import { ErrorException } from "./utils/error.js"
configDotenv()

const app = express()
app.use(express.json())
app.use(fileUpload({
    limits: { fileSize: 100 * 1024 * 1024 },
    limitHandler: (req, res, next) => next(new ErrorException(413, "File too large"))
}))
app.use("/uploads", express.static(path.join(process.cwd(), "src", "uploads")))
app.use(main)

app.use((error, req, res, next) => {
    const status = error.status || 500
    if (status < 500) {
        return res.status(status).json({
            status,
            message: error.message
        })
    } 

        fs.appendFileSync(path.join(process.cwd(), "src", "log", "logger.txt"),
            `[${new Date().toLocaleString()}]-${req.method}-${req.url}-${error.message}\n`
        )
        return res.status(status).json({
            status,
            message: "Internal server error"
        })
})

app.listen(process.env.PORT, () => console.log("server is running"))