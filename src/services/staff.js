import pool from "../config/db.js"
import argon from "argon2"
import { InternalServerError, NotFoundError } from "../utils/error.js"

class StaffService {
    constructor() { }

    async getStaffs(req, res, next) {
        try {
            const staffs = await pool.query("select id, fullname, phone, photo, role, status, created_at from staff")

            return {
                status: 200,
                data: staffs.rows
            }

        } catch (error) {
            return next(new InternalServerError(500, error))

        }
    }

    async createStaff(req, res, next) {
        try {
            const { fullname, phone, password, role } = req.body

            let existStaff = await pool.query("select * from staff where phone=$1", [phone])
            if (existStaff.rows.length) {
                return next(new conflictError(409, "user already exist"))
            }

            const hashPass = await argon.hash(password)

            await pool.query(`insert into staff(fullname,phone,password,role) values($1,$2,$3,$4)`, [fullname, phone, hashPass, role])

            return {
                status: 201,
                message: "user succesfully created"
            }
        } catch (error) {
            return next(new InternalServerError(500, error))
        }
    }

    async deleteStaff(req, res, next) {
        try {
            const { userId } = req.params

            let existStaff = await pool.query("select * from staff where id=$1", [userId])
            if (!existStaff.rows.length) {
                next(new NotFoundError(404, "user not found with this userId"))

            }

            await pool.query("update staff set status='inactive' where id=$1", [userId])

            return {
                status: 200,
                message: "user deleted"
            }
        } catch (error) {
            return next(new InternalServerError(500, error))

        }
    }
}

let staffService = new StaffService()
export default staffService