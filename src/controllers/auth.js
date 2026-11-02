import authService from "../services/auth.js"
class AuthController {

    async login(req, res, next) {
        let resData = await authService.login(req, res, next)
        return res.status(resData.status).json(resData)

    }
}

const authController = new AuthController()
export default authController