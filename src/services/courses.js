import path from "path"
import pool from "../config/db.js"
import fs from "fs/promises"
import { ErrorException } from "../utils/error.js"
import { randomUUID } from "crypto"



const imageTypes = ["image/png", "image/jpeg", "image/svg+xml", "image/gif"]
const videoTypes = ["video/mp4", "video/webm"]
const maxBannerSize = 5 * 1024 * 1024

class CoursesService {

    async getAllCourses() {
        let courses = await pool.query("select * from courses")

        return {
            status: 200,
            data: courses.rows
        }
    }

    async createCourse(req) {
        const { name, description, level, price, category_id } = req.body
        const banner = req.files?.banner
        const introVideo = req.files?.introVideo
        const teacherId = req.user.role == "admin" ? req.body.teacher_id : req.user.id

        if (!teacherId) {
            throw new ErrorException(400, "teacher_id is required")
        }

        if (!banner) {
            throw new ErrorException(400, "Course banner must be upload")
        }

        if (!imageTypes.includes(banner.mimetype)) {
            throw new ErrorException(415, "Banner must be an image (png,jpg,svg)")
        }

        if (banner.size > maxBannerSize) {
            throw new ErrorException(413, "Banner must be less than 5MB")
        }

        if (introVideo && !videoTypes.includes(introVideo.mimetype)) {
            throw new ErrorException(415, "introVideo must be mp4 or webm")
        }

        const teacher = await pool.query(`select id from teachers where id=$1`, [teacherId])
        if (!teacher.rows.length) {
            throw new ErrorException(404, "Teacher not found")
        }

        const category = await pool.query(`select id from categories where id=$1`, [category_id])
        if (!category.rows.length) {
            throw new ErrorException(404, "Category not found")
        }

        const existCourse = await pool.query(`select id from courses where name=$1`, [name])
        if (existCourse.rows.length) {
            throw new ErrorException(409, "Course already exist")
        }

        const bannerName = randomUUID() + path.extname(banner.name)

        await banner.mv(path.join(process.cwd(), "src", "uploads", "banner", bannerName))

        let introVideoName = null
        if (introVideo) {
            introVideoName = randomUUID() + path.extname(introVideo.name)
            await introVideo.mv(path.join(process.cwd(), "src", "uploads", "introVideo", introVideoName))
        }

        try {
            await pool.query(
                `insert into courses (banner,intro_video,name,description,level,price,category_id,teacher_id)
                values($1,$2,$3,$4,$5,$6,$7,$8)`, [bannerName, introVideoName, name, description, level, price, category_id, teacherId]
            )
        } catch (error) {
            if (error.code == "23505") {
                throw new ErrorException(409, "Course already exist")
            }
            throw error
        }

        return {
            status: 201,
            message: "Course added!"
        }
    }

    async deleteCourse(req) {
        const courseId = Number(req.params.courseId)
        if (!Number.isInteger(courseId) || courseId <= 0) {
            throw new ErrorException(400, "Invalid course Id")
        }

        const course = await pool.query(`select teacher_id,banner,intro_video from courses where id=$1`, [courseId])
        if (!course.rows.length) {
            throw new ErrorException(404, "Course not found")
        }

        const { teacher_id, banner, intro_video } = course.rows[0]
        if (req.user.role == "teacher" && teacher_id != req.user.id) {
            throw new ErrorException(403, "Forbidden")
        }

        try {
            await pool.query(`delete from courses where id=$1`, [courseId])
        } catch (error) {
            if (error.code === "23503") {
                throw new ErrorException(409, "Course has related data and cannot be deleted")
            }
            throw error
        }

        await fs.unlink(path.join(process.cwd(), "src", "uploads", "banner", banner)).catch(() => { })
        if (intro_video) {
            await fs.unlink(path.join(process.cwd(), "src", "uploads", "introVideo", intro_video)).catch(() => { })
        }

        return {
            status: 200,
            message: "course deleted"
        }
    }

    async updateCourse(req) {
        const courseId = Number(req.params.courseId)
        if (!Number.isInteger(courseId) || courseId <= 0) {
            throw new ErrorException(400, "Invalid course id")
        }

        const course = await pool.query(
            "select teacher_id, banner, intro_video from courses where id=$1", [courseId]
        )
        if (!course.rows.length) {
            throw new ErrorException(404, "Course not found")
        }

        const { teacher_id, banner: oldBanner, intro_video: oldVideo } = course.rows[0]
        if (req.user.role === "teacher" && teacher_id !== req.user.id) {
            throw new ErrorException(403, "Forbidden")
        }

        const { name, description, level, price, category_id } = req.body ?? {}
        const banner = req.files?.banner
        const introVideo = req.files?.introVideo

        const hasData = [name, description, level, price, category_id].some(v => v !== undefined)
        if (!hasData && !banner && !introVideo) {
            throw new ErrorException(400, "Nothing to update")
        }

        if (banner) {
            if (!imageTypes.includes(banner.mimetype)) {
                throw new ErrorException(415, "Banner must be an image (png, jpg, svg, gif)")
            }
            if (banner.size > maxBannerSize) {
                throw new ErrorException(413, "Banner must be less than 5 MB")
            }
        }
        if (introVideo) {
            if (!videoTypes.includes(introVideo.mimetype)) {
                throw new ErrorException(415, "Intro video must be mp4")
            }
            if (introVideo.size > maxBannerSize) {
                throw new ErrorException(413, "Intro video must be less than 5 MB")
            }
        }

        if (name !== undefined) {
            const exist = await pool.query("select id from courses where name=$1 and id<>$2", [name, courseId])
            if (exist.rows.length) {
                throw new ErrorException(409, "Course already exist!")
            }
        }

        if (category_id !== undefined) {
            const category = await pool.query("select id from categories where id=$1", [category_id])
            if (!category.rows.length) {
                throw new ErrorException(404, "Category not found")
            }
        }

        let newBanner = null
        if (banner) {
            newBanner = randomUUID() + path.extname(banner.name)
            await banner.mv(path.join(process.cwd(), "src", "uploads", "banner", newBanner))
        }

        let newVideo = null
        if (introVideo) {
            newVideo = randomUUID() + path.extname(introVideo.name)
            await introVideo.mv(path.join(process.cwd(), "src", "uploads", "introVideo", newVideo))
        }

        try {
            await pool.query(
                `update courses set
                name = coalesce($1, name),
                description = coalesce($2, description),
                level = coalesce($3, level),
                price = coalesce($4, price),
                category_id = coalesce($5, category_id),
                banner = coalesce($6, banner),
                intro_video = coalesce($7, intro_video)
             where id = $8`,
                [name, description, level, price, category_id, newBanner, newVideo, courseId]
            )
        } catch (error) {
            if (newBanner) {
                await fs.unlink(path.join(process.cwd(), "src", "uploads", "banner", newBanner)).catch(() => { })
            }
            if (newVideo) {
                await fs.unlink(path.join(process.cwd(), "src", "uploads", "introVideo", newVideo)).catch(() => { })
            }

            if (error.code === "23505") {
                throw new ErrorException(409, "Course already exist!")
            }
            if (error.code === "23503") {
                throw new ErrorException(404, "Category not found")
            }
            throw error
        }

        if (newBanner) {
            await fs.unlink(path.join(process.cwd(), "src", "uploads", "banner", oldBanner)).catch(() => { })
        }
        if (newVideo && oldVideo) {
            await fs.unlink(path.join(process.cwd(), "src", "uploads", "introVideo", oldVideo)).catch(() => { })
        }

        return {
            status: 200,
            message: "course updated"
        }
    }


}

let coursesService = new CoursesService()
export default coursesService