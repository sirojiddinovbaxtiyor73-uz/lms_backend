import pool from "../config/db.js"
import { ErrorException } from "../utils/error.js"

class PaymentsService {
    async getAllPayments() {
        const payments = await pool.query(
            `select p.id, p.student_id, s.fullname as student_name, s.photo as student_photo,
                    p.course_id, c.name as course_name, cat.name as category_name,
                    p.amount, p.type, p.status, p.created_at
             from payments p
             join students s on s.id = p.student_id
             join courses c on c.id = p.course_id
             left join categories cat on cat.id = c.category_id
             order by p.id`
        )

        return {
            status: 200,
            data: payments.rows
        }
    }

    async createPayment(req) {
        const { student_id, course_id, type, status } = req.body

        const student = await pool.query("select id, status from students where id=$1", [student_id])
        if (!student.rows.length) {
            throw new ErrorException(404, "Student not found")
        }
        if (student.rows[0].status === "inactive") {
            throw new ErrorException(409, "Student is inactive")
        }

        const course = await pool.query("select id, price, status from courses where id=$1", [course_id])
        if (!course.rows.length) {
            throw new ErrorException(404, "Course not found")
        }
        if (course.rows[0].status !== "active") {
            throw new ErrorException(400, "Course is not active")
        }

        const amount = req.body.amount ?? course.rows[0].price

        await pool.query(
            `insert into payments(student_id, course_id, amount, type, status)
             values($1,$2,$3,$4,$5)`,
            [student_id, course_id, amount, type, status]
        )

        return {
            status: 201,
            message: "Payment added"
        }
    }

    async getStudentPayments(req) {
        const studentId = Number(req.params.studentId)
        if (!Number.isInteger(studentId) || studentId <= 0) {
            throw new ErrorException(400, "Invalid student id")
        }

        const student = await pool.query(
            "select id, fullname, photo from students where id=$1", [studentId]
        )
        if (!student.rows.length) {
            throw new ErrorException(404, "Student not found")
        }

        const payments = await pool.query(
            `select p.id, p.course_id, c.name as course_name, cat.name as category_name,
                p.amount, p.type, p.status, p.created_at
         from payments p
         join courses c on c.id = p.course_id
         left join categories cat on cat.id = c.category_id
         where p.student_id=$1
         order by p.id`, [studentId]
        )

        return {
            status: 200,
            student: student.rows[0],
            data: payments.rows
        }
    }
}

const paymentsService = new PaymentsService()
export default paymentsService