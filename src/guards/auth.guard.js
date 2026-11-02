import { InternalServerError, UnauthorizedError } from "../utils/error.js"
import { verifyToken } from "../utils/jwt.js"

export const authGuard = async (req, res, next) => {
    try {
        let { token } = req.headers
        if (!token) {
            return next(new UnauthorizedError(401, "UnauthorizedError"))
        }

        let user = verifyToken(token)       
        req.user = user
        return next()
    } catch (error) {
        if (error.name == "JsonWebTokenError") {
            return next(new UnauthorizedError(401, error.message))
        }
        if (error.name == "TokenExpiredEror") {
            return next(new UnauthorizedError(401, error.message))
        }
        return next(new InternalServerError(500, "Internal Server Error"))

    }
}