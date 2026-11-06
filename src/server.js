import express from "express"
import main from "./routers/index.js"
import fs from "fs"
import path from "path"
import fileUpload from "express-fileupload"
import { configDotenv } from "dotenv"
configDotenv()

const app = express()
app.use(express.json())
app.use(fileUpload())
app.use(main)

app.use((error,req,res,next)=>{
    if(error.status<500){
        return res.status(error.status).json({
            status:error.status,
            message:error.message
        })
    }else{

        fs.appendFileSync(path.join(process.cwd(),"src","log","logger.txt"),
        `[${new Date().toLocaleString()}]-${req.method}-${req.url}-${error.message}\n`
        )
        return res.status(error.status).json({
            status:error.status,
            message:"Internal server error"
        })
    }
})

app.listen(process.env.PORT,()=>console.log("server is running"))