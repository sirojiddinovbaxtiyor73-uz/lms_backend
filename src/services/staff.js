import pool from "../config/db.js"
import argon from "argon2"
import { ErrorException } from "../utils/error.js"

class StaffService {
    constructor() { }

    async getStaffs() {
        const staffs = await pool.query("select id, fullname, phone, photo, role, status, created_at from staff")

        return {
            status: 200,
            data: staffs.rows
        }
    }

    async createStaff(data) {
        const { fullname, phone, password, role } = data

        let existStaff = await pool.query("select * from staff where phone=$1", [phone])
        if (existStaff.rows.length) {
            throw new ErrorException(409, "user already exist")
        }

        const hashPass = await argon.hash(password)

        await pool.query(`insert into staff(fullname,phone,password,role) values($1,$2,$3,$4)`, [fullname, phone, hashPass, role])

        return {
            status: 201,
            message: "user succesfully created"
        }
    }

    async deleteStaff(params) {
        const { userId } = params

        let existStaff = await pool.query("select * from staff where id=$1", [userId])
        if (!existStaff.rows.length) {
            throw new ErrorException(404, "user not found with this userId")

        }

        await pool.query("update staff set status='inactive' where id=$1", [userId])

        return {
            status: 200,
            message: "Staff deleted"
        }
    }
}

let staffService = new StaffService()
export default staffService