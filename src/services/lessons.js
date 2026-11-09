import pool from "../config/db.js"
import path from "path"
import fs from "fs/promises"
import { randomUUID } from "crypto"
import { ErrorException } from "../utils/error.js"

const videoTypes = ["video/mp4", "video/quicktime"]
const maxVideoSize = 100 * 1024 * 1024
const folder = path.join(process.cwd(), "src", "uploads", "lessons")


class LessonsService {
    async getAllLessons(req) {
        const sectionId = Number(req.params.sectionId)

        if (!Number.isInteger(sectionId) || sectionId <= 0) {
            throw new ErrorException(400, "section_id is required")
        }

        const section = await pool.query(` select s.id, s.name, c.id as course_id, c.name as course_name, c.teacher_id from sections s join courses c on c.id = s.course_id where s.id=$1`, [sectionId])

        if (!section.rows.length) {
            throw new ErrorException(404, "Section not found")
        }

        const { id, name, course_id, course_name, teacher_id } = section.rows[0]
        if (req.user.role == 'teacher' && teacher_id != req.user.id) {
            throw new ErrorException(403, "Forbidden")
        }
        const lessons = await pool.query("select id, name, description, video from lessons where section_id=$1 order by id", [sectionId])
        return {
            status: 200,
            section: { id, name },
            course: { id: course_id, name: course_name },
            data: lessons.rows
        }
    }

    async createLesson(req) {
        const name = req.body.name.trim()
        const { description, section_id } = req.body
        const video = req.files?.video

        const section = await pool.query(`select s.id, c.teacher_id, c.status from sections s join courses c on c.id = s.course_id where s.id=$1`, [section_id])

        if (!section.rows.length) {
            throw new ErrorException(404, "Section not found")
        }

        if (req.user.role == "teacher" && section.rows[0].teacher_id != req.user.id) {
            throw new ErrorException(403, "You can't add lesson to this section")
        }

        if (section.rows[0].status != 'active') {
            throw new ErrorException(400, "Course is not active")
        }

        if (video) {
            if (!videoTypes.includes(video.mimetype)) {
                throw new ErrorException(415, "Video must be mp4 or mov")
            }
            if (video.size > maxVideoSize) {
                throw new ErrorException(413, "Video must be less than 100 mb")
            }
        }

        const exist = await pool.query("select id from lessons where name =$1 and section_id=$2", [name, section_id])

        if (exist.rows.length) {
            throw new ErrorException(409, "Lesson already exist")
        }

        let videoName = null
        if (video) {
            videoName = randomUUID() + path.extname(video.name)
            await video.mv(path.join(folder, videoName))
        }

        try {
            await pool.query(`insert into lessons(name,description,video,section_id) values($1,$2,$3,$4)`, [name, description, videoName, section_id])
        } catch (error) {
            if (videoName) {
                await fs.unlink(path.join(folder, videoName)).catch(() => { })
            }
            if (error.code == "23505") {
                throw new ErrorException(409, "Lesson already exist")
            }
            throw error
        }

        return {
            status: 201,
            message: "Lesson added"
        }
    }

    async updateLesson(req) {
        const lessonId = Number(req.params.lessonId)
        if (!Number.isInteger(lessonId) || lessonId <= 0) {
            throw new ErrorException(400, "Invalid lesson ID")
        }

        const lesson = await pool.query(`select l.section_id, l.video, c.teacher_id from lessons l join sections s on s.id = l.section_id join courses c on c.id = s.course_id where l.id=$1`, [lessonId])

        if (!lesson.rows.length) {
            throw new ErrorException(404, "lesson not found")
        }

        const { section_id, video: oldVideo, teacher_id } = lesson.rows[0]
        if (req.user.role === "teacher" && teacher_id !== req.user.id) {
            throw new ErrorException(403, "Forbidden")
        }

        const name = req.body?.name?.trim()
        const description = req.body?.description
        const video = req.files?.video

        if (name == undefined && description == undefined && !video) {
            throw new ErrorException(400, "Nothing to update")
        }

        if (video) {
            if (!videoTypes.includes(video.mimetype)) {
                throw new ErrorException(415, "Video must be mp4 or mov")
            }
            if (video.size > maxVideoSize) {
                throw new ErrorException(413, "Video must be less than 100 MB")
            }
        }

        if (name !== undefined) {
            const exist = await pool.query(
                "select id from lessons where name=$1 and section_id=$2 and id<>$3", [name, section_id, lessonId]
            )
            if (exist.rows.length) {
                throw new ErrorException(409, "Lesson already exist")
            }
        }

        let newVideo = null
        if (video) {
            newVideo = randomUUID() + path.extname(video.name)
            await video.mv(path.join(folder, newVideo))
        }

        try {
            await pool.query(
                `update lessons set
                name = coalesce($1, name),
                description = coalesce($2, description),
                video = coalesce($3, video)
                where id = $4`,
                [name, description, newVideo, lessonId])
        } catch (error) {
            if (newVideo) {
                await fs.unlink(path.join(folder, newVideo)).catch(() => { })
            }
            if (error.code == "23505") {
                throw new ErrorException(409, "Lesson already exist")
            }
            throw error
        }

        if (newVideo && oldVideo) {
            await fs.unlink(path.join(folder, oldVideo)).catch(() => { })
        }
        return {
            status: 200,
            message: "Lesson updated"
        }
    }

    async deleteLesson(req) {
        const lessonId = Number(req.params.lessonId)

        if (!Number.isInteger(lessonId) || lessonId <= 0) {
            throw new ErrorException(400, "Invalid lesson id")
        }

        const lesson = await pool.query(
            `select l.video, c.teacher_id
             from lessons l
             join sections s on s.id = l.section_id
             join courses c on c.id = s.course_id
             where l.id=$1`, [lessonId])
             
        if (!lesson.rows.length) {
            throw new ErrorException(404, "Lesson not found")
        }

        const { video, teacher_id } = lesson.rows[0]
        if (req.user.role === "teacher" && teacher_id !== req.user.id) {
            throw new ErrorException(403, "Forbidden")
        }

        try {
            await pool.query("delete from lessons where id=$1", [lessonId])
        } catch (error) {
            if (error.code === "23503") {
                throw new ErrorException(409, "Lesson has related data and cannot be deleted")
            }
            throw error
        }

        if (video) {
            await fs.unlink(path.join(folder, video)).catch(() => { })
        }

        return {
            status: 200,
            message: "Lesson deleted"
        }
    }
}

const lessonsService = new LessonsService()
export default lessonsService