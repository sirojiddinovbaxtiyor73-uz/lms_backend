import express from "express"
const router = express.Router()
import paymentController from "../controllers/payments.js"
import validationMiddleware from "../middleware/validation.js"
import { authGuard } from "../guards/auth.guard.js"
import { roleGuard } from "../guards/role.guard.js"

router
    .get("/payments", authGuard, roleGuard("admin","student"), paymentController.getAllPayments)
    .get("/payments/:studentId", authGuard, roleGuard("admin","student"), paymentController.getStudentPayments)
    .post("/payments", authGuard, roleGuard("admin","student"), validationMiddleware.PaymentCreate, paymentController.createPayment)

export default router