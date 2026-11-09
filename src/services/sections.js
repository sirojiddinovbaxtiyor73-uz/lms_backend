import pool from "../config/db.js"
import { ErrorException } from "../utils/error.js"


class SectionsService {
    async getAllSection() {
        let sections = await pool.query("select id,name from sections")
        return {
            status: 200,
            data: sections.rows
        }
    }

    async createSection(req, res, next) {
        try {
            const { name, course_id } = req.body

            const existName = await pool.query(`select * from sections where name=$1`, [name])

            if (existName.rows.length) {
                return next(new ErrorException(409, "Section already exist"))
            }

            const existCourse = await pool.query(`select * from courses where id=$1`, [course_id])

            if (!existCourse.rows.length) {
                return next(new ErrorException(404, "Course not found"))
            }

            if (req.user.role !== "admin" && existCourse.rows[0].teacher_id != req.user.id) {
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

    async updateSection(req, res, next) {
        try {
            const { id } = req.params
            const { name } = req.body

            const section = await pool.query(`select s.id, s.course_id, c.teacher_id from sections s join courses c on c.id = s.course_id where s.id=$1`, [id])

            if (!section.rows.length) {
                return next(new ErrorException(404, "Section not found"))
            }

            if (req.user.role != 'admin' && section.rows[0].teacher_id != req.user.id) {
                return next(new ErrorException(403, "you can't edit the section"))
            }

            const existName = await pool.query(`select id from sections where name=$1 and course_id=$2 and id!=$3`, [name, section.rows[0].course_id, id])
            if(existName.rows.length){
                return next (new ErrorException(409,"Section already exist"))
            }

            await pool.query(`update sections set name=$1 where id=$2`,[name,id])

            return {
                status:200,
                message:"Section updated"
            }
        } catch (error) {
            return next(new ErrorException(500,error))
        }
    }

    async deleteSection(req,res,next){
        try {
            const {id} = req.params
            const section = await pool.query(`select s.id, c.teacher_id from sections s join courses c on c.id = s.course_id where s.id=$1`,[id])

            if(!section.rows.length){
                return next(new ErrorException(404,"Section not found"))
            }

            if(req.user.role != "admin" && section.rows[0].teacher_id != req.user.id){
                return next(new ErrorException(403,"you can't delete this section"))
            }

            await pool.query("delete  from sections where id=$1",[id])

            return {
                status:200,
                message:"section deleted"
            }
        } catch (error) {
            return next(new ErrorException(500,error))
        }
    }
}

const sectionsService = new SectionsService()
export default sectionsService