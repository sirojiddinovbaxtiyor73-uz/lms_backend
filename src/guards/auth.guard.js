import { ErrorException } from "../utils/error.js"
import { verifyToken } from "../utils/jwt.js"

export const authGuard = async (req, res, next) => {
    try {
        let { token } = req.headers
        if (!token) {
            return next(new ErrorException(401, "UnauthorizedError"))
        }

        let user = verifyToken(token)       
        req.user = user
        return next()
    } catch (error) {
        if (error.name == "JsonWebTokenError") {
            return next(new ErrorException(401, error.message))
        }
        if (error.name == "TokenExpiredError") {
            return next(new ErrorException(401, error.message))
        }
        return next(new ErrorException(500, "Internal Server Error"))

    }
}