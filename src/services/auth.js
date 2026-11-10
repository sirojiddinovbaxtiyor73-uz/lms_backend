
import argon from "argon2"
import pool from "../config/db.js"
import { ErrorException } from "../utils/error.js"
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js"

class AuthService {
    async login(req, res, next) {

        const { phone, password } = req.body

        if (!phone || !password) {
            throw new ErrorException(400, "Phone and password are required")
        }

        let existUser = await pool.query(
            "select * from staff where phone=$1",
            [phone]
        )

        if (!existUser.rows.length) {
            existUser = await pool.query(
                "select * from teachers where phone=$1 and status='active'",
                [phone]
            )

            if (existUser.rows.length) {
                existUser.rows[0].role = "teacher"
            }
        }

        if (!existUser.rows.length) {
            existUser = await pool.query(
                "select * from students where phone=$1 and status='active'",
                [phone]
            )

            if (existUser.rows.length) {
                existUser.rows[0].role = "student"
            }
        }

        if (!existUser.rows.length) {
            throw new ErrorException(
                404,
                "User not found or password incorrect"
            )
        }

        if (!(await argon.verify(existUser.rows[0].password, password))) {
            throw new ErrorException(
                404,
                "User not found or password incorrect"
            )
        }

        return {
            status: 200,
            message: "User successfully login",

            accessToken: generateAccessToken({
                id: existUser.rows[0].id,
                phone: existUser.rows[0].phone,
                role: existUser.rows[0].role
            }),

            refreshToken: generateRefreshToken({
                id: existUser.rows[0].id,
                phone: existUser.rows[0].phone,
                role: existUser.rows[0].role
            }),

            role: existUser.rows[0].role
        }
    }
}

const authService = new AuthService()
export default authService
