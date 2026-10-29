import express from "express"
import main from "./routers/index.js"
import { configDotenv } from "dotenv"
configDotenv()

const app = express()
app.use(express.json())
app.use(main)

app.use((error,req,res,next)=>{
    if(error.status<500){
        return res.status(error.status).json({
            status:error.status,
            message:error.message
        })
    }
})

app.listen(process.env.PORT,()=>console.log("server is running"))