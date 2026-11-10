import path from "path"
import fs from "fs/promises"
import { randomUUID } from "crypto"
import pool from "../config/db.js"
import { ErrorException } from "../utils/error.js"

const fileTypes = [
    "application/pdf",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/zip",
    "application/x-zip-compressed"
]
const maxFileSize = 10 * 1024 * 1024
const folder = path.join(process.cwd(), "src", "uploads", "tasks")

function parseId(value, label) {
    const id = Number(value)
    if (!Number.isInteger(id) || id <= 0) {
        throw new ErrorException(400, `Invalid ${label}`)
    }
    return id
}

function getPaging(query) {
    const page = Math.max(Number(query.page) || 1, 1)
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100)
    return { page, limit, offset: (page - 1) * limit }
}

function checkFile(file) {
    if (Array.isArray(file)) {
        throw new ErrorException(400, "Only one file allowed")
    }
    if (!fileTypes.includes(file.mimetype)) {
        throw new ErrorException(415, "File must be pdf, excel, csv, word, powerpoint or zip")
    }
    if (file.size > maxFileSize) {
        throw new ErrorException(413, "File must be less than 10 MB")
    }
}

async function saveFile(file) {
    await fs.mkdir(folder, { recursive: true })
    const fileName = randomUUID() + path.extname(file.name)
    await file.mv(path.join(folder, fileName))
    return fileName
}

class TasksService {
    async getLessonTasks(req) {
        const lessonId = parseId(req.params.lessonId, "lesson id")
        const { page, limit, offset } = getPaging(req.query)

        const lesson = await pool.query(
            `select l.id, l.name, c.id as course_id, c.name as course_name, c.teacher_id
             from lessons l
             join sections s on s.id = l.section_id
             join courses c on c.id = s.course_id
             where l.id=$1`, [lessonId]
        )
        if (!lesson.rows.length) {
            throw new ErrorException(404, "Lesson not found")
        }

        const { id, name, course_id, course_name, teacher_id } = lesson.rows[0]
        if (req.user.role === "teacher" && teacher_id !== req.user.id) {
            throw new ErrorException(403, "Forbidden")
        }

        const total = await pool.query(
            "select count(*)::int as count from tasks where lesson_id=$1", [lessonId]
        )
        const tasks = await pool.query(
            `select t.id, t.description, t.file, t.original_name, t.size, t.created_at,
             l.name as lesson_name
             from tasks t
             join lessons l on l.id = t.lesson_id
             where t.lesson_id=$1
             order by t.id
             limit $2 offset $3`, [lessonId, limit, offset]
        )

        return {
            status: 200,
            lesson: { id, name },
            course: { id: course_id, name: course_name },
            total: total.rows[0].count,
            page,
            limit,
            data: tasks.rows
        }
    }

    async getStudentTasks(req) {
        const studentId = parseId(req.params.studentId, "student id")
        if (req.user.role === "student" && req.user.id !== studentId) {
            throw new ErrorException(403, "Forbidden")
        }

        const lessonId = req.query.lesson_id ? parseId(req.query.lesson_id, "lesson id") : null
        const { page, limit, offset } = getPaging(req.query)

        const student = await pool.query(
            "select id, fullname, status from students where id=$1", [studentId]
        )
        if (!student.rows.length) {
            throw new ErrorException(404, "Student not found")
        }
        if (student.rows[0].status === "inactive") {
            throw new ErrorException(409, "Student is inactive")
        }

        const from = `from tasks t
             join lessons l on l.id = t.lesson_id
             join sections s on s.id = l.section_id
             join courses c on c.id = s.course_id
             join studentcourse sc on sc.courses_id = c.id and sc.student_id = $1
             where ($2::int is null or t.lesson_id = $2)`

        const total = await pool.query(`select count(*)::int as count ${from}`, [studentId, lessonId])
        const tasks = await pool.query(
            `select t.id, t.description, t.file, t.original_name, t.size, t.created_at,
                    l.id as lesson_id, l.name as lesson_name,
                    c.id as course_id, c.name as course_name
             ${from}
             order by t.id
             limit $3 offset $4`, [studentId, lessonId, limit, offset]
        )

        return {
            status: 200,
            student: { id: student.rows[0].id, fullname: student.rows[0].fullname },
            total: total.rows[0].count,
            page,
            limit,
            data: tasks.rows
        }
    }

