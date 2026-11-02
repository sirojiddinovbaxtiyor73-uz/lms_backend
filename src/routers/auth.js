import express from "express"
const router = express.Router()
import authController from "../controllers/auth.js"

router
    .post("/auth/login",authController.login)
    
export default router