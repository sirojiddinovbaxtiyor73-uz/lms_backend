import express from "express"
import main from "./routers/index.js"
import { configDotenv } from "dotenv"
configDotenv()

const app = express()
app.use(express.json())
app.use(main)

app.listen(process.env.PORT,()=>console.log("server is running"))