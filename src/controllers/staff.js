import staffService from "../services/staff.js"
class StaffController {
    constructor() { }

    async getAllStaff(req, res) {
        let resData = await staffService.getStaffs()
        return res.status(resData.status).json(resData)

    }

    async createStaff(req, res, next) {
        let resData = await staffService.createStaff(req,res,next)

        if (resData.status >= 400) {
            return next(new ValidationError(400, error.message))
        }
        return res.status(resData.status).json(resData)
    }

    async deleteStaff(req, res,next) {
        let resData = await staffService.deleteStaff(req,res,next)
        return res.status(resData.status).json(resData)

    }
}

const staffController = new StaffController()

export default staffController