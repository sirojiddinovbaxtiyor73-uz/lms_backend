import pool from "../config/db.js"
import argon from "argon2"
import { InternalServerError } from "../utils/error.js"

class TeacherService {
    async createTeacher(req, res, next) {
        try {
            const { fullname, phone, password, photo, experience, job, description, portfolio, github, telegram, linkedin, status } = req.body
            let hashPass = await argon.hash(password)
            await pool.query(
                `insert into teachers (fullname, phone, password, photo, experience, job, description, portfolio, github, telegram, linkedin, status)
             values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
                [fullname, phone, hashPass, photo, experience, job, description, portfolio, github, telegram, linkedin, status])
            return {
                status: 201,
                message: "Teacher added!"
            }
        } catch (error) {
            return next(new InternalServerError(500, error))
        }
    }

    async getTeachers(req, res, next) {
        try {
            const teachers = await pool.query("select id, fullname, phone, photo, experience, job, description, portfolio, github, telegram, linkedin, status from teachers ")

            return {
                status: 200,
                data: teachers.rows
            }
        } catch (error) {
            return next(new InternalServerError(500, error))
        }
    }
}

const teacherService = new TeacherService()

export default teacherService