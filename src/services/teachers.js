import pool from "../config/db.js"
import argon from "argon2"
import { ErrorException  } from "../utils/error.js"

class TeacherService {
    async createTeacher(req, res, next) {
        try {
            const { fullname, phone, password, photo, experience, job, description, portfolio, github, telegram, linkedin,facebook,instagram, status } = req.body
            let hashPass = await argon.hash(password)
            await pool.query(
                `insert into teachers (fullname, phone, password, experience, job, description, portfolio, github, telegram, linkedin, facebook, instagram, status)
                values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
                [fullname, phone, hashPass, experience, job, description, portfolio, github, telegram, linkedin,facebook,instagram, status || "active"])
            return {
                status: 201,
                message: "Teacher added!"
            }
        } catch (error) {
            if (error.code == "23505") {
                return next(new ErrorException(409, "This phone number was previously added by the teacher!"))
            }
            return next(new ErrorException(500, error))
        }
    }

    async getTeachers(req, res, next) {
        try {
            const teachers = await pool.query("select id, fullname, phone, photo, experience, job, description, portfolio, github, telegram, linkedin, status from teachers order by id")

            return {
                status: 200,
                data: teachers.rows
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async deleteTeacher(req, res, next) {
        try {
            const { teacherId } = req.params

            if (!Number.isInteger(Number(teacherId))) {
                return next(new ErrorException(404, "enter only integer for teacherID"));
            }

            let existTeacher = await pool.query("select id from teachers where id=$1", [teacherId])
            if (!existTeacher.rows.length) {
                return next(new ErrorException(404, "teacher not found with this teacherID"))
            }

            await pool.query("update teachers set status='inactive' where id=$1", [teacherId])
            return {
                status: 200,
                message: "teacher deleted"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }

    async updateTeacher(req, res, next) {
        try {
            const { teacherId } = req.params

            if (!Number.isInteger(Number(teacherId))) {
                return next(new ErrorException(404, "enter only intejer for teacherID"))
            }

            let existTeacher = await pool.query("select id from teachers where id=$1", [teacherId])
            if (!existTeacher.rows.length) {
                return next(new ErrorException(404, "teacher not found with this teacherID"))
            }

            const { fullname, phone, password, experience, job, description, portfolio, github, telegram, linkedin,facebook,instagram, status } = req.body
            let hashPass = password ? await argon.hash(password) : null

            await pool.query(
                `update teachers set
                    fullname = coalesce($1, fullname),
                    phone = coalesce($2, phone),
                    password = coalesce($3, password),
                    experience = coalesce($4, experience),
                    job = coalesce($5, job),
                    description = coalesce($6, description),
                    portfolio = coalesce($7, portfolio),
                    github = coalesce($8, github),
                    telegram = coalesce($9, telegram),
                    linkedin = coalesce($10, linkedin),
                    facebook = coalesce($11, facebook),
                    instagram = coalesce($12, instagram),
                    status = coalesce($13, status)
                 where id = $14`,
                [fullname, phone, hashPass, experience, job, description, portfolio, github, telegram, linkedin, facebook, instagram, status, teacherId]
            )

            return {
                status: 200,
                message: "teacher updated"
            }

        } catch (error) {
            if (error.code == "23505") {
                return next(new ErrorException(409, "This phone number was previously added by the teacher!"))
            }
            return next(new ErrorException(500, error))


        }
    }
}

const teacherService = new TeacherService()

export default teacherService