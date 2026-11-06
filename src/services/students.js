import pool from "../config/db.js"
import argon from "argon2"
import {ErrorException} from "../utils/error.js"

class StudentService {
    async getAllStudents() {
        let students = await pool.query("select id, fullname, phone, photo, created_at, status from students")
        return {
            status: 200,
            data: students.rows
        }
    }

    async createStudent(req, res, next) {
        try {
            const { fullname, phone, password } = req.body

            let hashPass = await argon.hash(password)

            await pool.query(`insert into students(fullname,phone,password)
                values($1,$2,$3)`, [fullname, phone, hashPass])

            return {
                status: 201,
                message: "Student added"
            }
        } catch (error) {
            return next(new ErrorException(500,error))
        }
    }
}

const studentService = new StudentService()
export default studentService