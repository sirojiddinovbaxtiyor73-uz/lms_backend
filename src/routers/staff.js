import express from "express"
const router = express.Router()
import staffController from "../controllers/staff.js"
import validationMiddlaware from "../middleware/validation.js"

router
    .get("/staff",staffController.getAllStaff)
    .post("/staff",validationMiddlaware.staffCreate,staffController.createStaff)
    .delete("/staff/:userId",staffController.deleteStaff)
    
export default router