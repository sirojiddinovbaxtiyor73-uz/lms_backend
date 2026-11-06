import authService from "../services/auth.js"
import { ErrorException } from "../utils/error.js"
class AuthController {

    async login(req, res, next) {
        try {
            let resData = await authService.login(req, res, next)
            return res.status(resData.status).json(resData)
        } catch (error) {
            if (error.code = "23505") {
                return next(new ErrorException(500, error.message))
            }

            return next(
                error.status ? error : new ErrorException(500, error.message)
            )

        }

    }
}

const authController = new AuthController()
export default authController