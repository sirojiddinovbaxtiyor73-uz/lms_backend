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
        const {
            lesson_id,
            question,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_answer
        } = req.body

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

        if (
            req.user.role === "teacher" &&
            lesson.rows[0].teacher_id !== req.user.id
        ) {
            throw new ErrorException(403, "You can't add exam to this lesson")
        }

        if (lesson.rows[0].status !== "active") {
            throw new ErrorException(400, "Course is not active")
        }

        const result = await pool.query(
            `INSERT INTO exams
    (lesson_id, question, option_a, option_b, option_c, option_d, correct_answer)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    ON CONFLICT (lesson_id, (LOWER(TRIM(question))))
    DO NOTHING
    RETURNING *`,
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

        if (!result.rows.length) {
            throw new ErrorException(409, "Exam already exists")
        }

        return {
            status: 201,
            message: "Exam added",
            data: result.rows[0]
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


    async getStudentExams(req) {
        const lessonId = Number(req.params.lessonId)
        const studentId = req.user.id

        if (!Number.isInteger(lessonId) || lessonId <= 0) {
            throw new ErrorException(400, "Invalid lesson id")
        }

        const lesson = await pool.query(
            `select l.id, l.name, c.id as course_id, c.name as course_name
             from lessons l
             join sections s on s.id = l.section_id
             join courses c on c.id = s.course_id
             join studentcourse sc on sc.courses_id = c.id
             where l.id=$1 and sc.student_id=$2 and c.status='active'`,
            [lessonId, studentId]
        )

        if (!lesson.rows.length) {
            throw new ErrorException(404, "Lesson not found or course not enrolled")
        }

        const exams = await pool.query(
            `select id, lesson_id, question, option_a, option_b,
                    option_c, option_d
             from exams
             where lesson_id=$1
             order by id`,
            [lessonId]
        )

        return {
            status: 200,
            lesson: lesson.rows[0],
            total: exams.rows.length,
            data: exams.rows
        }
    }

    async submitStudentExam(req) {
        const lessonId = Number(req.params.lessonId)
        const studentId = req.user.id
        const { answers } = req.body

        if (!Number.isInteger(lessonId) || lessonId <= 0) {
            throw new ErrorException(400, "Invalid lesson id")
        }

        if (!Array.isArray(answers) || answers.length === 0) {
            throw new ErrorException(400, "Answers are required")
        }

        const lesson = await pool.query(
            `select l.id
             from lessons l
             join sections s on s.id = l.section_id
             join courses c on c.id = s.course_id
             join studentcourse sc on sc.courses_id = c.id
             where l.id=$1 and sc.student_id=$2 and c.status='active'`,
            [lessonId, studentId]
        )

        if (!lesson.rows.length) {
            throw new ErrorException(404, "Lesson not found or course not enrolled")
        }

        const exams = await pool.query(
            `select id, correct_answer
             from exams
             where lesson_id=$1
             order by id`,
            [lessonId]
        )

        if (!exams.rows.length) {
            throw new ErrorException(404, "No exams found")
        }

        const examIds = exams.rows.map(exam => exam.id)
        const submittedIds = answers.map(answer => Number(answer.exam_id))

        if (
            answers.length !== exams.rows.length ||
            new Set(submittedIds).size !== submittedIds.length ||
            submittedIds.some(id => !examIds.includes(id))
        ) {
            throw new ErrorException(400, "Invalid or incomplete answers")
        }

        for (const answer of answers) {
            if (!["A", "B", "C", "D"].includes(answer.answer)) {
                throw new ErrorException(400, "Answer must be A, B, C or D")
            }
        }

        let correctAnswers = 0

        const resultAnswers = exams.rows.map(exam => {
            const submitted = answers.find(
                answer => Number(answer.exam_id) === exam.id
            )

            const isCorrect = submitted.answer === exam.correct_answer

            if (isCorrect) correctAnswers++

            return {
                exam_id: exam.id,
                answer: submitted.answer,
                is_correct: isCorrect
            }
        })

        const totalQuestions = exams.rows.length
        const score = Math.round((correctAnswers / totalQuestions) * 100)

        await pool.query(
            `insert into exam_results
            (student_id, lesson_id, total_questions, correct_answers, score, answers)
            values($1,$2,$3,$4,$5,$6)`,
            [
                studentId,
                lessonId,
                totalQuestions,
                correctAnswers,
                score,
                JSON.stringify(resultAnswers)
            ]
        )

        return {
            status: 201,
            message: "Exam submitted successfully",
            result: {
                total_questions: totalQuestions,
                correct_answers: correctAnswers,
                wrong_answers: totalQuestions - correctAnswers,
                score
            }
        }
    }

}

const examsService = new ExamsService()
export default examsService