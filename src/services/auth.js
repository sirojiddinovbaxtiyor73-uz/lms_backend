import argon from "argon2"
import pool from "../config/db.js"
import { InternalServerError, NotFoundError } from "../utils/error.js"
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js"
class AuthService {
    async login(req, res, next) {
        try {
            const { phone, password } = req.body

            let existUser = await pool.query("select * from staff where phone=$1", [phone])
            if (!existUser.rows.length) {
                existUser = await pool.query("select * from teachers where phone=$1", [phone])
                if (!existUser.rows.length) {
                    return next(new NotFoundError(404, "User not fund with phone or password incorrect"))
                }
                existUser.rows[0].role = "teacher"
            }

            if (!(await argon.verify(existUser.rows[0].password, password))) {
                return next(new NotFoundError(404, "User not fund with phone or password incorrect"))
            }

            return {
                status: 200,
                message: "User successfully login",
                accessToken: generateAccessToken({ id: existUser.rows[0].id, phone: existUser.rows[0].phone, role: existUser.rows[0].role }),
                refreshToken: generateRefreshToken({ id: existUser.rows[0].id, phone: existUser.rows[0].phone, role: existUser.rows[0].role }),
                role: existUser.rows[0].role
            }
        } catch (error) {
            return next(new InternalServerError(500, error))
        }
    }
}

const authService = new AuthService()
export default authService