    async createTask(req) {
        const { lesson_id } = req.body
        const description = req.body.description.trim()
        const file = req.files?.file

        const lesson = await pool.query(
            `select l.id, c.teacher_id, c.status
             from lessons l
             join sections s on s.id = l.section_id
             join courses c on c.id = s.course_id
             where l.id=$1`, [lesson_id]
        )
        if (!lesson.rows.length) {
            throw new ErrorException(404, "Lesson not found")
        }
        if (req.user.role === "teacher" && lesson.rows[0].teacher_id !== req.user.id) {
            throw new ErrorException(403, "You can't add task to this lesson")
        }
        if (lesson.rows[0].status !== "active") {
            throw new ErrorException(400, "Course is not active")
        }

        if (file) {
            checkFile(file)
        }

        let fileName = null
        if (file) {
            fileName = await saveFile(file)
        }

        try {
            await pool.query(
                `insert into tasks(lesson_id, description, file, original_name, size)
                 values($1,$2,$3,$4,$5)`,
                [lesson_id, description, fileName, file?.name ?? null, file?.size ?? null]
            )
        } catch (error) {
            if (fileName) {
                await fs.unlink(path.join(folder, fileName)).catch(() => { })
            }
            throw error
        }

        return {
            status: 201,
            message: "Task added"
        }
    }

    async updateTask(req) {
        const taskId = parseId(req.params.taskId, "task id")

        const task = await pool.query(
            `select t.file, c.teacher_id
             from tasks t
             join lessons l on l.id = t.lesson_id
             join sections s on s.id = l.section_id
             join courses c on c.id = s.course_id
             where t.id=$1`, [taskId]
        )
        if (!task.rows.length) {
            throw new ErrorException(404, "Task not found")
        }

        const { file: oldFile, teacher_id } = task.rows[0]
        if (req.user.role === "teacher" && teacher_id !== req.user.id) {
            throw new ErrorException(403, "Forbidden")
        }

        const description = req.body?.description?.trim()
        const file = req.files?.file

        if (description === undefined && !file) {
            throw new ErrorException(400, "Nothing to update")
        }

        if (file) {
            checkFile(file)
        }

        let newFile = null
        if (file) {
            newFile = await saveFile(file)
        }

        try {
            await pool.query(
                `update tasks set
                    description = coalesce($1, description),
                    file = coalesce($2, file),
                    original_name = coalesce($3, original_name),
                    size = coalesce($4, size)
                 where id=$5`,
                [description ?? null, newFile, file?.name ?? null, file?.size ?? null, taskId]
            )
        } catch (error) {
            if (newFile) {
                await fs.unlink(path.join(folder, newFile)).catch(() => { })
            }
            throw error
        }

        if (newFile && oldFile) {
            await fs.unlink(path.join(folder, oldFile)).catch(() => { })
        }

        return {
            status: 200,
            message: "Task updated"
        }
    }

    async deleteTask(req) {
        const taskId = parseId(req.params.taskId, "task id")

        const task = await pool.query(
            `select t.file, c.teacher_id
             from tasks t
             join lessons l on l.id = t.lesson_id
             join sections s on s.id = l.section_id
             join courses c on c.id = s.course_id
             where t.id=$1`, [taskId]
        )
        if (!task.rows.length) {
            throw new ErrorException(404, "Task not found")
        }

        const { file, teacher_id } = task.rows[0]
        if (req.user.role === "teacher" && teacher_id !== req.user.id) {
            throw new ErrorException(403, "Forbidden")
        }

        await pool.query("delete from tasks where id=$1", [taskId])

        if (file) {
            await fs.unlink(path.join(folder, file)).catch(() => { })
        }

        return {
            status: 200,
            message: "Task deleted"
        }
    }
}

const tasksService = new TasksService()
export default tasksService