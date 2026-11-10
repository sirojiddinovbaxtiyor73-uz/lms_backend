import pool from "../config/db.js"
import { ErrorException } from "../utils/error.js"

class ExamsService {

    async getAllExams(req) {
        const lessonId = Number(req.params.lessonId)

        if (!Number.isInteger(lessonId) || lessonId <= 0) {
            throw new ErrorException(400, "Invalid lesson id")
        }

        const lesson = await pool.query(
            `select l.id, l.name, c.id as course_id,
             c.name as course_name, c.teacher_id
             from lessons l
             join sections s on s.id = l.section_id
             join courses c on c.id = s.course_id
             where l.id=$1`,
            [lessonId]
        )

        if (!lesson.rows.length) {
            throw new ErrorException(404, "Lesson not found")
        }

        const { id, name, course_id, course_name, teacher_id } = lesson.rows[0]

        if (req.user.role === "teacher" && teacher_id !== req.user.id) {
            throw new ErrorException(403, "Forbidden")
        }

        const exams = await pool.query(
            `select * from exams
             where lesson_id=$1
             order by id`,
            [lessonId]
        )

        return {
            status: 200,
            lesson: { id, name },
            course: { id: course_id, name: course_name },
            data: exams.rows
        }
    }

    async createExam(req) {
        const { lesson_id, question, option_a, option_b, option_c, option_d, correct_answer } = req.body

        const lesson = await pool.query(
            `select l.id, c.teacher_id, c.status
             from lessons l
             join sections s on s.id = l.section_id
             join courses c on c.id = s.course_id
             where l.id=$1`,
            [lesson_id]
        )

        if (!lesson.rows.length) {
            throw new ErrorException(404, "Lesson not found")
        }

        if (req.user.role === "teacher" && lesson.rows[0].teacher_id !== req.user.id) {
            throw new ErrorException(403, "You can't add exam to this lesson")
        }

        if (lesson.rows[0].status !== "active") {
            throw new ErrorException(400, "Course is not active")
        }

        await pool.query(
            `insert into exams
            (lesson_id, question, option_a, option_b, option_c, option_d, correct_answer)
            values($1,$2,$3,$4,$5,$6,$7)`,
            [
                lesson_id,
                question.trim(),
                option_a.trim(),
                option_b.trim(),
                option_c.trim(),
                option_d.trim(),
                correct_answer
            ]
        )

        return {
            status: 201,
            message: "Exam added"
        }
    }

    async updateExam(req) {
        const examId = Number(req.params.examId)

        if (!Number.isInteger(examId) || examId <= 0) {
            throw new ErrorException(400, "Invalid exam id")
        }

        const exam = await pool.query(
            `select e.id, c.teacher_id
             from exams e
             join lessons l on l.id = e.lesson_id
             join sections s on s.id = l.section_id
             join courses c on c.id = s.course_id
             where e.id=$1`,
            [examId]
        )

        if (!exam.rows.length) {
            throw new ErrorException(404, "Exam not found")
        }

        if (req.user.role === "teacher" && exam.rows[0].teacher_id !== req.user.id) {
            throw new ErrorException(403, "Forbidden")
        }

        const {
            question,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_answer
        } = req.body ?? {}

        await pool.query(
            `update exams set
                question = coalesce($1, question),
                option_a = coalesce($2, option_a),
                option_b = coalesce($3, option_b),
                option_c = coalesce($4, option_c),
                option_d = coalesce($5, option_d),
                correct_answer = coalesce($6, correct_answer)
             where id=$7`,
            [
                question?.trim(),
                option_a?.trim(),
                option_b?.trim(),
                option_c?.trim(),
                option_d?.trim(),
                correct_answer,
                examId
            ]
        )

        return {
            status: 200,
            message: "Exam updated"
        }
    }

    async deleteExam(req) {
        const examId = Number(req.params.examId)

        if (!Number.isInteger(examId) || examId <= 0) {
            throw new ErrorException(400, "Invalid exam id")
        }

        const exam = await pool.query(
            `select e.id, c.teacher_id
             from exams e
             join lessons l on l.id = e.lesson_id
             join sections s on s.id = l.section_id
             join courses c on c.id = s.course_id
             where e.id=$1`,
            [examId]
        )

        if (!exam.rows.length) {
            throw new ErrorException(404, "Exam not found")
        }

        if (req.user.role === "teacher" && exam.rows[0].teacher_id !== req.user.id) {
            throw new ErrorException(403, "Forbidden")
        }

        await pool.query(
            "delete from exams where id=$1",
            [examId]
        )

        return {
            status: 200,
            message: "Exam deleted"
        }
    }
}

const examsService = new ExamsService()
export default examsService