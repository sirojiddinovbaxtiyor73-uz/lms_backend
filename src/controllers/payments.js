import paymentsService from "../services/payments.js"

class PaymentController {
    async getAllPayments(req, res, next) {
        try {
            const result = await paymentsService.getAllPayments(req)
            return res.status(result.status).json(result)
        } catch (error) {
            return next(error)
        }
    }

    async createPayment(req, res, next) {
        try {
            const result = await paymentsService.createPayment(req)
            return res.status(result.status).json(result)
        } catch (error) {
            return next(error)
        }
    }


    async getStudentPayments(req, res, next) {
        try {
            const result = await paymentsService.getStudentPayments(req)
            return res.status(result.status).json(result)
        } catch (error) {
            return next(error)
        }
    }
}

const paymentController = new PaymentController()
export default paymentController