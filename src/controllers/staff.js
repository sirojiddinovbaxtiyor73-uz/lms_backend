import staffService from "../services/staff.js"
import { ErrorException } from "../utils/error.js"
class StaffController {
    constructor() { }

    async getAllStaff(req, res, next) {
        try {
            let resData = await staffService.getStaffs()
            return res.status(resData.status).json(resData)
        } catch (error) {
            return next(
                error.status ? error : new ErrorException(500, error.message)
            )
        }

    }

    async createStaff(req, res, next) {
        try {
            let resData = await staffService.createStaff(req.body)
            return res.status(resData.status).json(resData)
        } catch (error) {
            return next(
                error.status ? error : new ErrorException(500, error.message)
            )
        }
    }

    async deleteStaff(req, res, next) {
        try {
            let resData = await staffService.createStaff(req.params)
            return res.status(resData.status).json(resData)
        } catch (error) {
            return next(
                error.status ? error : new ErrorException(500, error.message)
            )
        }
    }
}

const staffController = new StaffController()

export default staffController