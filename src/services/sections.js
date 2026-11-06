import pool from "../config/db.js"
import { ErrorException } from "../utils/error.js"


class SectionsService {
    async getAllSections() {
        let sections = await pool.query("select id,name from sections where status='active'")
        return {
            status: 200,
            data: sections.rows
        }
    }

    async createSections(req, res, next) {
        try {
            const { name, course_id } = req.body

            const existName = await pool.query(`select * from sections where name=$1`, [name])

            if (existName.rows.length) {
                return next(new ErrorException(409, "Section already exist"))
            }

            const existCourse = await pool.query(`select * from courses where id=$1`, [course_id])

            if (existCourse.rows.length) {
                return next(new ErrorException(404, "Course not found"))
            }

            if (existCourse.rows[0].teacher_id != req.user.id) {
                return next(new ErrorException(403, "you can't add section this course"))
            }

            if (existCourse.rows[0].status != "active") {
                return next(new ErrorException(400, "Course is not active"))
            }

            await pool.query(`insert into sections(name, course_id)
                values($1,$2)`, [name, course_id])

            return {
                status: 201,
                message: "Section added"
            }
        } catch (error) {
            return next(new ErrorException(500, error))
        }
    }
}

const sectionsService = new SectionsService()
export default sectionsService