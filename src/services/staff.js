import pool from "../config/db.js"
import argon from "argon2"

class StaffService {
    constructor() { }

    async getStaffs() {
        const staffs = await pool.query("select id, fullname, phone, photo, role, status, created_at from staff")

        return {
            status: 200,
            data: staffs.rows
        }
    }

    async createStaff(req, res) {
        const { fullname, phone, password, role } = req.body

        let existStaff = await pool.query("select * from staff where phone=$1", [phone])
        if (existStaff.rows.length) {
            return {
                status: 409,
                message: "user already exist with this phone"
            }
        }

        const hashPass = await argon.hash(password)

        await pool.query(`insert into staff(fullname,phone,password,role) values($1,$2,$3,$4)`, [fullname, phone, hashPass, role])

        return {
            status: 201,
            message: "user succesfully created"
        }
    }

    async deleteStaff(req){
        const {userId} = req.params
        let existStaff = await pool.query("select * from staff where id=$1", [userId])
        if (!existStaff.rows.length) {
            return {
                status: 404,
                message: "user not found with this userId"
            }
        }

        await pool.query("update staff set status='inactive' where id=$1",[userId])
        
        return {
            status:200,
            message:"user deleted"
        }
    }
}

let staffService = new StaffService()
export default staffService